from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_tenant_id
from app.models import Product
from app.schemas.common import ProductIn, ProductOut, SearchRequest
from app.services.ai import embed, rerank_products

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    q: str | None = None,
    limit: int = 100,
    offset: int = 0,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> list[Product]:
    stmt = select(Product).where(Product.tenant_id == tenant_id)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Product.name.ilike(like), Product.sku.ilike(like)))
    stmt = stmt.order_by(Product.name).limit(limit).offset(offset)
    return list(db.scalars(stmt))


@router.post("", response_model=ProductOut, status_code=201)
def create_product(
    data: ProductIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Product:
    product = Product(tenant_id=tenant_id, **data.model_dump())
    text = f"{product.name} {product.description or ''} {product.material or ''} {product.category or ''}"
    product.embedding = embed(text)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Product:
    product = db.get(Product, product_id)
    if not product or product.tenant_id != tenant_id:
        raise HTTPException(404, "Product not found")
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    data: ProductIn,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> Product:
    product = db.get(Product, product_id)
    if not product or product.tenant_id != tenant_id:
        raise HTTPException(404, "Product not found")
    for k, v in data.model_dump().items():
        setattr(product, k, v)
    text = f"{product.name} {product.description or ''} {product.material or ''} {product.category or ''}"
    product.embedding = embed(text)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> None:
    product = db.get(Product, product_id)
    if not product or product.tenant_id != tenant_id:
        raise HTTPException(404, "Product not found")
    db.delete(product)
    db.commit()


@router.post("/search", response_model=list[ProductOut])
def search_products(
    req: SearchRequest,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db),
) -> list[Product]:
    """Semantic search: pgvector KNN + Claude re-rank."""
    query_emb = embed(req.query)
    stmt = (
        select(Product)
        .where(Product.tenant_id == tenant_id, Product.embedding.isnot(None))
        .order_by(Product.embedding.cosine_distance(query_emb))
        .limit(max(req.limit * 2, 20))
    )
    candidates = list(db.scalars(stmt))
    if not candidates:
        return []

    payload = [
        {
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "material": p.material,
            "hardness": p.hardness,
            "price": float(p.price),
        }
        for p in candidates[:20]
    ]
    ranked_ids = rerank_products(req.query, payload)[: req.limit]
    by_id = {p.id: p for p in candidates}
    ordered = [by_id[i] for i in ranked_ids if i in by_id]
    # fill with remaining candidates if re-rank returned fewer
    if len(ordered) < req.limit:
        for p in candidates:
            if p not in ordered:
                ordered.append(p)
            if len(ordered) >= req.limit:
                break
    return ordered[: req.limit]
