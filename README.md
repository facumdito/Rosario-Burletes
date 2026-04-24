# Rosario Burletes · Paraná

Este repositorio contiene:

1. **Datos operativos** de Rosario Burletes (manufactura de sellos de caucho): archivos CSV de ventas, compras, materias primas, órdenes de producción y presentismo, más un notebook Python de predicción de recompras.
2. **Estrategia de producto tecnológico "Paraná"**: un SaaS para PyMEs LATAM construido sobre la experiencia operativa de Rosario Burletes, con expansión planificada Rosario → Argentina → LATAM → mundo.

---

## 🚀 Arranque rápido (1 comando)

```bash
./scripts/bootstrap.sh
```

Levanta Postgres + API, corre migraciones y siembra la DB con los datos reales de Rosario Burletes. Después:

```bash
cd app && npm install && npm run dev       # dashboard  → http://localhost:3001
cd landing && npm install && npm run dev   # landing    → http://localhost:3000
# API docs:                                             → http://localhost:8000/docs
```

Login demo: `admin@rosarioburletes.com` / `parana2026`.

Ver [`DEV.md`](DEV.md) para la guía completa de desarrollo, variables y deploy.

## 📦 Estructura del repo

```
/
├── backend/       FastAPI + PostgreSQL/pgvector + Claude API + WhatsApp Cloud API
├── app/           Dashboard Next.js (cliente PyME) — puerto 3001
├── landing/       Sitio público + blog + contacto — puerto 3000
├── docs/          Estrategia, producto, stack, marketing, pricing, pitch
├── scripts/       bootstrap.sh y utilidades
├── docker-compose.yml
└── DEV.md
```

## 📄 Estrategia de producto (Paraná)

👉 **Leé primero:** [`ESTRATEGIA.md`](ESTRATEGIA.md) (resumen ejecutivo consolidado).

| Archivo | Contenido |
|---|---|
| [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md) | Análisis de mercado, posicionamiento, roadmap, fases geográficas. |
| [`docs/PRODUCTO.md`](docs/PRODUCTO.md) | Especificación funcional MVP completa, módulos, user stories. |
| [`docs/STACK.md`](docs/STACK.md) | Decisiones técnicas con trade-offs, arquitectura. |
| [`docs/MARKETING.md`](docs/MARKETING.md) | Plan GTM por fase con canales, presupuesto y KPIs. |
| [`docs/PRICING.md`](docs/PRICING.md) | Modelo de precios, unit economics, proyecciones. |
| [`docs/pitch/parana.md`](docs/pitch/parana.md) | Pitch deck 14 slides en formato Marp. |

### Exportar el pitch deck

```bash
cd docs/pitch
npx @marp-team/marp-cli parana.md -o parana.pdf --allow-local-files
```

---

## 🌎 Contacto

Rosario, Argentina · Expansión LATAM 2027+.
