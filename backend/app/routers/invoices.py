from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.deps import get_current_tenant_id
from app.models import Customer, Invoice, InvoiceItem, Payment, Tenant
from app.schemas.common import InvoiceIn, InvoiceOut, PaymentIn
from app.services.afip import issue_cae, next_invoice_number

router = APIRouter(prefix="/invoices", tags=["invoices"])

IVA_RATE = 0.21


@router.get("", response_model=list[InvoiceOut])
def list_invoices(
    status: str | None = None,
    customer_id: int | None = None,
    limit: int = 100,
    offset: int = 0,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> list[Invoice]:
    stmt = (
        select(Invoice)
        .where(Invoice.tenant_id == tenant_id)
        .options(selectinload(Invoice.items))
        .order_by(desc(Invoice.issue_date), desc(Invoice.id))
        .limit(limit)
        .offset(offset)
    )
    if status:
        stmt = stmt.where(Invoice.status == status)
    if customer_id:
        stmt = stmt.where(Invoice.customer_id == customer_id)
    return list(db.scalars(stmt))


@router.post("", response_model=InvoiceOut, status_code=201)
def create_invoice(
    data: InvoiceIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Invoice:
    customer = db.get(Customer, data.customer_id)
    if not customer or customer.tenant_id != tenant_id:
        raise HTTPException(400, "Invalid customer")

    last = db.scalar(
        select(Invoice.number)
        .where(Invoice.tenant_id == tenant_id)
        .order_by(desc(Invoice.id))
        .limit(1)
    )
    number = next_invoice_number(last, data.invoice_type)

    invoice = Invoice(
        tenant_id=tenant_id,
        customer_id=data.customer_id,
        number=number,
        invoice_type=data.invoice_type,
        due_date=data.due_date,
        status="draft",
    )

    subtotal = 0.0
    for item_data in data.items:
        total = round(item_data.quantity * item_data.unit_price, 2)
        subtotal += total
        item = InvoiceItem(
            product_id=item_data.product_id,
            description=item_data.description,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            total=total,
        )
        invoice.items.append(item)

    tax = round(subtotal * IVA_RATE, 2) if data.invoice_type in ("A", "B") else 0
    invoice.subtotal = subtotal
    invoice.tax = tax
    invoice.total = round(subtotal + tax, 2)

    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


@router.post("/{invoice_id}/issue", response_model=InvoiceOut)
def issue_invoice(
    invoice_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Invoice:
    """Request CAE from AFIP (mocked) and mark invoice as issued."""
    invoice = db.get(Invoice, invoice_id)
    if not invoice or invoice.tenant_id != tenant_id:
        raise HTTPException(404, "Invoice not found")
    if invoice.status != "draft":
        raise HTTPException(400, "Invoice already issued")

    tenant = db.get(Tenant, tenant_id)
    cae, cae_due = issue_cae(invoice.number, tenant.tax_id or "30-00000000-0", float(invoice.total))
    invoice.afip_cae = cae
    invoice.afip_cae_due = cae_due
    invoice.status = "issued"
    invoice.issue_date = date.today()
    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(
    invoice_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Invoice:
    invoice = db.get(Invoice, invoice_id)
    if not invoice or invoice.tenant_id != tenant_id:
        raise HTTPException(404, "Invoice not found")
    return invoice


@router.post("/{invoice_id}/payments", status_code=201)
def add_payment(
    invoice_id: int,
    data: PaymentIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> dict:
    invoice = db.get(Invoice, invoice_id)
    if not invoice or invoice.tenant_id != tenant_id:
        raise HTTPException(404, "Invoice not found")

    payment = Payment(invoice_id=invoice_id, **data.model_dump())
    db.add(payment)
    db.flush()

    total_paid = sum(float(p.amount) for p in invoice.payments)
    if total_paid >= float(invoice.total):
        invoice.status = "paid"

    db.commit()
    return {"ok": True, "total_paid": total_paid, "status": invoice.status}
