from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import and_, desc, func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_tenant_id
from app.models import (
    Customer,
    Invoice,
    Payment,
    ProductionOrder,
    WhatsAppConversation,
)
from app.schemas.common import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> DashboardStats:
    today = date.today()
    first_of_month = today.replace(day=1)

    cash_today = db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0))
        .join(Invoice, Payment.invoice_id == Invoice.id)
        .where(Invoice.tenant_id == tenant_id, Payment.paid_at == today)
    ) or 0

    invoices_month = db.scalar(
        select(func.count(Invoice.id)).where(
            Invoice.tenant_id == tenant_id, Invoice.issue_date >= first_of_month
        )
    ) or 0

    pending = db.scalar(
        select(func.coalesce(func.sum(Invoice.total), 0)).where(
            Invoice.tenant_id == tenant_id,
            Invoice.status.in_(["issued", "overdue"]),
        )
    ) or 0

    overdue = db.scalar(
        select(func.count(Invoice.id)).where(
            Invoice.tenant_id == tenant_id,
            Invoice.status == "issued",
            Invoice.due_date.is_not(None),
            Invoice.due_date < today,
        )
    ) or 0

    wa_open = db.scalar(
        select(func.count(WhatsAppConversation.id)).where(
            WhatsAppConversation.tenant_id == tenant_id,
            WhatsAppConversation.status == "open",
        )
    ) or 0

    prod_active = db.scalar(
        select(func.count(ProductionOrder.id)).where(
            ProductionOrder.tenant_id == tenant_id,
            ProductionOrder.status.in_(["pending", "in_progress"]),
        )
    ) or 0

    top_rows = db.execute(
        select(
            Customer.name,
            func.coalesce(func.sum(Invoice.total), 0).label("total"),
        )
        .join(Invoice, Invoice.customer_id == Customer.id)
        .where(
            Customer.tenant_id == tenant_id,
            Invoice.issue_date >= first_of_month,
        )
        .group_by(Customer.id, Customer.name)
        .order_by(desc("total"))
        .limit(5)
    ).all()
    top_customers = [{"name": r[0], "total": float(r[1])} for r in top_rows]

    months = []
    for i in range(5, -1, -1):
        month_start = (first_of_month.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1)
        total = db.scalar(
            select(func.coalesce(func.sum(Invoice.total), 0)).where(
                Invoice.tenant_id == tenant_id,
                and_(Invoice.issue_date >= month_start, Invoice.issue_date < month_end),
            )
        ) or 0
        months.append({"month": month_start.strftime("%Y-%m"), "total": float(total)})

    return DashboardStats(
        cash_today=float(cash_today),
        invoices_this_month=int(invoices_month),
        pending_collection=float(pending),
        overdue_count=int(overdue),
        whatsapp_open=int(wa_open),
        production_active=int(prod_active),
        top_customers=top_customers,
        monthly_sales=months,
    )
