from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_tenant_id
from app.models import Customer
from app.schemas.common import CustomerIn, CustomerOut

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("", response_model=list[CustomerOut])
def list_customers(
    q: str | None = None,
    limit: int = 100,
    offset: int = 0,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> list[Customer]:
    stmt = select(Customer).where(Customer.tenant_id == tenant_id)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Customer.name.ilike(like), Customer.tax_id.ilike(like), Customer.email.ilike(like))
        )
    stmt = stmt.order_by(Customer.name).limit(limit).offset(offset)
    return list(db.scalars(stmt))


@router.post("", response_model=CustomerOut, status_code=201)
def create_customer(
    data: CustomerIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Customer:
    customer = Customer(tenant_id=tenant_id, **data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Customer:
    customer = db.get(Customer, customer_id)
    if not customer or customer.tenant_id != tenant_id:
        raise HTTPException(404, "Customer not found")
    return customer


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int,
    data: CustomerIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Customer:
    customer = db.get(Customer, customer_id)
    if not customer or customer.tenant_id != tenant_id:
        raise HTTPException(404, "Customer not found")
    for k, v in data.model_dump().items():
        setattr(customer, k, v)
    db.commit()
    db.refresh(customer)
    return customer


@router.delete("/{customer_id}", status_code=204)
def delete_customer(
    customer_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> None:
    customer = db.get(Customer, customer_id)
    if not customer or customer.tenant_id != tenant_id:
        raise HTTPException(404, "Customer not found")
    db.delete(customer)
    db.commit()
