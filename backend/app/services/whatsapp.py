"""WhatsApp Cloud API service (Meta).

Sends outbound messages using the Graph API. Inbound messages arrive via
webhook (see routers/whatsapp.py).
"""

from __future__ import annotations

import httpx

from app.core.config import settings


async def send_text(to_phone: str, body: str) -> dict:
    """Send a text message. Returns Meta API response.

    In dev (no token set), pretends to send and returns a mock response.
    """
    if not settings.whatsapp_access_token or not settings.whatsapp_phone_number_id:
        return {
            "mock": True,
            "to": to_phone,
            "body": body,
            "note": "Configure WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID to send real messages",
        }

    url = (
        f"https://graph.facebook.com/v21.0/{settings.whatsapp_phone_number_id}/messages"
    )
    headers = {
        "Authorization": f"Bearer {settings.whatsapp_access_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {"body": body},
    }
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, json=payload, headers=headers)
        r.raise_for_status()
        return r.json()
