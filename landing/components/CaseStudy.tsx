export function CaseStudy() {
  return (
    <section id="caso" className="section">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
            Caso 0
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Rosario Burletes: planta real, <span className="gradient-text">no un demo</span>.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
            Manufacturera argentina de sellos de caucho. Corre su operación con Paraná todos los días.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-4 gap-5 text-center">
          <Metric big="1.364" label="SKUs activos" />
          <Metric big="200+" label="Clientes B2B" />
          <Metric big="23K" label="Líneas de venta/mes" />
          <Metric big="6" label="Etapas de producción" />
        </div>

        <div className="mt-14 card max-w-3xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-2">
            Clientes que confían en la operación
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[var(--color-ink-soft)] font-medium">
            <span>Paladini</span>
            <span>Industrias Brafh</span>
            <span>Comasa</span>
            <span>Plasbe</span>
            <span>La Goma Argentina</span>
            <span>Flexiglass</span>
            <span>Aponus</span>
            <span>+200 más</span>
          </div>
        </div>

        <blockquote className="mt-12 max-w-3xl mx-auto text-center text-xl md:text-2xl font-medium italic text-[var(--color-ink)] leading-relaxed">
          "Antes pasábamos 3 horas por día entre Excel, WhatsApp y el facturador.
          Con Paraná, la planta corre sola y yo miro el negocio desde el celular."
          <footer className="mt-4 text-sm not-italic text-[var(--color-ink-soft)]">
            — Rosario Burletes, Rosario, Santa Fe
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

function Metric({ big, label }: { big: string; label: string }) {
  return (
    <div className="card">
      <div className="text-4xl md:text-5xl font-extrabold gradient-text">{big}</div>
      <div className="text-sm text-[var(--color-ink-soft)] mt-2">{label}</div>
    </div>
  );
}
