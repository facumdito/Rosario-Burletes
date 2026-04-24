from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.deps import get_current_tenant_id
from app.models import ProductionOrder, ProductionStage
from app.schemas.common import (
    ProductionOrderIn,
    ProductionOrderOut,
    ProductionStageUpdate,
)

router = APIRouter(prefix="/production", tags=["production"])

STAGES = ["extrusion", "prensa", "postcurado", "control", "embalaje", "tunel"]


@router.get("/orders", response_model=list[ProductionOrderOut])
def list_orders(
    status: str | None = None,
    limit: int = 100,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> list[ProductionOrder]:
    stmt = (
        select(ProductionOrder)
        .where(ProductionOrder.tenant_id == tenant_id)
        .options(selectinload(ProductionOrder.stages))
        .order_by(desc(ProductionOrder.id))
        .limit(limit)
    )
    if status:
        stmt = stmt.where(ProductionOrder.status == status)
    return list(db.scalars(stmt))


@router.post("/orders", response_model=ProductionOrderOut, status_code=201)
def create_order(
    data: ProductionOrderIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> ProductionOrder:
    last = db.scalar(
        select(ProductionOrder.number)
        .where(ProductionOrder.tenant_id == tenant_id)
        .order_by(desc(ProductionOrder.id))
        .limit(1)
    )
    seq = int(last.split("-")[-1]) + 1 if last else 1
    order = ProductionOrder(
        tenant_id=tenant_id,
        number=f"OP-{seq:06d}",
        customer_id=data.customer_id,
        product_id=data.product_id,
        description=data.description,
        quantity=data.quantity,
        status="pending",
        current_stage=STAGES[0],
    )
    # prepopulate empty stages
    for s in STAGES:
        order.stages.append(ProductionStage(stage=s))

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.post("/orders/{order_id}/stage", response_model=ProductionOrderOut)
def update_stage(
    order_id: int,
    data: ProductionStageUpdate,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> ProductionOrder:
    order = db.get(ProductionOrder, order_id)
    if not order or order.tenant_id != tenant_id:
        raise HTTPException(404, "Order not found")

    stage = next((s for s in order.stages if s.stage == data.stage), None)
    if not stage:
        raise HTTPException(400, f"Stage {data.stage} not found on order")

    now = datetime.utcnow()
    if data.action == "start":
        stage.started_at = now
        order.current_stage = data.stage
        order.status = "in_progress"
    elif data.action == "finish":
        stage.finished_at = now
        if data.stage == STAGES[-1]:
            order.status = "done"
    else:
        raise HTTPException(400, "action must be start|finish")

    if data.operator:
        stage.operator = data.operator
    if data.notes:
        stage.notes = data.notes

    db.commit()
    db.refresh(order)
    return order
