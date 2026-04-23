# Paraná — Stack Técnico

> Decisiones de arquitectura con trade-offs. Actualizado 2026.

---

## 1. Principios de arquitectura

1. **Monolito modular primero, micro-servicios cuando duela.** Escalar dev velocity > escalar tráfico en fase 0-2.
2. **Boring tech donde se pueda, bleeding edge donde dé ventaja.** PostgreSQL para datos, Claude API para IA.
3. **Multi-tenant por schema en Postgres** — aislamiento fuerte sin duplicar infra.
4. **Todo instrumentado desde día 1** — Sentry + Grafana antes del primer cliente.
5. **Costo infra <8% de ARR** — alertas si sube.
6. **Prompt caching siempre activado en Claude** — ahorra ~80% de tokens.

---

## 2. Stack por capa

### Backend

| Tecnología | Versión | Por qué |
|---|---|---|
| **Python** | 3.12 | Equipo familiarizado (notebook Colab). Ecosistema ML. |
| **FastAPI** | última estable | Async, typing, docs auto, performance >Flask/Django REST. |
| **Pydantic v2** | — | Validación de datos, serialización. |
| **SQLAlchemy 2** | — | ORM, con async. |
| **Alembic** | — | Migraciones de DB. |
| **Celery + Redis** | — | Jobs async (WhatsApp, cobranzas, emails). |
| **pytest** | — | Tests. |
| **Ruff + mypy** | — | Lint + type checking. |

### Base de datos

| Tecnología | Por qué |
|---|---|
| **PostgreSQL 16** | ACID para facturación, multi-tenancy, JSONB para datos semi-estructurados. |
| **pgvector** | Embeddings de catálogo, búsqueda semántica — evita traer otra DB como Pinecone/Weaviate. |
| **Redis** | Cache, rate limits, broker Celery, sesiones. |
| **S3 (AWS)** | PDFs de facturas, imágenes de productos, backups. |

### Frontend web

| Tecnología | Por qué |
|---|---|
| **Next.js 15** (App Router) | SEO para captación, RSC, ecosistema. |
| **TypeScript** | Safety obligatorio. |
| **Tailwind CSS 4** | Velocidad de styling. |
| **shadcn/ui** | Componentes copiados, no dependency lock-in. |
| **TanStack Query** | State de servidor. |
| **Zustand** | State liviano cliente. |
| **next-intl** | i18n ES/PT/EN. |

### Mobile

| Tecnología | Por qué |
|---|---|
| **React Native + Expo** | Código compartido con web (parte), OTA updates. |
| **expo-camera** | QR para producción. |
| **expo-local-authentication** | Face ID / huella para presentismo. |

### IA y agentes

| Tecnología | Uso |
|---|---|
| **Claude Sonnet 4.6** (`claude-sonnet-4-6`) | Razonamiento complejo: cotizaciones multi-SKU, análisis de reclamos, escritura de comunicaciones. |
| **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) | Alta frecuencia / baja latencia: WhatsApp, clasificación, extracción estructurada. |
| **Claude Opus 4.7** (`claude-opus-4-7`) | Tareas de alta complejidad puntuales: análisis financiero profundo, generación de reportes ejecutivos. |
| **Embeddings Claude** | Catálogo técnico para búsqueda semántica (pgvector). |
| **Anthropic SDK Python** | `anthropic` oficial. |
| **Prompt caching** | Catálogo del cliente + system prompt cacheados — reduce costo ~80%. |

**Notas sobre modelos:**
- La familia Claude 4.X es el estándar 2026. Nunca usar IDs legacy como `claude-3-opus-20240229`.
- Haiku 4.5 es sorprendentemente capaz y 10x más barato que Sonnet — úsalo por default, escala a Sonnet solo cuando la tarea lo pida.

### WhatsApp

- **WhatsApp Business Cloud API (Meta) directo** — evita markup de BSPs.
- Verificación de número + plantillas aprobadas para notificaciones (factura emitida, recordatorio cobro).
- Webhooks → Celery queue → procesamiento + respuesta.

### Pagos

- **Mercado Pago** — LATAM (AR, MX, BR, CL, CO, PE, UY). Default para cobros de clientes de PyME.
- **Stripe** — cobro de suscripción Paraná en USD (global).
- **dLocal** — si hace falta remesa de fondos multi-país.

### Facturación electrónica

- **AFIP (AR)** — `pyafipws` o `afip.ws` lib. Homologación oficial.
- **SAT (MX)** — PAC (Prodigia, Finkok) vía API.
- **SII (CL)** — API directa.
- **SUNAT (PE)** — OSE (operador servicios electrónicos) o directo.
- **NF-e (BR)** — partner local (Focus NFe o similar) por complejidad estadual.

### Infraestructura

| Servicio | Uso |
|---|---|
| **AWS São Paulo (sa-east-1)** | Primary region — latencia LATAM. |
| **Cloudflare** | DNS + CDN + WAF + R2 (alternativa barata a S3 para assets). |
| **ECS Fargate** (MVP) | Contenedores sin gestionar nodos. |
| **EKS** (fase 3+) | Cuando justifique complejidad. |
| **RDS PostgreSQL Multi-AZ** | HA desde día 1 (~USD 100/mes pagable). |
| **ElastiCache Redis** | Managed. |
| **SES** (fallback) / **Resend** (default) | Email. |
| **Vercel** | Frontend web (landing + app). |

### DevOps

| Herramienta | Uso |
|---|---|
| **GitHub** | Código + Issues + Projects. |
| **GitHub Actions** | CI/CD. |
| **Docker + docker-compose** | Dev local. |
| **Terraform** | IaC (cuando deje de caber en ECS compose). |
| **Sentry** | Errores. |
| **Grafana Cloud** (free tier) | Métricas + logs + traces. |
| **PostHog** | Analytics producto + feature flags. |

### Auth

- **Clerk** (MVP) — email/pass, social, 2FA, orgs multi-tenant. Acelera 3 meses.
- **Keycloak self-hosted** — fase Enterprise con SSO SAML/OIDC corporativo.

---

## 3. Arquitectura de alto nivel

```
                ┌─────────────┐
                │ Usuarios    │
                │ (web+app)   │
                └──────┬──────┘
                       │ HTTPS
              ┌────────▼────────┐
              │   Cloudflare    │  WAF + CDN
              └────────┬────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    ┌────▼────┐                ┌─────▼─────┐
    │ Vercel  │                │  ECS       │
    │ (Next)  │◄─── API ─────► │ (FastAPI)  │
    └─────────┘                └─────┬──────┘
                                     │
        ┌────────┬────────┬──────────┼──────────┬────────┐
        │        │        │          │          │        │
   ┌────▼───┐ ┌──▼──┐ ┌───▼────┐ ┌──▼────┐ ┌───▼──┐ ┌───▼───┐
   │ RDS PG │ │Redis│ │ Celery │ │Claude │ │ AFIP │ │  WA   │
   │+vector │ │     │ │ worker │ │  API  │ │ WSFE │ │Cloud  │
   └────────┘ └─────┘ └────────┘ └───────┘ └──────┘ └───────┘
                           │
                      ┌────▼────┐
                      │   S3    │ PDFs, imagenes
                      └─────────┘
```

---

## 4. Modelo de datos (simplificado)

### Multi-tenancy

- Un `tenant` = una empresa cliente de Paraná.
- Schema Postgres por tenant (`tenant_<id>`) para aislamiento fuerte.
- Schema `public` para datos globales (planes, config, usuarios cross-tenant).

### Entidades core (por tenant)

```
users ─── roles
customers ─── contacts, addresses
products ─── variants, categories, embeddings (vector)
invoices ─── invoice_items, payments
whatsapp_conversations ─── messages
bank_movements ─── reconciliations
employees ─── attendance_logs
production_orders ─── production_stages (módulo manufactura)
```

### Auditoría

- Tabla `audit_log` con cada cambio (usuario, timestamp, before, after) — requerida para AFIP.
- Soft delete (`deleted_at`) en todas las tablas transaccionales.

---

## 5. Trade-offs explícitos

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| FastAPI | Django | Django ORM pesado; FastAPI + SQLAlchemy da mejor DX para API pura. |
| PostgreSQL + pgvector | MongoDB / Pinecone | Menos moving parts; ACID; pgvector suficiente hasta 10M embeddings. |
| Monolito modular | Micro-servicios día 1 | Velocidad > purismo en fase 0-2. Split cuando duela. |
| Clerk | Auth propio | Auth hecho bien es 2 meses de trabajo; Clerk 1 semana. Reemplazable. |
| WhatsApp Cloud API directo | Twilio / Gupshup | Sin markup; relación directa con Meta. |
| Claude | OpenAI / Gemini | Mejor calidad en español LATAM en 2026; prompt caching; ventana de contexto. |
| Next.js App Router | Remix / Astro | Ecosistema, SEO, RSC, deploy Vercel trivial. |
| ECS Fargate | Kubernetes EKS día 1 | K8s es overhead en fase 0; ECS simple y suficiente hasta ~50 servicios. |
| AWS São Paulo | AWS Virginia | Latencia LATAM crítica; compliance datos. |
| Mercado Pago default | Stripe LATAM | MP tiene tasa mejor en AR/BR/MX y más UX local. |

---

## 6. Costo infra estimado

### Fase 0 — MVP (0-20 clientes)

| Ítem | USD/mes |
|---|---|
| AWS (ECS + RDS + S3 + data transfer) | 200 |
| Claude API (uso bajo + caching) | 150 |
| WhatsApp Cloud API | 100 |
| Vercel Pro | 20 |
| Clerk | 25 |
| Sentry + Grafana + PostHog | 50 |
| Resend | 20 |
| **Total** | **~USD 565** |

### Fase 2 — 500 clientes

| Ítem | USD/mes |
|---|---|
| AWS | 1.500 |
| Claude | 1.200 |
| WhatsApp | 800 |
| Resto | 400 |
| **Total** | **~USD 3.900** |

Con ARPA USD 80 y 500 clientes: ingresos USD 40.000/mes → infra es ~10% (objetivo <8% a largo).

### Fase 4 — 10.000 clientes

Infra proyectada ~USD 60.000/mes con ingresos USD 800.000/mes (7,5%). ✓

---

## 7. Seguridad

- TLS 1.3 obligatorio.
- Secrets en AWS Secrets Manager, nunca en código.
- Hashes bcrypt para passwords locales (Clerk lo maneja).
- 2FA obligatorio para tier Business+.
- Row-level security en Postgres para aislamiento adicional.
- Backups automáticos RDS + snapshots semanales a bucket separado.
- Audit log inmutable (append-only).
- ISO 27001 objetivo año 2.
- Pen test anual desde año 2.

---

## 8. Performance targets

| Métrica | Target |
|---|---|
| p50 API response | <200 ms |
| p99 API response | <800 ms |
| Emitir factura AFIP (end-to-end) | <4 s |
| Búsqueda catálogo (100k SKUs) | <300 ms |
| Respuesta bot WhatsApp | <3 s |
| Uptime SLA | 99,9% (Pro), 99,95% (Enterprise) |

---

## 9. Stack resumido en una línea

> **Python 3.12 + FastAPI + PostgreSQL 16 (+ pgvector) + Redis + Next.js 15 + Claude API (Sonnet 4.6 / Haiku 4.5) + WhatsApp Cloud API + Mercado Pago/Stripe + AWS São Paulo + Cloudflare + Vercel + Clerk + Sentry + PostHog.**

---

**Ver también:** [`PRODUCTO.md`](PRODUCTO.md) · [`MARKETING.md`](MARKETING.md) · [`PRICING.md`](PRICING.md)
