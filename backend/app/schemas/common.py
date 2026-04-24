from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CustomerIn(BaseModel):
    name: str
    tax_id: str | None = None
    email: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    address: str | None = None
    city: str | None = None
    notes: str | None = None
    credit_limit: float = 0
    tags: str | None = None


class CustomerOut(CustomerIn, ORMModel):
    id: int
    created_at: datetime


class ProductIn(BaseModel):
    sku: str
    name: str
    description: str | None = None
    category: str | None = None
    material: str | None = None
    hardness: int | None = None
    unit: str = "un"
    cost: float = 0
    price: float = 0
    stock: float = 0
    stock_min: float = 0


class ProductOut(ProductIn, ORMModel):
    id: int


class InvoiceItemIn(BaseModel):
    product_id: int | None = None
    description: str
    quantity: float = 1
    unit_price: float = 0


class InvoiceItemOut(InvoiceItemIn, ORMModel):
    id: int
    total: float


class InvoiceIn(BaseModel):
    customer_id: int
    invoice_type: str = "B"
    due_date: date | None = None
    items: list[InvoiceItemIn]


class InvoiceOut(ORMModel):
    id: int
    customer_id: int
    number: str
    invoice_type: str
    issue_date: date
    due_date: date | None
    subtotal: float
    tax: float
    total: float
    status: str
    afip_cae: str | None
    afip_cae_due: date | None
    items: list[InvoiceItemOut] = []


class PaymentIn(BaseModel):
    amount: float
    method: str = "transfer"
    reference: str | None = None


class ProductionOrderIn(BaseModel):
    customer_id: int | None = None
    product_id: int | None = None
    description: str
    quantity: float = 1


class ProductionStageUpdate(BaseModel):
    stage: str
    action: str  # start | finish
    operator: str | None = None
    notes: str | None = None


class ProductionStageOut(ORMModel):
    id: int
    stage: str
    started_at: datetime | None
    finished_at: datetime | None
    operator: str | None
    notes: str | None


class ProductionOrderOut(ORMModel):
    id: int
    number: str
    customer_id: int | None
    product_id: int | None
    description: str
    quantity: float
    status: str
    current_stage: str
    created_at: datetime
    stages: list[ProductionStageOut] = []


class WhatsAppMessageIn(BaseModel):
    phone: str
    content: str


class WhatsAppMessageOut(ORMModel):
    id: int
    direction: str
    sender: str
    content: str
    created_at: datetime


class WhatsAppConversationOut(ORMModel):
    id: int
    phone: str
    contact_name: str | None
    status: str
    ai_enabled: bool
    last_message_at: datetime | None
    messages: list[WhatsAppMessageOut] = []


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class DashboardStats(BaseModel):
    cash_today: float
    invoices_this_month: int
    pending_collection: float
    overdue_count: int
    whatsapp_open: int
    production_active: int
    top_customers: list[dict]
    monthly_sales: list[dict]
