export function Features() {
  const features = [
    {
      icon: "🧾",
      title: "Facturación electrónica",
      body: "AFIP en 20 segundos. SII, SAT, SUNAT y NF-e en fases siguientes. Libros IVA automáticos.",
    },
    {
      icon: "👥",
      title: "CRM liviano",
      body: "Clientes, historial, notas, alertas de dormidos y deudas. Import desde Excel con IA.",
    },
    {
      icon: "📦",
      title: "Inventario inteligente",
      body: "Búsqueda semántica: 'perfil U 8mm neopreno' encuentra el SKU aunque esté cargado de otra forma.",
    },
    {
      icon: "💰",
      title: "Cobranzas automáticas",
      body: "WhatsApp + email + SMS con links de pago. Conciliación bancaria al toque.",
    },
    {
      icon: "💬",
      title: "Agente IA WhatsApp",
      body: "Entrenado con tu catálogo. Atiende, cotiza, cobra y deriva a humano cuando corresponde.",
    },
    {
      icon: "📊",
      title: "Dashboard financiero",
      body: "Caja, márgenes y cash flow ajustado por inflación. Exportable al contador en 1 clic.",
    },
    {
      icon: "🏭",
      title: "Módulo manufactura",
      body: "Órdenes, trazabilidad por etapas con QR, predicción de recompras B2B.",
    },
    {
      icon: "🛒",
      title: "Módulo retail",
      body: "POS web, integración Tiendanube/Mercado Shops, gestión de vidriera.",
    },
    {
      icon: "🧑‍💼",
      title: "Módulo servicios",
      body: "Agenda online, facturación por hora, tracking de tiempo simple.",
    },
  ];

  return (
    <section className="section bg-white border-y border-[var(--color-border)]">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
            Producto
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Todo lo que tu PyME necesita <span className="gradient-text">en un solo lugar</span>.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-[var(--color-ink-soft)]">{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
