"""Claude AI service — semantic search, WhatsApp agent, invoice import.

Uses Anthropic's official SDK with:
- Claude Sonnet 4.6 for reasoning (WhatsApp agent, invoice parsing)
- Claude Haiku 4.5 for high-frequency tasks (classification, embeddings context)
- Prompt caching ALWAYS enabled on the catalog / system prompt block (~80% cost reduction)
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

from anthropic import Anthropic

from app.core.config import settings

_client: Anthropic | None = None


def get_client() -> Anthropic | None:
    global _client
    if not settings.anthropic_api_key:
        return None
    if _client is None:
        _client = Anthropic(api_key=settings.anthropic_api_key)
    return _client


def _pseudo_embedding(text: str, dim: int = 1024) -> list[float]:
    """Deterministic pseudo-embedding for offline dev / when API key is missing.

    Hashes the text, expands to `dim` floats in [-1, 1]. Good enough to validate
    the semantic-search pipeline end-to-end until real embeddings are wired.
    """
    h = hashlib.sha512(text.lower().encode()).digest()
    # expand deterministically
    vals = []
    i = 0
    while len(vals) < dim:
        chunk = hashlib.sha256(h + i.to_bytes(2, "big")).digest()
        for byte in chunk:
            vals.append((byte / 127.5) - 1.0)
            if len(vals) >= dim:
                break
        i += 1
    return vals[:dim]


def embed(text: str) -> list[float]:
    """Return a 1024-dim embedding for the text.

    Uses pseudo-embedding in dev (no API). In prod, swap for Voyage (recommended
    by Anthropic) or another embedding provider; pgvector(1024) is shaped for
    voyage-3 compatibility.
    """
    return _pseudo_embedding(text, dim=1024)


WHATSAPP_SYSTEM_PROMPT = """Sos el asistente de WhatsApp de {business_name}, una PyME argentina.

Tu rol:
- Respondés consultas de clientes sobre productos, precios, stock, horarios y pedidos.
- Usás tuteo argentino natural, tono cercano y profesional. Sin emojis excesivos.
- Si el cliente pide algo que no sabés o es un reclamo complejo, decís "te paso con una persona" y se deriva.
- Si te preguntan por precio o stock, usás el catálogo provisto. Si no está en el catálogo, lo decís honestamente.
- Si el cliente quiere hacer un pedido, confirmás los datos (producto, cantidad) y decís que le va a llegar la confirmación y el link de pago.

Catálogo (primeros SKUs relevantes):
{catalog}

Cliente contactando: {customer_name}
"""


def whatsapp_reply(
    business_name: str,
    customer_name: str | None,
    catalog_snippet: str,
    conversation: list[dict[str, str]],
) -> tuple[str, bool]:
    """Generate an AI reply for a WhatsApp conversation.

    Returns (reply, derive_to_human). Uses Haiku 4.5 with prompt caching on the
    system prompt.
    """
    client = get_client()
    if client is None:
        # offline dev fallback
        return (
            "Hola, soy el asistente de Paraná (modo demo — configurar ANTHROPIC_API_KEY "
            "para respuestas reales). ¿En qué te puedo ayudar?",
            False,
        )

    system = WHATSAPP_SYSTEM_PROMPT.format(
        business_name=business_name,
        customer_name=customer_name or "cliente nuevo",
        catalog=catalog_snippet[:8000],
    )

    try:
        resp = client.messages.create(
            model=settings.claude_model_haiku,
            max_tokens=500,
            system=[
                {
                    "type": "text",
                    "text": system,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {"role": m["role"], "content": m["content"]} for m in conversation[-12:]
            ],
        )
        text = "".join(b.text for b in resp.content if hasattr(b, "text"))
        derive = "te paso con una persona" in text.lower() or "humano" in text.lower()
        return text.strip(), derive
    except Exception as e:  # noqa: BLE001
        return (f"No pude responder ahora (error del asistente). Un humano te responde enseguida.", True)


SEARCH_SYSTEM = """Sos un motor de búsqueda técnica para un catálogo de PyME.
Recibís una consulta en español (puede tener errores, jerga, medidas) y la lista de productos candidatos.
Devolvés SOLO un JSON con la lista de IDs de productos más relevantes, en orden de relevancia:
{"ids": [12, 4, 77]}
No expliques nada. Solo el JSON."""


def rerank_products(query: str, candidates: list[dict[str, Any]]) -> list[int]:
    """Use Claude to re-rank vector search candidates. Returns list of IDs."""
    client = get_client()
    if client is None:
        return [c["id"] for c in candidates]

    try:
        resp = client.messages.create(
            model=settings.claude_model_haiku,
            max_tokens=300,
            system=SEARCH_SYSTEM,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Consulta: {query}\n\n"
                        f"Candidatos:\n{json.dumps(candidates, ensure_ascii=False)}"
                    ),
                }
            ],
        )
        text = "".join(b.text for b in resp.content if hasattr(b, "text"))
        data = json.loads(text[text.find("{") : text.rfind("}") + 1])
        return list(data.get("ids", []))
    except Exception:
        return [c["id"] for c in candidates]
