"""Seed DB with Rosario Burletes real data as the first tenant (Caso 0).

Run after migrations:
    python -m scripts.seed

Reads CSVs from the repo root. Safe to re-run: skips if tenant already exists.
"""

from __future__ import annotations

import os
import random
import sys
from datetime import date, timedelta
from pathlib import Path

import pandas as pd
from sqlalchemy import select

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal, engine  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models import (  # noqa: E402
    Customer,
    Invoice,
    InvoiceItem,
    Payment,
    Product,
    ProductionOrder,
    ProductionStage,
    Tenant,
    User,
    WhatsAppConversation,
    WhatsAppMessage,
)
from app.services.ai import embed  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[2]
STAGES = ["extrusion", "prensa", "postcurado", "control", "embalaje", "tunel"]


def read_csv_safe(path: Path) -> pd.DataFrame | None:
    if not path.exists():
        print(f"[seed] skipped (missing): {path.name}")
        return None
    for enc in ("utf-8", "latin-1"):
        try:
            return pd.read_csv(path, encoding=enc, on_bad_lines="skip")
        except Exception:
            continue
    print(f"[seed] could not read: {path.name}")
    return None


def seed_tenant_and_user(db) -> Tenant:
    tenant = db.scalar(select(Tenant).where(Tenant.slug == "rosario-burletes"))
    if tenant:
        print("[seed] tenant already exists, skipping auth seed")
        return tenant

    tenant = Tenant(
        name="Rosario Burletes",
        slug="rosario-burletes",
        country="AR",
        tax_id="30-70812345-6",
        plan="pro",
    )
    db.add(tenant)
    db.flush()

    user = User(
        tenant_id=tenant.id,
        email="admin@rosarioburletes.com",
        hashed_password=hash_password("parana2026"),
        full_name="Admin Rosario Burletes",
        role="owner",
    )
    db.add(user)
    db.flush()
    print(f"[seed] created tenant {tenant.name} + user admin@rosarioburletes.com / parana2026")
    return tenant


def seed_products(db, tenant: Tenant) -> list[Product]:
    existing = db.scalar(select(Product).where(Product.tenant_id == tenant.id).limit(1))
    if existing:
        print("[seed] products already seeded, skipping")
        return list(db.scalars(select(Product).where(Product.tenant_id == tenant.id)))

    df = read_csv_safe(REPO_ROOT / "todas gomas.csv")
    products: list[Product] = []

    if df is not None:
        # Try to find useful columns heuristically
        cols = {c.lower().strip(): c for c in df.columns}
        code_col = next((cols[k] for k in ("codigo", "código", "sku", "code") if k in cols), df.columns[0])
        name_col = next(
            (cols[k] for k in ("descripcion", "descripción", "producto", "nombre") if k in cols),
            df.columns[1] if len(df.columns) > 1 else df.columns[0],
        )
        price_col = next(
            (cols[k] for k in ("precio", "price", "costo") if k in cols), None
        )
        hardness_col = next(
            (cols[k] for k in ("dureza", "hardness") if k in cols), None
        )

        for _, row in df.head(200).iterrows():
            try:
                sku = str(row[code_col]).strip()
                name = str(row[name_col]).strip()
                if not name or name.lower() == "nan":
                    continue
                price = float(row[price_col]) if price_col and pd.notna(row[price_col]) else 0.0
                hardness = int(row[hardness_col]) if hardness_col and pd.notna(row[hardness_col]) else None
                p = Product(
                    tenant_id=tenant.id,
                    sku=sku[:100],
                    name=name[:300],
                    category="Materia prima",
                    material=_guess_material(name),
                    hardness=hardness,
                    unit="kg",
                    cost=price,
                    price=round(price * 1.45, 2),
                    stock=random.randint(10, 500),
                    stock_min=20,
                )
                p.embedding = embed(f"{p.name} {p.material or ''}")
                products.append(p)
                db.add(p)
            except Exception as e:
                print(f"[seed] skipped product row: {e}")

    # Fallback / additional finished products
    finished = [
        ("BUR-EPDM-31", "BURLETE EPDM ALT 31MM", "EPDM", 70, "mt", 29_000),
        ("BUR-CAR-615", "BURLETE CARRO MANTENEDOR 615x685MM", "Silicona", 60, "un", 79_600),
        ("BUR-CAR-720", "BURLETE CARRO MANTENEDOR 720x680MM", "Silicona", 60, "un", 84_200),
        ("PER-U-8", "PERFIL U INT 8MM CAUCHO NATURAL", "Caucho natural", 70, "mt", 4_800),
        ("CUE-3-60", "CUERDA 3x60 SILICONA RV", "Silicona", 50, "mt", 2_400),
        ("SEL-32-18", "SELLO P/FAB DISC 32/18 SILICONA NARANJA", "Silicona", 50, "un", 1_850),
        ("PER-E-5882", "PERFIL TIPO E USO GENERAL", "Silicona", 60, "mt", 3_400),
    ]
    for sku, name, material, hardness, unit, price in finished:
        p = Product(
            tenant_id=tenant.id,
            sku=sku,
            name=name,
            category="Producto terminado",
            material=material,
            hardness=hardness,
            unit=unit,
            cost=round(price * 0.55, 2),
            price=price,
            stock=random.randint(50, 500),
            stock_min=25,
        )
        p.embedding = embed(f"{p.name} {p.material}")
        products.append(p)
        db.add(p)

    db.flush()
    print(f"[seed] created {len(products)} products")
    return products


def _guess_material(name: str) -> str:
    n = name.lower()
    if "silicona" in n or "silicon" in n:
        return "Silicona"
    if "nbr" in n or "acrilo" in n:
        return "NBR"
    if "epdm" in n:
        return "EPDM"
    if "neopreno" in n or "an " in n:
        return "Neopreno"
    if "caucho" in n:
        return "Caucho natural"
    return "Otro"


def seed_customers(db, tenant: Tenant) -> list[Customer]:
    existing = db.scalar(
        select(Customer).where(Customer.tenant_id == tenant.id).limit(1)
    )
    if existing:
        print("[seed] customers already seeded, skipping")
        return list(db.scalars(select(Customer).where(Customer.tenant_id == tenant.id)))

    real = [
        ("Paladini S.A.", "30-50001234-1", "compras@paladini.com.ar", "+5493415550101", "Villa Gobernador Gálvez, Santa Fe"),
        ("Industrias Brafh S.A.", "30-52309876-5", "compras@brafh.com.ar", "+5493415550102", "Rosario, Santa Fe"),
        ("Comasa S.A.", "30-60012345-7", "administracion@comasa.com.ar", "+5493415550103", "Rosario, Santa Fe"),
        ("Plasbe S.A.", "30-54345678-9", "info@plasbe.com.ar", "+5493415550104", "Funes, Santa Fe"),
        ("La Goma Argentina SRL", "30-70123456-2", "ventas@lagomaargentina.com", "+5493415550105", "Rosario, Santa Fe"),
        ("Flexiglass SRL", "30-71234567-3", "contacto@flexiglass.com.ar", "+5493415550106", "Granadero Baigorria"),
        ("Aponus S.A.", "30-55998877-4", "compras@aponus.com", "+5493415550107", "Buenos Aires"),
        ("Industrias Fulton SRL", "30-60998877-5", "administracion@fulton.com.ar", "+5493415550108", "Córdoba"),
    ]
    customers = []
    for name, cuit, email, phone, city in real:
        c = Customer(
            tenant_id=tenant.id,
            name=name,
            tax_id=cuit,
            email=email,
            phone=phone,
            whatsapp=phone,
            city=city,
            credit_limit=500_000,
            tags="B2B",
        )
        db.add(c)
        customers.append(c)
    db.flush()
    print(f"[seed] created {len(customers)} customers")
    return customers


def seed_invoices(db, tenant: Tenant, customers: list[Customer], products: list[Product]) -> None:
    existing = db.scalar(
        select(Invoice).where(Invoice.tenant_id == tenant.id).limit(1)
    )
    if existing:
        print("[seed] invoices already seeded, skipping")
        return

    today = date.today()
    random.seed(42)
    count = 0
    for i in range(30):
        customer = random.choice(customers)
        issue = today - timedelta(days=random.randint(0, 60))
        due = issue + timedelta(days=30)
        invoice_type = random.choice(["A", "A", "B"])
        items_data = random.sample(products, k=random.randint(1, 4))
        items = []
        subtotal = 0.0
        for p in items_data:
            qty = random.randint(1, 50)
            price = float(p.price)
            total = round(qty * price, 2)
            subtotal += total
            items.append(
                InvoiceItem(
                    product_id=p.id,
                    description=p.name,
                    quantity=qty,
                    unit_price=price,
                    total=total,
                )
            )

        tax = round(subtotal * 0.21, 2) if invoice_type in ("A", "B") else 0
        inv = Invoice(
            tenant_id=tenant.id,
            customer_id=customer.id,
            number=f"0001-{i + 1:08d}",
            invoice_type=invoice_type,
            issue_date=issue,
            due_date=due,
            subtotal=subtotal,
            tax=tax,
            total=round(subtotal + tax, 2),
            status=random.choice(["issued", "issued", "paid", "overdue"]),
            afip_cae=f"7423{random.randint(10**9, 10**10 - 1)}",
            afip_cae_due=issue + timedelta(days=10),
        )
        inv.items = items
        if inv.status == "paid":
            inv.payments = [
                Payment(
                    amount=inv.total,
                    method=random.choice(["transfer", "mercadopago"]),
                    reference=f"PAY-{i + 1}",
                    paid_at=issue + timedelta(days=random.randint(3, 25)),
                )
            ]
        db.add(inv)
        count += 1

    db.flush()
    print(f"[seed] created {count} invoices")


def seed_production(db, tenant: Tenant, customers: list[Customer], products: list[Product]) -> None:
    existing = db.scalar(
        select(ProductionOrder).where(ProductionOrder.tenant_id == tenant.id).limit(1)
    )
    if existing:
        print("[seed] production orders already seeded, skipping")
        return

    random.seed(7)
    for i in range(8):
        customer = random.choice(customers)
        product = random.choice(products)
        current_idx = random.randint(0, len(STAGES) - 1)
        status = "in_progress" if current_idx < len(STAGES) - 1 else "done"
        order = ProductionOrder(
            tenant_id=tenant.id,
            number=f"OP-{i + 1:06d}",
            customer_id=customer.id,
            product_id=product.id,
            description=f"{product.name} · {customer.name}",
            quantity=random.randint(50, 500),
            status=status,
            current_stage=STAGES[current_idx],
        )
        for idx, s in enumerate(STAGES):
            stage = ProductionStage(stage=s)
            if idx < current_idx:
                stage.started_at = date.today() - timedelta(days=current_idx - idx + 1)
                stage.finished_at = date.today() - timedelta(days=current_idx - idx)
                stage.operator = random.choice(["Silva Verónica", "López Juan", "Pérez Mario"])
            elif idx == current_idx:
                stage.started_at = date.today()
                stage.operator = random.choice(["Silva Verónica", "López Juan", "Pérez Mario"])
            order.stages.append(stage)
        db.add(order)

    db.flush()
    print("[seed] created 8 production orders")


def seed_whatsapp(db, tenant: Tenant, customers: list[Customer]) -> None:
    existing = db.scalar(
        select(WhatsAppConversation)
        .where(WhatsAppConversation.tenant_id == tenant.id)
        .limit(1)
    )
    if existing:
        print("[seed] whatsapp conversations already seeded, skipping")
        return

    scripts = [
        [
            ("customer", "Hola, ¿tenés burlete EPDM alt 31mm en stock?"),
            ("ai", "Hola. Sí, tenemos 120 metros en stock a $29.000/mt + IVA. ¿Armo el pedido?"),
            ("customer", "Dale, 50 metros."),
            ("ai", "Listo, pedido confirmado. Te llega factura por mail al aprobar."),
        ],
        [
            ("customer", "Buenos días, consulta de precio por perfil U 8mm caucho natural"),
            ("ai", "Hola, está a $4.800/mt + IVA. Tenemos 200 mt disponibles. ¿Cantidad?"),
        ],
        [
            ("customer", "Necesito 3 burletes carro mantenedor 615x685"),
            ("ai", "Perfecto. Precio unitario $79.600 + IVA. Total $237.600 + IVA. ¿Confirmás?"),
        ],
    ]
    for idx, script in enumerate(scripts):
        customer = customers[idx % len(customers)]
        conv = WhatsAppConversation(
            tenant_id=tenant.id,
            customer_id=customer.id,
            phone=customer.whatsapp,
            contact_name=customer.name,
            status="open",
            ai_enabled=True,
        )
        db.add(conv)
        db.flush()
        for sender, content in script:
            msg = WhatsAppMessage(
                conversation_id=conv.id,
                direction="inbound" if sender == "customer" else "outbound",
                sender=sender,
                content=content,
            )
            db.add(msg)
        conv.last_message_at = date.today()

    db.flush()
    print("[seed] created 3 whatsapp conversations")


def main() -> None:
    # ensure pgvector extension
    from sqlalchemy import text

    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))

    with SessionLocal() as db:
        tenant = seed_tenant_and_user(db)
        products = seed_products(db, tenant)
        customers = seed_customers(db, tenant)
        seed_invoices(db, tenant, customers, products)
        seed_production(db, tenant, customers, products)
        seed_whatsapp(db, tenant, customers)
        db.commit()
        print("[seed] done ✓")


if __name__ == "__main__":
    main()
