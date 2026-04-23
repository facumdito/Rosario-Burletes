export function Hero() {
  return (
    <section id="top" className="section pt-20">
      <div className="container-x text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)] bg-[var(--color-brand-soft)]/40 px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--color-brand-2)] animate-pulse" />
          Early access · Rosario, Argentina
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
          El sistema operativo <br className="hidden md:inline" />
          digital de tu <span className="gradient-text">PyME</span>.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[var(--color-ink-soft)] max-w-2xl mx-auto">
          Reemplazá WhatsApp + Excel + facturador + banco + planilla por <strong>una sola app con IA</strong>.
          Desde el mostrador hasta la nube. LATAM-first.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#waitlist" className="btn-primary text-base">
            Empezar gratis
            <span aria-hidden>→</span>
          </a>
          <a href="#caso" className="btn-secondary text-base">
            Ver caso real
          </a>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="card !p-0 overflow-hidden shadow-xl text-left">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-slate-50">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-4 text-xs font-mono text-slate-500">app.parana.la</span>
      </div>
      <div className="p-6 md:p-8 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Caja hoy" value="$1.482.000" trend="+18%" trendPositive />
          <StatBox label="Facturas mes" value="127" trend="+22%" trendPositive />
          <StatBox label="A cobrar" value="$3.240.000" trend="8 vencidas" trendPositive={false} />
          <StatBox label="WhatsApp IA" value="42 conv." trend="90% auto" trendPositive />
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
          <MiniCard title="📦 Próxima reposición" body="EPDM alt 31mm · stock crítico · proveedor RubberCorp" />
          <MiniCard title="🏭 Producción en curso" body="23 órdenes · 2 cuellos en prensa postcurado" />
          <MiniCard title="🧠 IA sugiere" body="Paladini suele pedir cada 45 días — recordar hoy" />
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  trend,
  trendPositive,
}: {
  label: string;
  value: string;
  trend: string;
  trendPositive: boolean;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className="text-xs text-[var(--color-ink-soft)] font-medium">{label}</div>
      <div className="text-xl md:text-2xl font-bold mt-1">{value}</div>
      <div
        className={`text-xs mt-1 font-medium ${
          trendPositive ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {trend}
      </div>
    </div>
  );
}

function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-[var(--color-ink-soft)] text-xs leading-relaxed">{body}</div>
    </div>
  );
}
