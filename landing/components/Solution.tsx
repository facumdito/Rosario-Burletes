export function Solution() {
  return (
    <section id="producto" className="section">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
            La solución
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Una sola app con <span className="gradient-text">IA nativa</span> y WhatsApp en el centro.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
            Paraná une facturación, CRM, inventario, cobranzas, producción y atención al cliente en
            una plataforma diseñada desde el dueño de la PyME, no desde el contador.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-5">
            <Pillar
              n="1"
              title="LATAM-first, no gringo-first"
              body="Inflación, AFIP/SAT/SII, WhatsApp dominante, cobranzas B2B a 30/60/90 días. Asumido desde el día 1."
            />
            <Pillar
              n="2"
              title="WhatsApp-native"
              body="El canal dominante de la región. Tu agente IA atiende 24/7 entrenado con tu catálogo."
            />
            <Pillar
              n="3"
              title="IA que automatiza"
              body="Claude adentro. Cada feature ahorra minutos concretos al día. Si no, fuera."
            />
            <Pillar
              n="4"
              title="Setup en 1 día, no 6 meses"
              body="Subís tu Excel y la IA arma el CRM, el catálogo y los clientes en minutos."
            />
          </div>

          <div className="card bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-white border-none">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-3">
              WhatsApp en vivo · Paraná IA
            </div>
            <div className="space-y-3 text-sm">
              <Msg side="left">Hola, ¿tenés burlete EPDM alt 31mm en stock?</Msg>
              <Msg side="right">
                Sí, tenemos 120 metros disponibles. Precio $29.000/mt + IVA. ¿Armo el
                pedido y te paso el link de pago?
              </Msg>
              <Msg side="left">Dale, 50 metros.</Msg>
              <Msg side="right">
                Listo. Pedido #4821 confirmado. Link de pago: pago.parana.la/4821 · Factura B llega a tu mail al confirmar.
              </Msg>
              <div className="text-xs opacity-80 italic pt-2 border-t border-white/20">
                ⚡ Respondido por IA · Derivado a humano solo si el cliente lo pide
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-bg text-white font-bold flex items-center justify-center">
        {n}
      </div>
      <div>
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-[var(--color-ink-soft)] mt-1">{body}</div>
      </div>
    </div>
  );
}

function Msg({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
          side === "right" ? "bg-white text-[var(--color-ink)]" : "bg-white/20 text-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
