from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse
from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.core.database import get_db
from app.deps import get_current_tenant_id
from app.models import (
    Customer,
    Product,
    Tenant,
    WhatsAppConversation,
    WhatsAppMessage,
)
from app.schemas.common import (
    WhatsAppConversationOut,
    WhatsAppMessageIn,
    WhatsAppMessageOut,
)
from app.services.ai import whatsapp_reply
from app.services.whatsapp import send_text

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])


@router.get("/conversations", response_model=list[WhatsAppConversationOut])
def list_conversations(
    status: str | None = None,
    limit: int = 100,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> list[WhatsAppConversation]:
    stmt = (
        select(WhatsAppConversation)
        .where(WhatsAppConversation.tenant_id == tenant_id)
        .options(selectinload(WhatsAppConversation.messages))
        .order_by(desc(WhatsAppConversation.last_message_at))
        .limit(limit)
    )
    if status:
        stmt = stmt.where(WhatsAppConversation.status == status)
    return list(db.scalars(stmt))


@router.get("/conversations/{conv_id}", response_model=WhatsAppConversationOut)
def get_conversation(
    conv_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> WhatsAppConversation:
    conv = db.get(WhatsAppConversation, conv_id)
    if not conv or conv.tenant_id != tenant_id:
        raise HTTPException(404, "Conversation not found")
    return conv


@router.post("/conversations/{conv_id}/send", response_model=WhatsAppMessageOut)
async def send_message(
    conv_id: int,
    data: WhatsAppMessageIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> WhatsAppMessage:
    """Send a manual (human) outbound message."""
    conv = db.get(WhatsAppConversation, conv_id)
    if not conv or conv.tenant_id != tenant_id:
        raise HTTPException(404, "Conversation not found")

    await send_text(conv.phone, data.content)
    msg = WhatsAppMessage(
        conversation_id=conv_id,
        direction="outbound",
        sender="human",
        content=data.content,
    )
    db.add(msg)
    conv.last_message_at = datetime.utcnow()
    db.commit()
    db.refresh(msg)
    return msg


@router.post("/simulate", response_model=WhatsAppMessageOut)
async def simulate_incoming(
    data: WhatsAppMessageIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> WhatsAppMessage:
    """Simulate an incoming WhatsApp message and let the AI agent answer.

    Useful in development to exercise the agent without configuring Meta webhooks.
    """
    return await _handle_incoming(tenant_id, data.phone, data.content, db)


@router.get("/webhook")
def webhook_verify(
    hub_mode: str = Query(alias="hub.mode"),
    hub_challenge: str = Query(alias="hub.challenge"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
) -> PlainTextResponse:
    """Meta webhook verification."""
    if hub_mode == "subscribe" and hub_verify_token == settings.whatsapp_verify_token:
        return PlainTextResponse(hub_challenge)
    raise HTTPException(403, "Invalid verify token")


@router.post("/webhook")
async def webhook_inbound(request: Request, db: Session = Depends(get_db)) -> dict:
    """Meta inbound webhook: receives WhatsApp messages from clients.

    Routes to the tenant by phone_number_id (requires a mapping in production).
    For MVP: uses the first tenant in DB.
    """
    body = await request.json()
    try:
        entry = body["entry"][0]["changes"][0]["value"]
        messages = entry.get("messages", [])
        if not messages:
            return {"ok": True, "no_message": True}
        msg = messages[0]
        phone = msg["from"]
        content = msg["text"]["body"]
        contact = entry.get("contacts", [{}])[0]
        contact_name = contact.get("profile", {}).get("name")
    except (KeyError, IndexError):
        return {"ok": True, "malformed": True}

    first_tenant = db.scalar(select(Tenant).limit(1))
    if not first_tenant:
        return {"ok": False, "error": "no tenant"}

    await _handle_incoming(first_tenant.id, phone, content, db, contact_name=contact_name)
    return {"ok": True}


async def _handle_incoming(
    tenant_id: int,
    phone: str,
    content: str,
    db: Session,
    contact_name: str | None = None,
) -> WhatsAppMessage:
    conv = db.scalar(
        select(WhatsAppConversation).where(
            WhatsAppConversation.tenant_id == tenant_id,
            WhatsAppConversation.phone == phone,
        )
    )
    customer = db.scalar(
        select(Customer).where(Customer.tenant_id == tenant_id, Customer.whatsapp == phone)
    )
    if not conv:
        conv = WhatsAppConversation(
            tenant_id=tenant_id,
            phone=phone,
            contact_name=contact_name or (customer.name if customer else None),
            customer_id=customer.id if customer else None,
            status="open",
            ai_enabled=True,
            last_message_at=datetime.utcnow(),
        )
        db.add(conv)
        db.flush()

    inbound = WhatsAppMessage(
        conversation_id=conv.id, direction="inbound", sender="customer", content=content
    )
    db.add(inbound)
    conv.last_message_at = datetime.utcnow()
    db.flush()

    if conv.ai_enabled:
        tenant = db.get(Tenant, tenant_id)
        products = list(
            db.scalars(
                select(Product).where(Product.tenant_id == tenant_id).limit(40)
            )
        )
        catalog = "\n".join(
            f"- {p.sku} · {p.name} · ${float(p.price):.2f} · stock {float(p.stock)}"
            for p in products
        )
        history = [
            {"role": "user" if m.direction == "inbound" else "assistant", "content": m.content}
            for m in conv.messages[-12:]
        ]
        reply, derive = whatsapp_reply(
            business_name=tenant.name if tenant else "la empresa",
            customer_name=conv.contact_name,
            catalog_snippet=catalog,
            conversation=history,
        )
        outbound = WhatsAppMessage(
            conversation_id=conv.id, direction="outbound", sender="ai", content=reply
        )
        db.add(outbound)
        conv.last_message_at = datetime.utcnow()
        if derive:
            conv.status = "human"
            conv.ai_enabled = False
        await send_text(phone, reply)

    db.commit()
    db.refresh(inbound)
    return inbound
