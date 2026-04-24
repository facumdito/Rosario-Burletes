"""AFIP integration — MOCK for MVP.

Real implementation: use `pyafipws` or `afip.ws` lib against WSFE (Web Service
Facturación Electrónica), after obtaining WSAA ticket. Requires digital cert.

For now this service emulates CAE (Código de Autorización Electrónico) issuance
deterministically so the rest of the app can flow end-to-end.
"""

from __future__ import annotations

import hashlib
from datetime import date, timedelta


def issue_cae(invoice_number: str, tenant_tax_id: str, total: float) -> tuple[str, date]:
    """Simulate AFIP WSFE response.

    Returns (CAE, CAE expiration date).
    """
    seed = f"{invoice_number}|{tenant_tax_id}|{total:.2f}".encode()
    digest = hashlib.sha256(seed).hexdigest()
    # 14-digit CAE like real AFIP
    cae = digest[:14].upper()
    cae_due = date.today() + timedelta(days=10)
    return cae, cae_due


def next_invoice_number(last: str | None, invoice_type: str = "B") -> str:
    """Format: 0001-00000123 (point of sale - sequence)."""
    if not last:
        return f"0001-{1:08d}"
    try:
        pos, seq = last.split("-")
        return f"{pos}-{int(seq) + 1:08d}"
    except Exception:
        return f"0001-{1:08d}"
