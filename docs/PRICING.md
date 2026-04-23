# Paraná — Pricing y Unit Economics

> Modelo de precios, LTV/CAC, cohortes y proyecciones financieras.

---

## 1. Filosofía de pricing

1. **Anclado en USD, cobrado en moneda local** — protege LTV en países con inflación.
2. **Freemium con gancho real**, no de cartón — que el free realmente funcione para micro-empresas.
3. **Upgrade por límites naturales** (facturas, usuarios, WhatsApp, verticales), no por artificios.
4. **Transparencia total** — precio público en landing, sin "contact sales" hasta Enterprise.
5. **Repricing anual moderado** — +5-8% USD anual, suficiente para absorber costos crecientes sin castigar clientes viejos.

---

## 2. Tiers

| Plan | Precio | Target | Qué incluye |
|---|---|---|---|
| **Free** | USD 0 | Micro-empresa, <3 usuarios, monotributista | 10 facturas/mes, 50 clientes, inventario 100 SKUs, WhatsApp manual, soporte comunidad. |
| **Starter** | USD 29/mes | 3-10 empleados, comercio/servicios simples | Facturas ilimitadas, 3 usuarios, CRM, inventario 1.000 SKUs, WhatsApp 1 número, soporte email. |
| **Pro** | USD 99/mes | 10-50 empleados (core target) | 10 usuarios, SKUs ilimitados, agente IA WhatsApp, predicción demanda, cobranzas auto, conciliación bancaria, 1 módulo vertical, soporte prioritario. |
| **Business** | USD 299/mes | 50-250 empleados, multi-sucursal | 30 usuarios, multi-sucursal, API, SSO, todos los módulos verticales, soporte dedicado 12×5. |
| **Enterprise** | Custom (USD 1.000+/mes) | 250+, multi-país | Usuarios ilimitados, SLA 99,95%, soporte 24×7, on-prem opcional, customización, integrador dedicado. |

### Add-ons (todos los tiers pagos)

| Add-on | Precio |
|---|---|
| Gateway pagos embebido | Take rate 0,9% (Paraná queda con 0,4% sobre el 2,9% del proveedor) |
| Marketplace de apps | Take rate 15% sobre apps vendidas por partners |
| Créditos IA extra (sobre los incluidos) | USD 10 / 10K mensajes WhatsApp IA |
| Usuario adicional (Pro+) | USD 8/mes |
| Módulo vertical adicional | USD 30/mes |

---

## 3. Cobro en moneda local

| País | Moneda | Conversión |
|---|---|---|
| Argentina | ARS | Tipo de cambio MEP + 3% (ajuste mensual) |
| Chile | CLP | Tipo de cambio BCentral + 2% |
| México | MXN | Tipo de cambio SAT + 2% |
| Perú | PEN | Tipo de cambio SBS + 2% |
| Brasil | BRL | Tipo de cambio BCB + 2% |
| Resto / global | USD | Directo |

Cobro vía Mercado Pago (AR/BR/MX/CL/CO/PE/UY) o Stripe (resto).

---

## 4. Distribución de clientes esperada (fase 3, año 3)

| Plan | % clientes | ARPA efectivo USD/mes |
|---|---|---|
| Free | 50% | 0 |
| Starter | 25% | 29 |
| Pro | 20% | 99 |
| Business | 4% | 299 |
| Enterprise | 1% | 1.500 prom |

**ARPA mix (solo clientes pagos):** USD ~80/mes.

**Conversión free → paid:** 12-15% en 90 días (benchmarks industria similar).

---

## 5. Unit economics

### Costos variables por cliente pago (promedio)

| Ítem | USD/mes/cliente |
|---|---|
| Infra AWS + Vercel prorrateado | 4 |
| Claude API (con caching) | 6 |
| WhatsApp Cloud API (conversaciones) | 3 |
| Pagos (Stripe/MP fees sobre cobro SaaS) | 3 |
| Soporte (prorrateado) | 5 |
| **COGS total** | **USD 21** |

**Gross margin:** (80 − 21) / 80 = **74%**.

### CAC y LTV

| Fase | CAC | LTV | LTV/CAC | Payback |
|---|---|---|---|---|
| 1 (Rosario) | USD 250 | USD 1.800 | 7,2 | 3 meses |
| 2 (AR nacional) | USD 180 | USD 2.100 | 11,6 | 2 meses |
| 3 (LATAM) | USD 220 | USD 2.400 | 10,9 | 2,5 meses |
| 4 (global) | USD 280 | USD 2.800 | 10 | 3,5 meses |

LTV calculado como ARPA × (1 / churn mensual) × gross margin.

Churn mensual target: 0,7% (anual ~8%).

---

## 6. Proyección financiera (escenario base)

### Año 1

| Métrica | Valor |
|---|---|
| Clientes pagos fin de año | 100 |
| ARR fin de año | USD 100K |
| MRR promedio | USD 5K |
| Revenue año 1 | USD 60K |
| Costos (infra + equipo + marketing) | USD 280K |
| **EBITDA** | **−USD 220K** (quemando capital) |
| Equipo | 4 personas |

### Año 2

| Métrica | Valor |
|---|---|
| Clientes pagos | 1.000 |
| ARR | USD 1M |
| Revenue año 2 | USD 550K |
| Costos | USD 1,2M |
| **EBITDA** | **−USD 650K** |
| Equipo | 12 personas |

### Año 3

| Métrica | Valor |
|---|---|
| Clientes pagos | 3.500 |
| ARR | USD 3,5M |
| Revenue año 3 | USD 2,3M |
| Costos | USD 2,8M |
| **EBITDA** | **−USD 500K** (cerca de break-even) |
| Equipo | 30 personas |

### Año 5

| Métrica | Valor |
|---|---|
| Clientes pagos | 10.000 |
| ARR | USD 10M (conservador) / USD 40M (optimista) |
| Revenue año 5 | USD 9-30M |
| Costos | USD 8-20M |
| **EBITDA** | **+USD 1-10M** (rentable) |
| Equipo | 80-120 personas |

---

## 7. Requisitos de capital

| Ronda | Momento | Monto | Uso |
|---|---|---|---|
| **Bootstrapping / FFF** | Mes 0-6 | USD 100K | MVP + caso 0. |
| **Pre-seed** | Mes 6-9 | USD 500K | Primeros 100 clientes + equipo core (CTO, product, 2 devs). |
| **Seed** | Mes 15-18 | USD 2,5M | Escalar AR + entrada Chile. |
| **Serie A** | Mes 30-36 | USD 10-15M | LATAM completo + equipo 30-60. |
| **Serie B** | Mes 54-60 | USD 40M+ | España + Brasil + Serie C path o exit. |

Target dilución fundador: <40% post-Serie A, <60% post-Serie B.

---

## 8. Sensibilidad del modelo

### Variables críticas

| Variable | Impacto si baja 20% |
|---|---|
| Conversión free → paid (12% → 9,6%) | ARR año 3 cae a USD 2,8M |
| Churn mensual (0,7% → 1%) | LTV cae 30%, CAC payback sube a 4 meses |
| CAC sube (+20%) | Break-even se mueve 6 meses |
| ARPA baja (−20%) | Revenue año 3 cae a USD 1,8M, requiere más capital |

### Palancas para mejorar

- **Subir ARPA:** +módulos verticales, +add-ons, pricing Enterprise.
- **Bajar CAC:** canales orgánicos (contenido, referidos, PLG).
- **Bajar churn:** success team, integraciones pegajosas, data lock-in (catálogo + historial).
- **Expansión:** venta cruzada de módulos a base existente.

---

## 9. Comparativa competitiva de precios

| Producto | Plan base | Plan PyME típico | Diferenciación |
|---|---|---|---|
| **Alegra** | USD 9/mes | USD 29/mes | Sin IA, WhatsApp débil. |
| **Bind ERP** | USD 35/mes | USD 85/mes | Solo México, UX antigua. |
| **Xubio** | USD 18/mes | USD 50/mes | Solo contable AR. |
| **TusFacturas** | USD 10/mes | USD 25/mes | Solo facturación. |
| **Holded** | USD 12/mes | USD 50/mes | España, sin WhatsApp LATAM. |
| **SAP B1** | — | USD 1.000+/mes + USD 50K setup | Enterprise, no PyME. |
| **Paraná** | **USD 0** | **USD 99/mes** | IA + WhatsApp + verticales + LATAM-first. |

Paraná pricing Pro (USD 99) está 2-3x sobre competidores horizontales, justificado por IA + WhatsApp + verticales, y 10x debajo de SAP/Oracle.

---

## 10. Objeciones de precio y respuestas

| Objeción | Respuesta |
|---|---|
| "Es caro" | "¿Cuánto te cuesta la hora del que pega datos entre Excel y WhatsApp? Con 2 horas/semana recuperadas, Paraná se paga." |
| "Alegra es más barato" | "Alegra hace facturas. Paraná hace facturas + WhatsApp con IA + cobranzas auto + inventario + vertical de tu rubro. Es reemplazar 5 herramientas por una." |
| "No tengo presupuesto" | "Probalo gratis 30 días o usá el tier Free para empezar. Solo pagás cuando crece tu negocio." |
| "Tengo miedo de cambiar" | "Migración asistida con IA — subís tus Excel, Paraná arma todo. En 1 día estás funcionando." |

---

**Ver también:** [`ESTRATEGIA.md`](ESTRATEGIA.md) · [`MARKETING.md`](MARKETING.md) · [`PRODUCTO.md`](PRODUCTO.md)
