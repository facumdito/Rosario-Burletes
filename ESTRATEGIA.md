# Paraná — Estrategia Consolidada

> Resumen ejecutivo. Para profundizar cada dimensión, ver [`docs/`](docs/).

---

## TL;DR

- **Producto:** **Paraná**, sistema operativo digital para PyMEs LATAM (facturación + CRM + inventario + cobranzas + WhatsApp IA + presentismo + módulos verticales).
- **Origen:** Rosario, Argentina. **Caso 0:** Rosario Burletes, manufacturera real con 23K ventas/mes.
- **Mercado:** 10M PyMEs LATAM · SAM 2M digitalizables 5 años · SOM 10K clientes pagos año 5.
- **Modelo:** SaaS freemium + 4 tiers pagos (USD 29/99/299/custom) + take rate pagos y marketplace.
- **Proyección:** ARR USD 10-40M a 5 años · LTV/CAC >10 · gross margin 74%.
- **Stack:** Python/FastAPI + PostgreSQL/pgvector + Next.js + Claude API (Sonnet 4.6/Haiku 4.5) + WhatsApp Cloud API + AWS São Paulo.
- **Expansión:** Rosario → Argentina → Chile/México/Perú → Brasil/España → Global.
- **Capital:** pre-seed USD 500K → seed USD 2,5M → serie A USD 10-15M → serie B USD 40M+.

---

## 1. Problema

Una PyME LATAM de 5-50 empleados vive fragmentada entre WhatsApp + Excel + facturador AFIP/SAT/SII + banco web + planilla de asistencia + Mercado Pago + contador externo. El dueño pierde **60% de su tiempo pegando datos** entre herramientas.

Las opciones del mercado son:

- Herramientas aisladas (Alegra, TusFacturas, Bind) → solo resuelven un pedazo.
- ERPs enterprise (SAP B1, Oracle NetSuite) → USD 50K+ setup, 6 meses, no para PyME.
- Excel + fuerza de voluntad → el estado actual.

**Nadie en LATAM tiene un todo-en-uno con IA y WhatsApp nativos, diseñado desde el dueño de la PyME, no desde el contador.**

---

## 2. Producto: Paraná

### Tagline

> **"El sistema operativo digital de tu PyME. Desde el mostrador hasta la nube."**

### Qué hace (núcleo horizontal)

1. **Facturación electrónica** multi-país (AR/CL/MX/PE/BR).
2. **CRM liviano** con import automático desde Excel usando IA.
3. **Inventario / catálogo** con búsqueda semántica (pgvector + Claude).
4. **Cobranzas automáticas** por WhatsApp + email + SMS con links de pago.
5. **Agente IA en WhatsApp** entrenado con el catálogo del cliente, atiende 24/7.
6. **Dashboard financiero** ajustado por inflación.
7. **Presentismo** con face ID.
8. **Conciliación bancaria** automática.

### Módulos verticales (add-ons por rubro)

- **Manufactura** (diferencial vs competencia) — órdenes, trazabilidad, QR, predicción B2B. Desarrollado en Rosario Burletes como caso 0.
- **Retail** — POS, integración Tiendanube/MS, vidriera.
- **Servicios** — agenda, facturación por hora, proyectos.

### Por qué la venta es fácil

1. **Dolor cuantificable** ("¿cuántas horas perdés en Excel?").
2. **Demo en 15 min con datos reales** del cliente.
3. **Caso 0 creíble** (video en planta Rosario Burletes, no testimonial fake).
4. **ROI en 30 días** — facturación + cobranzas pagan el plan.
5. **Free tier real** — empezá gratis hoy.
6. **Growth loop viral B2B2C** — cada mensaje enviado por Paraná lleva firma sutil.

Ver detalle: [`docs/PRODUCTO.md`](docs/PRODUCTO.md).

---

## 3. Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Python 3.12 + FastAPI |
| DB | PostgreSQL 16 + pgvector |
| IA | Claude Sonnet 4.6 (razonamiento) + Haiku 4.5 (WhatsApp) + prompt caching |
| Frontend | Next.js 15 + TypeScript + Tailwind + shadcn/ui |
| Mobile | React Native + Expo |
| WhatsApp | Meta Cloud API directo |
| Pagos | Mercado Pago (LATAM) + Stripe (global) |
| Infra | AWS São Paulo + Cloudflare + Vercel |
| Auth | Clerk → Keycloak (Enterprise) |

**Monolito modular** al inicio, multi-tenant por schema Postgres, todo instrumentado desde día 1 (Sentry + Grafana + PostHog).

Ver detalle: [`docs/STACK.md`](docs/STACK.md).

---

## 4. Mercado y competencia

### Tamaño

| Segmento | Empresas |
|---|---|
| TAM LATAM | 10.000.000 |
| SAM 5 años | 2.000.000 |
| SOM año 5 Paraná (0,5%) | 10.000 |

### Competencia

| Tipo | Actores | Debilidad |
|---|---|---|
| Facturación aislada | Alegra, TusFacturas, Bind, Xubio | Sin IA, sin WhatsApp, sin verticales |
| All-in-one EU | Holded | Foco España, no LATAM |
| ERPs enterprise | SAP B1, Oracle, Odoo | USD 50K+ setup, no PyME |
| Contabilidad para contador | Contabilium, Colppy | Foco contador, no dueño |

**Hueco Paraná:** LATAM-first + IA nativa + WhatsApp central + módulos verticales + precio PyME.

---

## 5. Go-to-Market

### Fase 1 — Rosario + Santa Fe (0-12 meses)

Objetivo: 100 clientes pagos, USD 10K MRR.

- **Red existente Rosario Burletes** (200 clientes B2B).
- **Aliados institucionales**: Bolsa de Comercio, ADIMRA, CEPyME, UNR/UTN.
- **Contadores y gestores** con comisión 20% primer año.
- **Contenido documental-industrial** en TikTok/YouTube, no startup-hype.
- **LinkedIn outbound** del usuario como voz principal.
- **Eventos**: Expo Rosario, Rosario Industrial, BIEL.

CAC objetivo: USD 250. Presupuesto año 1: USD 30K.

### Fase 2 — Argentina nacional (12-24 meses)

- **PLG freemium** con límites que empujan a upgrade.
- **SEO/SEM** en keywords de alta intención.
- **Partnerships** UIA, CAME, CACE.
- **Referidos cliente→cliente** (1 mes × lado).
- **Podcast + influencers contadores**.

CAC objetivo: USD 180. Presupuesto año 2: USD 295K.

### Fase 3 — LATAM (24-48 meses)

Orden: **Chile → México → Perú → Brasil (partner)**.

- Localización fiscal por país.
- Office comercial en Santiago y CDMX.
- Partner network tipo Odoo.

CAC objetivo: USD 220. Presupuesto año 3: USD 800K.

### Fase 4 — Global (48+ meses)

- **España** como puerta a EU.
- **Integraciones** SAP B1, Odoo, QuickBooks.
- **API pública + marketplace** de apps.

Ver detalle: [`docs/MARKETING.md`](docs/MARKETING.md).

---

## 6. Modelo de negocio

### Pricing

| Plan | USD/mes | Target |
|---|---|---|
| Free | 0 | Microempresa (gancho PLG) |
| Starter | 29 | 3-10 empleados |
| **Pro** | **99** | **10-50 (core)** |
| Business | 299 | 50-250, multi-sucursal |
| Enterprise | Custom 1.000+ | 250+ |

**Cobro en moneda local**, precio anclado en USD (protección devaluación).

**Add-ons:** gateway pagos (0,9% take rate), marketplace apps (15%), créditos IA extra.

### Unit economics

- Gross margin: **74%**
- CAC promedio: USD 180-280 según fase
- LTV promedio: USD 2.000-2.800
- LTV/CAC: **>10**
- Payback: **<3 meses**
- Churn anual target: **<8%**

Ver detalle: [`docs/PRICING.md`](docs/PRICING.md).

---

## 7. Proyección financiera (escenario base)

| Año | Clientes | ARR | EBITDA | Equipo |
|---|---|---|---|---|
| 1 | 100 | USD 100K | −USD 220K | 4 |
| 2 | 1.000 | USD 1M | −USD 650K | 12 |
| 3 | 3.500 | USD 3,5M | −USD 500K | 30 |
| 5 | 10.000 | USD 10-40M | +USD 1-10M | 80-120 |

### Requisitos de capital

| Ronda | Momento | Monto | Uso |
|---|---|---|---|
| FFF | 0-6m | USD 100K | MVP + caso 0 |
| Pre-seed | 6-9m | USD 500K | Primeros 100 clientes |
| Seed | 15-18m | USD 2,5M | AR nacional + Chile |
| Serie A | 30-36m | USD 10-15M | LATAM completo |
| Serie B | 54-60m | USD 40M+ | España + Brasil + exit path |

---

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| AFIP cambia formato | Adapter aislado + tests automatizados. |
| Devaluación destruye LTV | Pricing anclado USD, repricing trimestral. |
| Competidor lanza WhatsApp+IA | Velocidad + verticales únicos + caso 0. |
| WhatsApp cambia política API | SMS + email como fallback, relación Meta LATAM. |
| Dificultad hiring Rosario | Remoto LATAM desde día 1 (Córdoba, Santiago, Montevideo). |
| Rosario Burletes distrae del SaaS | Equipo separado, operación industrial autónoma. |

---

## 9. Por qué ahora y por qué acá

**Por qué ahora:**
- IA Claude 4.X (2026) es confiable para producción comercial.
- WhatsApp Cloud API maduro y económico.
- LATAM post-pandemia digitalizó la expectativa del cliente final → presiona a las PyMEs a subir al nivel.
- Inflación AR obliga a soluciones con precios dinámicos → Excel no alcanza.

**Por qué acá (Rosario):**
- Cluster industrial diverso, Bolsa de Comercio como red PyME.
- Caso 0 real (Rosario Burletes) valida sin irse de la ciudad.
- Costos 40% menos que CABA, talento UNR+UTN.
- Río Paraná como símbolo: une AR-PY-BR-UY → narrativa natural de expansión LATAM.

---

## 10. Próximos pasos concretos (primeros 30 días)

1. Registrar dominios `parana.la`, `parana.app` (validar disponibilidad).
2. Desplegar la landing ya codeada ([`landing/`](landing/)) en Vercel + capturar waitlist.
3. Compartir pitch deck ([`docs/pitch/parana.md`](docs/pitch/parana.md)) con 10 potenciales inversores ángel.
4. Entrevistar a 10 clientes B2B de Rosario Burletes (Paladini, Brafh, Comasa…) sobre dolores digitales.
5. Armar equipo MVP: reclutar 1 dev senior Python/FastAPI + 1 dev Next.js en Rosario/Córdoba.
6. Empezar homologación AFIP WSFE (toma 4-6 semanas).
7. Publicar primer video "así digitalizamos Rosario Burletes" en TikTok/YouTube.

---

## Documentos complementarios

- [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md) — análisis de mercado, roadmap.
- [`docs/PRODUCTO.md`](docs/PRODUCTO.md) — especificación funcional completa.
- [`docs/STACK.md`](docs/STACK.md) — decisiones técnicas.
- [`docs/MARKETING.md`](docs/MARKETING.md) — plan GTM detallado con presupuestos.
- [`docs/PRICING.md`](docs/PRICING.md) — unit economics y proyecciones.
- [`docs/pitch/parana.md`](docs/pitch/parana.md) — pitch deck 14 slides (Marp).
- [`landing/`](landing/) — landing page Next.js lista para desplegar.
