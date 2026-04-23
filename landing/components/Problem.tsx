export function Problem() {
  const items = [
    { icon: "📱", title: "WhatsApp desordenado", body: "Pedidos, consultas y reclamos perdidos entre 200 chats." },
    { icon: "📊", title: "Excel por todos lados", body: "Stock, clientes, precios y caja en planillas que no hablan entre sí." },
    { icon: "🧾", title: "Facturador aislado", body: "AFIP/SAT/SII por un lado, el resto de tu negocio por otro." },
    { icon: "🏦", title: "Banco sin conciliar", body: "Horas por semana matcheando movimientos con facturas a mano." },
    { icon: "⏰", title: "Planilla de asistencia", body: "Papel o un reloj fichador de 2005 que nadie revisa." },
    { icon: "🧑‍💼", title: "Contador esperando", body: "Todos los meses: misma historia, archivos por mail." },
  ];

  return (
    <section id="problema" className="section bg-white border-y border-[var(--color-border)]">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
            El problema
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            El dueño de la PyME pierde <span className="gradient-text">60% de su tiempo</span> pegando datos.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
            Una PyME de 5-50 empleados vive hoy fragmentada en 5-8 herramientas que no se hablan entre sí.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.title} className="card">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="font-semibold mb-1">{item.title}</div>
              <div className="text-sm text-[var(--color-ink-soft)]">{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
