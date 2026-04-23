export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      desc: "Micro-empresa para empezar",
      features: ["10 facturas/mes", "50 clientes", "1 usuario", "Soporte comunidad"],
      cta: "Empezar gratis",
      highlighted: false,
    },
    {
      name: "Starter",
      price: "29",
      desc: "3-10 empleados",
      features: [
        "Facturas ilimitadas",
        "3 usuarios",
        "CRM + inventario 1.000 SKUs",
        "WhatsApp 1 número",
        "Soporte email",
      ],
      cta: "Probar 30 días",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "99",
      desc: "10-50 empleados · más popular",
      features: [
        "10 usuarios",
        "SKUs ilimitados",
        "🧠 Agente IA WhatsApp",
        "Predicción de demanda",
        "Cobranzas automáticas",
        "1 módulo vertical",
        "Soporte prioritario",
      ],
      cta: "Empezar Pro",
      highlighted: true,
    },
    {
      name: "Business",
      price: "299",
      desc: "50-250 empleados",
      features: [
        "30 usuarios",
        "Multi-sucursal",
        "API + SSO",
        "Todos los módulos verticales",
        "Soporte dedicado",
      ],
      cta: "Hablar con ventas",
      highlighted: false,
    },
  ];

  return (
    <section id="precios" className="section bg-white border-y border-[var(--color-border)]">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
            Precios
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, transparente. <span className="gradient-text">Free tier real.</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
            Precios en USD, cobro en moneda local. Sin sorpresas.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card flex flex-col ${
                p.highlighted
                  ? "ring-2 ring-[var(--color-brand)] relative"
                  : ""
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-brand)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recomendado
                </div>
              )}
              <div className="text-sm font-semibold text-[var(--color-brand)]">
                {p.name}
              </div>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-extrabold">USD {p.price}</span>
                {p.price !== "0" && (
                  <span className="text-[var(--color-ink-soft)] text-sm pb-1">/mes</span>
                )}
              </div>
              <div className="text-sm text-[var(--color-ink-soft)] mt-1">{p.desc}</div>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--color-brand-2)]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`mt-6 text-center ${
                  p.highlighted ? "btn-primary" : "btn-secondary"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--color-ink-soft)] mt-10">
          +Enterprise custom para 250+ empleados · SLA 99,95% · on-prem opcional.
        </p>
      </div>
    </section>
  );
}
