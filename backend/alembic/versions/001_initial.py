"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-04-24

"""

import pgvector.sqlalchemy
import sqlalchemy as sa
from alembic import op

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "tenants",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
        sa.Column("country", sa.String(2), server_default="AR"),
        sa.Column("tax_id", sa.String(20), nullable=True),
        sa.Column("plan", sa.String(20), server_default="free"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("tenant_id", sa.Integer, sa.ForeignKey("tenants.id"), index=True),
        sa.Column("email", sa.String(200), unique=True, nullable=False, index=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(200), server_default=""),
        sa.Column("role", sa.String(20), server_default="owner"),
        sa.Column("is_active", sa.Boolean, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "customers",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("tenant_id", sa.Integer, sa.ForeignKey("tenants.id"), index=True),
        sa.Column("name", sa.String(300), nullable=False, index=True),
        sa.Column("tax_id", sa.String(20), nullable=True, index=True),
        sa.Column("email", sa.String(200), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("whatsapp", sa.String(50), nullable=True),
        sa.Column("address", sa.String(500), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("credit_limit", sa.Numeric(14, 2), server_default="0"),
        sa.Column("tags", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "products",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("tenant_id", sa.Integer, sa.ForeignKey("tenants.id"), index=True),
        sa.Column("sku", sa.String(100), index=True),
        sa.Column("name", sa.String(300), nullable=False, index=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("material", sa.String(100), nullable=True),
        sa.Column("hardness", sa.Integer, nullable=True),
        sa.Column("unit", sa.String(20), server_default="un"),
        sa.Column("cost", sa.Numeric(14, 2), server_default="0"),
        sa.Column("price", sa.Numeric(14, 2), server_default="0"),
        sa.Column("stock", sa.Numeric(14, 2), server_default="0"),
        sa.Column("stock_min", sa.Numeric(14, 2), server_default="0"),
        sa.Column("embedding", pgvector.sqlalchemy.Vector(1024), nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "invoices",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("tenant_id", sa.Integer, sa.ForeignKey("tenants.id"), index=True),
        sa.Column("customer_id", sa.Integer, sa.ForeignKey("customers.id"), index=True),
        sa.Column("number", sa.String(50), index=True),
        sa.Column("invoice_type", sa.String(5), server_default="B"),
        sa.Column("issue_date", sa.Date),
        sa.Column("due_date", sa.Date, nullable=True),
        sa.Column("subtotal", sa.Numeric(14, 2), server_default="0"),
        sa.Column("tax", sa.Numeric(14, 2), server_default="0"),
        sa.Column("total", sa.Numeric(14, 2), server_default="0"),
        sa.Column("status", sa.String(20), server_default="draft"),
        sa.Column("afip_cae", sa.String(50), nullable=True),
        sa.Column("afip_cae_due", sa.Date, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "invoice_items",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("invoice_id", sa.Integer, sa.ForeignKey("invoices.id"), index=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id"), nullable=True),
        sa.Column("description", sa.String(500)),
        sa.Column("quantity", sa.Numeric(14, 2), server_default="1"),
        sa.Column("unit_price", sa.Numeric(14, 2), server_default="0"),
        sa.Column("total", sa.Numeric(14, 2), server_default="0"),
    )

    op.create_table(
        "payments",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("invoice_id", sa.Integer, sa.ForeignKey("invoices.id"), index=True),
        sa.Column("amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("method", sa.String(30), server_default="transfer"),
        sa.Column("reference", sa.String(100), nullable=True),
        sa.Column("paid_at", sa.Date),
    )

    op.create_table(
        "production_orders",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("tenant_id", sa.Integer, sa.ForeignKey("tenants.id"), index=True),
        sa.Column("number", sa.String(50), index=True),
        sa.Column("customer_id", sa.Integer, sa.ForeignKey("customers.id"), nullable=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id"), nullable=True),
        sa.Column("description", sa.String(500)),
        sa.Column("quantity", sa.Numeric(14, 2), server_default="1"),
        sa.Column("status", sa.String(30), server_default="pending"),
        sa.Column("current_stage", sa.String(30), server_default="extrusion"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "production_stages",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "order_id", sa.Integer, sa.ForeignKey("production_orders.id"), index=True
        ),
        sa.Column("stage", sa.String(30)),
        sa.Column("started_at", sa.DateTime, nullable=True),
        sa.Column("finished_at", sa.DateTime, nullable=True),
        sa.Column("operator", sa.String(100), nullable=True),
        sa.Column("notes", sa.String(500), nullable=True),
    )

    op.create_table(
        "whatsapp_conversations",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("tenant_id", sa.Integer, sa.ForeignKey("tenants.id"), index=True),
        sa.Column(
            "customer_id", sa.Integer, sa.ForeignKey("customers.id"), nullable=True
        ),
        sa.Column("phone", sa.String(50), index=True),
        sa.Column("contact_name", sa.String(200), nullable=True),
        sa.Column("status", sa.String(20), server_default="open"),
        sa.Column("ai_enabled", sa.Boolean, server_default=sa.true()),
        sa.Column("last_message_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "whatsapp_messages",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "conversation_id",
            sa.Integer,
            sa.ForeignKey("whatsapp_conversations.id"),
            index=True,
        ),
        sa.Column("direction", sa.String(10)),
        sa.Column("sender", sa.String(20), server_default="customer"),
        sa.Column("content", sa.Text),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("whatsapp_messages")
    op.drop_table("whatsapp_conversations")
    op.drop_table("production_stages")
    op.drop_table("production_orders")
    op.drop_table("payments")
    op.drop_table("invoice_items")
    op.drop_table("invoices")
    op.drop_table("products")
    op.drop_table("customers")
    op.drop_table("users")
    op.drop_table("tenants")
