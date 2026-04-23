# Rosario Burletes · Paraná

Este repositorio contiene:

1. **Datos operativos** de Rosario Burletes (manufactura de sellos de caucho): archivos CSV de ventas, compras, materias primas, órdenes de producción y presentismo, más un notebook Python de predicción de recompras.
2. **Estrategia de producto tecnológico "Paraná"**: un SaaS para PyMEs LATAM construido sobre la experiencia operativa de Rosario Burletes, con expansión planificada Rosario → Argentina → LATAM → mundo.

---

## 📄 Estrategia de producto (Paraná)

👉 **Leé primero:** [`ESTRATEGIA.md`](ESTRATEGIA.md) (resumen ejecutivo consolidado).

### Documentos detallados

| Archivo | Contenido |
|---|---|
| [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md) | Análisis de mercado, posicionamiento, roadmap, fases geográficas. |
| [`docs/PRODUCTO.md`](docs/PRODUCTO.md) | Especificación funcional MVP completa, módulos, user stories. |
| [`docs/STACK.md`](docs/STACK.md) | Decisiones técnicas con trade-offs, arquitectura. |
| [`docs/MARKETING.md`](docs/MARKETING.md) | Plan GTM por fase con canales, presupuesto y KPIs. |
| [`docs/PRICING.md`](docs/PRICING.md) | Modelo de precios, unit economics, proyecciones. |
| [`docs/pitch/parana.md`](docs/pitch/parana.md) | Pitch deck 14 slides en formato Marp. |
| [`landing/`](landing/) | Landing page Next.js 15 lista para desplegar a Vercel. |

### Levantar la landing localmente

```bash
cd landing
npm install
npm run dev
# Abrir http://localhost:3000
```

Ver [`landing/README.md`](landing/README.md) para deploy a Vercel.

### Exportar el pitch deck

```bash
cd docs/pitch
npx @marp-team/marp-cli parana.md -o parana.pdf --allow-local-files
```

Ver [`docs/pitch/README.md`](docs/pitch/README.md).

---

## 📊 Datos operativos Rosario Burletes

Archivos originales (no modificar):

- `111.csv`, `222.csv` — historial de compras y ventas.
- `RELOJ ABRIL 2025.csv`, `RELOJ JUNIO 2025.csv` — presentismo.
- `Sin título 1.csv`, `Sin título 2.csv` — órdenes de trabajo.
- `perfil e.csv` — seguimiento de producción por etapas.
- `todas gomas.csv` — catálogo de materias primas (1.364 SKUs).
- `recordatorios_vf.ipynb` — notebook de predicción de recompras B2B.

Estos archivos son insumo del **caso 0** del producto Paraná: validan las funciones de predicción, catálogo semántico, trazabilidad de producción y presentismo.

---

## 🌎 Contacto

Rosario, Argentina · Expansión LATAM 2027+.
