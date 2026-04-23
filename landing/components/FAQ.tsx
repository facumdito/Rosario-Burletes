const faqs = [
  {
    q: "¿Paraná reemplaza a mi contador?",
    a: "No. Paraná le da a tu contador los datos ordenados (libros IVA, retenciones, balances) en 1 clic. Sigue haciendo falta el criterio profesional, pero sin los mails a las 11 de la noche.",
  },
  {
    q: "¿Es compatible con AFIP?",
    a: "Sí. Facturación electrónica tipo A, B, C, M, E con homologación oficial WSFE. Notas de crédito/débito, remitos, retenciones y percepciones automáticas.",
  },
  {
    q: "¿Qué países soporta hoy?",
    a: "En MVP (2026): Argentina (AFIP). Chile (SII), México (SAT) y Perú (SUNAT) llegan en la fase LATAM (2027). Brasil y España en fase global.",
  },
  {
    q: "¿Cómo funciona el agente de WhatsApp?",
    a: "Entrenás al agente con tu catálogo (o lo importamos de tu Excel). Responde consultas de clientes 24/7, toma pedidos simples, envía links de pago y deriva a humano cuando detecta intención compleja o reclamo.",
  },
  {
    q: "¿Cuánto tarda la migración desde mi sistema actual?",
    a: "Normalmente 1 día. Subís tus Excel/CSV de clientes, productos y facturas; la IA detecta las columnas y arma todo. El equipo de Paraná te acompaña en la migración si tenés plan Pro o superior.",
  },
  {
    q: "¿Qué pasa con la inflación?",
    a: "Paraná reajusta costos, márgenes y precios por producto cuando suben los insumos. Los precios de Paraná están anclados en USD (cobro en pesos al tipo de cambio del mes) para protegerte.",
  },
  {
    q: "¿Puedo usarlo si soy monotributista sin facturación electrónica?",
    a: "Sí. El tier Free y Starter funcionan para monotributistas. La facturación electrónica se activa cuando la necesitás.",
  },
  {
    q: "¿Hay descuento para contadores que recomiendan clientes?",
    a: "Sí. Programa Paraná Partner: 20% de comisión sobre el primer año de cada cliente referido, más dashboard multi-cliente para gestionar todos desde un solo lugar.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section bg-white border-t border-[var(--color-border)]">
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Preguntas frecuentes.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="card !p-0 group"
            >
              <summary className="list-none p-5 cursor-pointer flex items-center justify-between font-semibold">
                <span>{f.q}</span>
                <span className="text-[var(--color-brand)] group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-[var(--color-ink-soft)]">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
