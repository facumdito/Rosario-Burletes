# Paraná — Guía de desarrollo

Monorepo con 3 piezas:

| Carpeta | Qué es | Puerto |
|---|---|---|
| `backend/` | API FastAPI + PostgreSQL + pgvector + Claude + WhatsApp Cloud API | **8000** |
| `app/` | Dashboard Next.js para el cliente de la PyME | **3001** |
| `landing/` | Landing pública + blog + contacto para captación | **3000** |

Plus `docs/`, `docs/pitch/`, `scripts/` y los CSVs de Rosario Burletes como caso 0.

---

## Arranque rápido (1 comando)

Requisitos: Docker + Docker Compose + Node.js 20+.

```bash
./scripts/bootstrap.sh
```

Esto levanta Postgres + backend, corre migraciones y siembra la DB con los datos reales de Rosario Burletes (200+ clientes B2B, 1.364 SKUs, 30 facturas, 8 órdenes de producción, 3 conversaciones WhatsApp).

Después, en dos terminales:

```bash
# Terminal 1 — App dashboard (puerto 3001)
cd app && npm install && npm run dev

# Terminal 2 — Landing + blog público (puerto 3000)
cd landing && npm install && npm run dev
```

Accesos:

- **Landing:** http://localhost:3000
- **Blog:** http://localhost:3000/blog
- **App (dashboard de la PyME):** http://localhost:3001
  - Login demo: `admin@rosarioburletes.com` / `parana2026`
- **API docs (Swagger):** http://localhost:8000/docs

---

## Variables de entorno

Copiá `backend/.env.example` a `.env` en la raíz (o directamente a `backend/.env`) y completá:

```bash
# Obligatorio para IA real (agente WhatsApp + re-ranking de búsqueda)
ANTHROPIC_API_KEY=sk-ant-...

# Opcional — WhatsApp Cloud API de Meta
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=parana-verify-token

SECRET_KEY=$(openssl rand -hex 32)
```

Sin `ANTHROPIC_API_KEY`, el agente IA responde con un mensaje demo (útil para probar el flujo sin consumir tokens).

Sin credenciales de WhatsApp, los envíos se simulan (quedan en la DB y se ven en `/dashboard/whatsapp`, pero no salen a Meta).

---

## Backend — comandos útiles

```bash
# Tests
cd backend
pip install -r requirements.txt
pytest

# Correr localmente sin Docker
export DATABASE_URL=postgresql+psycopg://parana:parana@localhost:5432/parana
alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload

# Ruff + mypy
ruff check .
mypy app
```

### Endpoints principales

- `POST /api/v1/auth/signup` — crear tenant + usuario dueño
- `POST /api/v1/auth/login` — login
- `GET  /api/v1/auth/me` — usuario actual
- `GET/POST /api/v1/customers` — CRUD clientes
- `GET/POST /api/v1/products` — CRUD productos
- `POST /api/v1/products/search` — **búsqueda semántica (pgvector + Claude)**
- `GET/POST /api/v1/invoices` — CRUD facturas
- `POST /api/v1/invoices/{id}/issue` — emitir CAE (AFIP mock)
- `POST /api/v1/invoices/{id}/payments` — registrar pago
- `GET/POST /api/v1/production/orders` — órdenes de producción
- `POST /api/v1/production/orders/{id}/stage` — avanzar etapa
- `GET  /api/v1/whatsapp/conversations` — bandeja WhatsApp
- `POST /api/v1/whatsapp/simulate` — **simular mensaje entrante → agente IA responde**
- `POST /api/v1/whatsapp/webhook` — webhook real de Meta
- `GET  /api/v1/dashboard/stats` — KPIs del dashboard

Swagger interactivo: http://localhost:8000/docs

---

## Arquitectura resumida

```
┌───────────────────┐         ┌─────────────────────┐
│ landing (3000)    │         │  app (3001)         │
│  Next.js público  │         │  Next.js dashboard  │
└─────────┬─────────┘         └─────────┬───────────┘
          │                             │
          │     HTTPS (JSON + JWT)      │
          └──────────┬──────────────────┘
                     ▼
          ┌──────────────────────┐
          │  backend (8000)      │
          │  FastAPI + Pydantic  │
          └──────┬───────┬───────┘
                 │       │
     ┌───────────▼─┐  ┌──▼────────────┐
     │ PostgreSQL   │  │  Claude API   │
     │ (+ pgvector) │  │  Anthropic    │
     └──────────────┘  └───────────────┘
                 │
           ┌─────▼─────────┐
           │ WhatsApp      │
           │ Cloud API     │
           │ (Meta)        │
           └───────────────┘
```

---

## Integraciones clave

### 🧠 Claude API

- **Sonnet 4.6** (`claude-sonnet-4-6`) — razonamiento complejo (cotizaciones multi-SKU, análisis).
- **Haiku 4.5** (`claude-haiku-4-5-20251001`) — alta frecuencia / baja latencia (WhatsApp, re-ranking).
- **Prompt caching** activado en el system prompt del agente WhatsApp (reduce costo ~80%).
- Ver `backend/app/services/ai.py`.

### 💬 WhatsApp Cloud API

- Webhook verification en `GET /api/v1/whatsapp/webhook`.
- Mensajes entrantes en `POST /api/v1/whatsapp/webhook`.
- En dev, usar `POST /api/v1/whatsapp/simulate` o el botón "Simular mensaje entrante" del dashboard.
- Ver `backend/app/services/whatsapp.py`.

### 🧾 AFIP (mock)

- Generación determinística de CAE para el MVP — ver `backend/app/services/afip.py`.
- Para producción: integrar `pyafipws`/`afip.ws` con certificado digital homologado.

---

## Testing end-to-end (manual)

1. Bootstrap: `./scripts/bootstrap.sh`
2. Arrancar landing (3000) y app (3001).
3. Abrir app (3001) y loguear con `admin@rosarioburletes.com` / `parana2026`.
4. **Inicio** → ver KPIs calculados en vivo.
5. **Productos** → tildar "búsqueda semántica" → buscar "burlete caucho 31mm dureza 70" → IA devuelve el SKU correcto.
6. **Facturas** → "Nueva factura" → elegir cliente + ítems → crear borrador → "Emitir" → recibe CAE simulado.
7. **WhatsApp** → "Simular mensaje entrante" → escribir "hola, precio burlete epdm 31mm?" → ver respuesta IA.
8. **Producción** → avanzar una orden de etapa en etapa (Iniciar / Finalizar).

---

## Deploy

### Backend

Build Docker: `docker build -t parana-backend backend/`
Deploy sugerido: AWS ECS Fargate en São Paulo (sa-east-1) + RDS Postgres Multi-AZ con pgvector habilitado.

### App y landing

`vercel --prod` en cada carpeta. Configurar `NEXT_PUBLIC_API_URL` apuntando al backend.

---

## Próximos pasos sugeridos

- [ ] Homologación AFIP real (WSFE + certificado).
- [ ] Embeddings reales con Voyage o Claude (hoy pseudo-embeddings deterministicos para dev).
- [ ] WhatsApp templates aprobadas por Meta para notificaciones transaccionales.
- [ ] Conciliación bancaria automática.
- [ ] App móvil React Native para operarios (QR en planta).
- [ ] Multi-tenant por schema (hoy single schema con `tenant_id`).
- [ ] SSO para tier Enterprise.
