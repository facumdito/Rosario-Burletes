# Paraná — Especificación de Producto

> Qué hace Paraná, módulo por módulo. MVP (v1) y evolución (v2-v4).

---

## 1. Principio rector

Paraná reemplaza 5-8 herramientas de la PyME con una sola. Cada módulo debe ser **tan bueno o mejor que el best-of-breed** de su categoría (Alegra para facturación, HubSpot Free para CRM, Zapier para automatización, etc.), pero unificado.

Regla: si un módulo no sería elegido independientemente, sobra.

---

## 2. Módulo 1 — Facturación electrónica

### MVP (AR)

- Facturación AFIP tipos A, B, C, M, E.
- Notas de crédito/débito.
- Remitos.
- Libros IVA ventas + compras.
- Retenciones y percepciones (IVA, IIBB, Ganancias).
- Exportación PDF + XML.
- Envío automático por email y WhatsApp al cliente.
- Integración con el timbrado/padrón AFIP.

### User stories clave

- *Como dueño de PyME,* quiero emitir una factura B en 20 segundos desde el celular.
- *Como contador,* quiero exportar libros IVA en formato AFIP para el período X.
- *Como cliente final,* quiero recibir mi factura por WhatsApp sin descargar nada.

### v2-v4

- SII Chile (meses 12-18).
- SAT México (meses 15-20).
- SUNAT Perú (meses 18-24).
- NF-e Brasil (meses 24-36).
- Verifactu España (meses 36-48).

---

## 3. Módulo 2 — CRM liviano

### MVP

- Ficha de cliente: razón social, CUIT, contactos, dirección, notas.
- Historial de facturas, pagos, mensajes de WhatsApp.
- Segmentación por tags, zona, tamaño, rubro.
- Alertas "cliente dormido" (>60 días sin comprar).
- Alertas "cliente deuda" (>30 días sin pagar).
- Import masivo desde Excel/CSV con detección automática de columnas (Claude).

### v2+

- Scoring de riesgo crediticio (historial + buró).
- Cumpleaños / aniversario con mensaje automático.
- Pipeline comercial básico (prospecto → cotización → cliente).

---

## 4. Módulo 3 — Inventario / catálogo

### MVP

- SKUs con variantes (color, talle, medida, material).
- Multi-sucursal / multi-depósito.
- Stock mínimo + alertas de reposición.
- Costo, precio lista, precio por canal (mayorista, minorista, online).
- **Búsqueda semántica** — el usuario escribe "perfil U 8mm caucho natural dureza 70" → Paraná entiende y devuelve el SKU correcto aunque el nombre en la base sea diferente.
- Costeo con inflación — al actualizar precio de insumo, recalcula todos los productos terminados.

### User stories clave

- *Como operario en depósito,* quiero buscar "burlete 615x685" por voz desde el celular.
- *Como dueño,* quiero saber qué productos pierden margen cuando sube el precio del caucho.
- *Como cliente,* quiero consultar stock por WhatsApp a las 23 hs y recibir respuesta.

### v2+

- Trazabilidad por lote (para rubros regulados).
- Integración Tiendanube / Mercado Shops para sincronizar stock.
- Compras automáticas a proveedor al tocar stock mínimo.

---

## 5. Módulo 4 — Cobranzas

### MVP

- Listado de facturas pendientes por cliente, ordenadas por edad.
- Recordatorios automáticos por WhatsApp + email + SMS con links de pago (Mercado Pago, Stripe).
- Reglas: "5 días antes del vencimiento recordatorio amable; 3 días después aviso firme; 15 días después escalar al gerente".
- Estado de cuenta exportable a PDF.

### v2+

- Conciliación bancaria automática — lee el resumen del banco, matchea movimientos con facturas.
- Scoring de riesgo + límite de crédito dinámico por cliente.
- Factoring embebido (descontar facturas a tasa preferencial).

---

## 6. Módulo 5 — Agente IA de WhatsApp

### MVP

- Bot entrenado con el catálogo del cliente.
- Atiende consultas 24/7: precios, stock, horarios, ubicación.
- Deriva a humano cuando detecta intención de compra compleja o reclamo.
- Responde en el tono del negocio (configurable: formal, casual, técnico).

### v2+

- Toma pedidos completos por WhatsApp con confirmación humana final.
- Recordatorios proactivos de recompra a clientes B2B ("Paladini, usualmente pedís burlete EPDM cada 45 días, ¿armamos el pedido?").
- Cobranzas conversacionales ("hola, te recuerdo que tenés una factura de $X vencida, ¿querés el link de pago?").
- Onboarding de empleados nuevos por WhatsApp.

### Arquitectura IA (ver STACK.md)

- **Claude Haiku 4.5** para respuestas rápidas WhatsApp.
- **Claude Sonnet 4.6** para razonamiento complejo (cotizaciones multi-SKU, reclamos con contexto).
- **Prompt caching** del catálogo del cliente → ahorro ~80% de tokens.
- **Embeddings** para RAG sobre catálogo + historial del cliente.

---

## 7. Módulo 6 — Dashboard financiero

### MVP

- Caja del día, mes, año.
- Ventas por canal, producto, cliente, vendedor.
- Cobranzas pendientes + próximas a vencer.
- Margen bruto por producto ajustado por inflación.
- Exportación a Excel, PDF, contador.

### v2+

- Punto de equilibrio dinámico.
- Proyección de cash flow a 90 días con IA.
- Comparativa sector (anónima, opt-in).

---

## 8. Módulo 7 — Presentismo y RRHH básico

### MVP (reemplaza RELOJ.csv)

- App móvil con face ID para fichar entrada/salida.
- Geofencing opcional (fichar solo dentro del radio de la empresa).
- Cálculo de horas trabajadas, extras, ausencias.
- Exportación mensual para liquidación.

### v2+

- Liquidación de sueldos argentina (AFIP Libro de Sueldos Digital).
- Solicitud de vacaciones / licencias por WhatsApp.
- Onboarding de personal nuevo con checklist.

---

## 9. Módulos verticales (add-on)

### 9.1 Manufactura (diferencial desde día 1)

- Órdenes de producción con las N etapas configurables (en Rosario Burletes: extrusión, prensa, postcurado, control, embalaje, túnel).
- QR en cada estación — operario escanea al iniciar/terminar etapa.
- Tablero en vivo del gerente de planta.
- Predicción de demanda B2B (recompras recurrentes).
- Consumo de materias primas por orden.
- Cuello de botella automático detectado.

### 9.2 Comercio / retail

- POS web en tablet/celular.
- Integración Tiendanube / Mercado Shops / WooCommerce.
- Gestión de vidriera (productos destacados, ofertas).
- Programa de fidelidad simple.

### 9.3 Servicios profesionales

- Agenda online con link público.
- Facturación por hora / por proyecto.
- Tracking de tiempo simple.
- Contratos + firma digital (v3).

---

## 10. Arquitectura de información (UI/UX)

### Navegación principal

```
┌─ Paraná ──────────────────────────────────────────┐
│  🏠 Inicio      💬 WhatsApp    📊 Reportes       │
│  👥 Clientes    🧾 Facturas    💰 Cobranzas      │
│  📦 Inventario  🏭 Producción  🧑 Equipo         │
│  ⚙️ Ajustes                                       │
└───────────────────────────────────────────────────┘
```

### Pantallas clave (MVP)

1. **Inicio** — caja del día, facturas pendientes, alertas, últimos mensajes WhatsApp.
2. **Nueva factura** — 3 pasos: cliente (con autocompletado) → items (con búsqueda semántica) → confirmar.
3. **Cliente** — ficha + timeline unificada (facturas, pagos, mensajes, producción si aplica).
4. **WhatsApp** — bandeja estilo app, con IA respondiendo y humano tomando control cuando quiere.
5. **Producción** (vertical manufactura) — kanban por etapas, QR grande para operarios.

### Mobile-first

- Dueño de PyME usa el celular 70% del tiempo.
- Operarios en planta solo tienen celular.
- PWA + apps nativas (Expo).

---

## 11. Integraciones externas (MVP → v2)

- **AFIP** — WSAA, WSFE, padrón, constancia.
- **Mercado Pago** — links de pago, cobros QR, conciliación.
- **WhatsApp Cloud API** — Meta directo.
- **Bancos argentinos** — extractos OFX / API (Galicia, BBVA, Santander, Macro, Nación) — scraping legal al inicio, API bancaria open banking cuando esté.
- **Tiendanube / Mercado Shops** — sincronización productos + pedidos.
- **Google Calendar** — para módulo servicios.
- **Email (Resend)** — envío transaccional.

---

## 12. Métricas de producto

### Activación (primeros 7 días)

- % usuarios que emiten primera factura.
- % usuarios que importan clientes desde Excel.
- % usuarios que conectan WhatsApp.

### Retención

- DAU/MAU >40%.
- Facturas emitidas / cliente / mes.
- Churn mensual <1% (anual <8%).

### Expansión

- % clientes con módulo vertical activado.
- Add-ons comprados / cliente.
- Take rate pagos embebidos.

### Negocio

- ARR, MRR, CAC, LTV, NPS, CSAT.

---

## 13. Out of scope (qué NO hace Paraná)

Para mantener foco:

- No es un ERP enterprise complejo (SAP, Oracle). Si la empresa >250 empleados, no somos el fit.
- No es un contador virtual — el contador sigue siendo necesario, Paraná le da los datos ordenados.
- No es un banco — embebemos pagos, no somos entidad financiera (por ahora).
- No es un CRM avanzado estilo Salesforce — el CRM es liviano, suficiente para PyME.
- No es e-commerce — integramos con Tiendanube/MS, no competimos con ellos.

---

**Ver también:** [`STACK.md`](STACK.md) · [`MARKETING.md`](MARKETING.md) · [`PRICING.md`](PRICING.md)
