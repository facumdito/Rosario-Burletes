# Paraná — Estrategia

> Análisis de mercado, posicionamiento, roadmap estratégico y fases geográficas.

---

## 1. Diagnóstico de mercado

### El problema real de la PyME en LATAM

Una PyME argentina, chilena o mexicana de 5-50 empleados vive hoy fragmentada en 5-8 herramientas:

- **WhatsApp Business** (cliente y equipo) — sin integración con nada.
- **Excel** o Google Sheets para stock, precios, clientes, caja.
- **Facturador AFIP/SAT/SII** (TusFacturas, Alegra, Bind) — aislado del resto.
- **Banco web** para conciliar pagos a mano.
- **Planilla de asistencia** en papel o reloj fichador antiguo.
- **Mercado Pago / Tiendanube** para cobrar, con exportaciones manuales a Excel.
- **Contador externo** que pide todo por mail cada mes.

Resultado: el dueño de la PyME pasa 60% de su tiempo pegando datos entre herramientas. Errores, demoras, stress, imposibilidad de crecer.

### Tamaño del mercado

| Métrica | Valor |
|---|---|
| TAM — PyMEs LATAM | ~10.000.000 |
| SAM — digitalizables próximos 5 años | ~2.000.000 |
| SOM 5 años Paraná (0,5% SAM) | ~10.000 clientes pagos |
| TAM — PyMEs Argentina | ~600.000 |
| TAM — Rosario + Santa Fe | ~25.000 |

### Paisaje competitivo

| Actor | Fortaleza | Debilidad | Dónde pega Paraná |
|---|---|---|---|
| **Alegra** (Colombia) | Facturación multi-país | Poca IA, WhatsApp débil, sin módulos verticales | IA nativa + WhatsApp como centro + vertical manufactura. |
| **Bind / Xubio / TusFacturas** (AR) | AFIP sólido | Solo facturación, UX vieja | Plataforma completa, no solo facturador. |
| **Holded** (España) | Todo-en-uno elegante | Foco España/EU, sin WhatsApp LATAM | Diseñado LATAM-first. |
| **SAP B1 / Oracle NetSuite** | Potencia | USD 50k+ implementación, 6 meses | 100x más barato, setup en 1 día. |
| **Tiendanube** | E-commerce LATAM fuerte | Solo e-commerce | Integración, no competencia directa. |
| **Contabilium / Colppy** | Contabilidad | Foco contador, no dueño de PyME | Foco en el dueño, no en el contador. |

**Hueco claro:** una plataforma LATAM-first, con IA (Claude) y WhatsApp en el centro, que unifica operación + facturación + cobranzas, con módulos verticales que las horizontales no tienen.

---

## 2. Posicionamiento

### Frase de posicionamiento

> **Para** el dueño de una PyME LATAM que pierde horas por día pegando datos entre WhatsApp, Excel, el facturador y el banco,
> **Paraná es** el sistema operativo digital que unifica todo
> **A diferencia de** los ERPs caros y los facturadores aislados,
> **Paraná** corre tu negocio con IA y WhatsApp nativos, desde tu mostrador hasta la nube.

### Principios de producto

1. **LATAM-first, no gringo-first.** Inflación, AFIP/SAT/SII, WhatsApp dominante, cobranzas B2B a 30/60/90 días, pesos volátiles — todo asumido desde el día 1.
2. **Dueño-first, no contador-first.** La UI la abre el dueño de la PyME, no su contador. El contador accede como rol invitado.
3. **WhatsApp-native.** WhatsApp no es un canal más — es la primera pantalla para clientes, proveedores y equipo.
4. **IA que automatiza, no IA que impresiona.** Cada feature de IA ahorra minutos concretos al día. Si no, fuera.
5. **Setup en 1 día, no 6 meses.** Onboarding guiado, importación de Excel/CSV automática con IA.
6. **Precio en USD, cobro en moneda local.** Protege el LTV frente a devaluaciones.

---

## 3. Estrategia de entrada

### Secuencia geográfica

```
Rosario (0-12m)
   ↓
Argentina nacional (12-24m)
   ↓
Chile → México → Perú (24-48m)
   ↓
Brasil → España → Global (48m+)
```

### Por qué esta secuencia

- **Rosario** — ciudad del usuario, red B2B existente, Bolsa de Comercio como aliado institucional, costos bajos, talento UNR/UTN.
- **Argentina nacional** — AFIP ya resuelto del MVP, mercado 25x Rosario, competidores locales con UX vieja.
- **Chile primero en LATAM** — SII muy digital, adopción tech alta, mercado ordenado, buena relación precio-esfuerzo.
- **México segundo** — mercado 3x AR, SAT digital, competencia (Bind, Aspel) con peor UX que la nuestra.
- **Perú tercero** — SUNAT digital, competencia débil, ticket promedio decente.
- **Brasil cuarto** — mercado 5x AR pero NF-e/ICMS/municipal complejo; entrar con partner local.
- **España quinto** — idioma, puerta a EU, vínculos migratorios con LATAM.

### Por qué Rosario es la base correcta

- Cluster industrial diverso (caucho, autopartes, alimentos, agro).
- Bolsa de Comercio de Rosario = acceso a red PyME más grande fuera de Buenos Aires.
- Costo operación 40% menor que CABA.
- Talento técnico UNR + UTN + polos privados.
- Caso 0 Rosario Burletes con 23K ventas/mes valida el producto sin irse de la ciudad.

---

## 4. Roadmap estratégico (4 fases)

### Fase 1 — Paraná Core (meses 0-6)

**Objetivo:** MVP funcional corriendo Rosario Burletes + 5 PyMEs piloto.

- Facturación AFIP (WSAA/WSFE) — homologación oficial.
- CRM básico + inventario + catálogo semántico (pgvector).
- WhatsApp Cloud API — mensajes transaccionales.
- Dashboard caja + ventas + cobranzas pendientes.
- Auth, multi-tenant, roles.

**KPIs fin de fase:** 6 PyMEs activas, 2.000 facturas emitidas, NPS >40.

### Fase 2 — Paraná Intel (meses 6-12)

**Objetivo:** diferenciación con IA + módulo vertical manufactura.

- Agente IA WhatsApp (Claude Haiku 4.5) — atiende clientes 24/7.
- Predicción de demanda B2B (evolución del notebook actual).
- Cobranzas automáticas con links de pago.
- Conciliación bancaria automática.
- Módulo manufactura completo (órdenes + 6 etapas + QR).

**KPIs fin de fase:** 100 clientes pagos, ARR USD 120K, CAC <USD 150.

### Fase 3 — Paraná LATAM (meses 12-24)

**Objetivo:** expansión nacional + entrada Chile/México.

- Facturación SII (Chile), SAT (México), SUNAT (Perú).
- Módulos verticales retail + servicios.
- Marketplace de apps (partners construyen sobre Paraná).
- Office comercial en Santiago o CDMX.

**KPIs fin de fase:** 1.000 clientes, ARR USD 1M, presencia en 3 países.

### Fase 4 — Paraná Global (meses 24-48)

**Objetivo:** escala regional + entrada Brasil/España.

- NF-e Brasil con partner local.
- Facturación España (Verifactu / SII-AEAT).
- API pública + SDK.
- Embedded finance: factoring, pagos a proveedores, cuenta remunerada.
- Ronda Serie A (USD 10-15M) para acelerar.

**KPIs fin de fase:** 10.000 clientes, ARR USD 10M+, presencia en 7 países.

---

## 5. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| AFIP cambia formato WSFE | Adapter aislado, tests con ambiente homologación, alertas en CI. |
| Devaluación destruye LTV | Pricing anclado en USD, repricing automático trimestral. |
| Competidor incumbente (Alegra) lanza WhatsApp+IA | Foco en verticales donde no van a ir (manufactura), velocidad, precio. |
| WhatsApp cambia política Business API | Canal secundario vía SMS + email como fallback; relación directa con Meta LATAM. |
| Dificultad para contratar talento senior en Rosario | Remoto desde día 1, hiring LATAM (Córdoba, Mendoza, Montevideo, Santiago). |
| Rosario Burletes distrae del SaaS | Equipo de producto separado, operación industrial autónoma. |

---

## 6. Decisiones estratégicas tomadas

- **Nombre:** Paraná (río LATAM, Rosario-origin, bilingüe ES/PT).
- **Foco:** PyMEs en general (horizontal), no solo manufactura.
- **Origen:** Rosario.
- **Caso 0:** Rosario Burletes como prueba real de producto.
- **Stack core:** Python/FastAPI + Next.js + PostgreSQL + Claude API + WhatsApp Cloud API.
- **Pricing:** USD anclado, cobro en moneda local, freemium + 4 tiers pagos.
- **Go-to-market fase 1:** red B2B existente + aliados institucionales Rosario + contenido técnico.

---

## 7. Medidas de éxito a 5 años

- 10.000 clientes pagos en 7 países.
- ARR USD 10M+ (caso conservador) / USD 40M+ (caso optimista).
- Equipo de 80-120 personas distribuido LATAM.
- NPS >60.
- Churn anual <8%.
- LTV/CAC >3.
- Serie A + Serie B cerradas; camino claro a Series C / IPO o adquisición estratégica.

---

**Archivos relacionados:**
- [`PRODUCTO.md`](PRODUCTO.md) — especificación funcional.
- [`STACK.md`](STACK.md) — decisiones técnicas.
- [`MARKETING.md`](MARKETING.md) — plan GTM detallado.
- [`PRICING.md`](PRICING.md) — unit economics.
- [`pitch/parana.md`](pitch/parana.md) — deck para inversores/clientes.
