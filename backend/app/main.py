from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.routers import auth, customers, dashboard, invoices, products, production, whatsapp


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure pgvector extension exists (idempotent).
    try:
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    except Exception as e:
        print(f"[startup] could not ensure pgvector extension: {e}")
    yield


app = FastAPI(
    title="Paraná API",
    version="0.1.0",
    description="El sistema operativo digital de la PyME LATAM.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {
        "name": "Paraná API",
        "version": "0.1.0",
        "docs": "/docs",
        "env": settings.env,
    }


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(invoices.router, prefix="/api/v1")
app.include_router(production.router, prefix="/api/v1")
app.include_router(whatsapp.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
