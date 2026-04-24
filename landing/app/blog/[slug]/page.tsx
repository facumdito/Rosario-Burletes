import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { posts, getPost } from "@/lib/posts";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  return post
    ? {
        title: `${post.title} — Paraná Blog`,
        description: post.excerpt,
      }
    : { title: "Post no encontrado" };
}

const POST_BODIES: Record<string, () => React.ReactElement> = {
  "facturacion-electronica-afip": () => (
    <>
      <p>
        Si sos dueño de una PyME argentina y todavía estás armando facturas a mano en un
        Word, o peor, comprando talonarios preimpresos, estás dejando plata arriba de la
        mesa. La <strong>facturación electrónica con AFIP</strong> es obligatoria para
        prácticamente todos los rubros desde hace años, y el costo real de no automatizarla
        no son los honorarios del contador — es tu tiempo.
      </p>

      <h2>Los tipos de comprobantes que importan</h2>
      <ul>
        <li><strong>Factura A:</strong> entre empresas inscriptas en IVA (B2B). Discrimina IVA.</li>
        <li><strong>Factura B:</strong> a consumidor final o monotributistas. No discrimina.</li>
        <li><strong>Factura C:</strong> emitida por monotributistas.</li>
        <li><strong>Factura M / E:</strong> casos especiales (nuevos contribuyentes, exportación).</li>
      </ul>

      <h2>¿Qué es el CAE y cómo se obtiene?</h2>
      <p>
        El CAE (Código de Autorización Electrónico) es el número que AFIP le asigna a cada
        factura para validarla. Se obtiene vía el servicio web WSFE tras autenticar con
        WSAA (el servicio de tickets de AFIP). Un sistema bien integrado hace este flujo
        transparente: vos apretás <em>Emitir</em> y en 3 segundos tu factura ya está
        homologada.
      </p>

      <h2>Cuánto tiempo ahorrás en la realidad</h2>
      <p>
        Medimos esto con Rosario Burletes antes y después. Emitir una factura B típica
        pasó de 4 minutos (copiar cliente, pegar productos, calcular IVA, abrir portal,
        pegar CAE, enviar email) a <strong>18 segundos</strong> en Paraná — cliente
        autocompletado, productos desde catálogo, CAE automático, envío por WhatsApp
        incluido.
      </p>

      <p>
        Con 120 facturas al mes son <strong>8 horas ahorradas mensuales</strong>. A precio
        hora de dueño de PyME argentino (2026), la suscripción Pro se paga sola la
        primera semana del mes.
      </p>
    </>
  ),

  "whatsapp-business-ia": () => (
    <>
      <p>
        El 90% de las consultas comerciales que recibe una PyME en Argentina, Chile o
        México entran por WhatsApp. Fuera del horario comercial, al mediodía cuando están
        todos almorzando, o cuando el único que contesta está atendiendo en el mostrador —
        esa consulta se pierde o peor, la agarra la competencia.
      </p>

      <h2>El agente IA no es un chatbot de 2018</h2>
      <p>
        La diferencia entre un bot de reglas (<em>"presioná 1 para X"</em>) y un agente
        basado en <strong>Claude 4.5/4.6</strong> es la misma que entre un contestador
        automático y un empleado. El agente:
      </p>
      <ul>
        <li>Entiende preguntas con errores de tipeo, jerga local y medidas técnicas.</li>
        <li>Consulta el catálogo en vivo: precio, stock, plazo de entrega.</li>
        <li>Genera cotizaciones completas con varios productos.</li>
        <li>Detecta cuándo conviene derivar a un humano (reclamo, pedido grande, tema fiscal).</li>
      </ul>

      <h2>¿Cuánto puede resolver sin tu intervención?</h2>
      <p>
        En nuestros pilotos, el agente resuelve completo el <strong>62-78%</strong> de las
        conversaciones. El dueño solo ve un resumen al final del día de lo que pasó, y
        solo interviene cuando el agente levanta la mano.
      </p>

      <h2>Lo que NO hace (y está bien)</h2>
      <ul>
        <li>No se inventa precios que no están en el catálogo.</li>
        <li>No confirma pedidos grandes sin derivar.</li>
        <li>No maneja reclamos complejos (los pasa a persona con resumen).</li>
      </ul>

      <p>
        La regla mental: la IA hace lo <em>repetitivo que aburre</em>, la persona hace lo{" "}
        <em>delicado que importa</em>. Y tu cliente obtiene respuesta a las 23 hs sin que
        nadie se quede hasta tarde.
      </p>
    </>
  ),

  "digitalizacion-pyme-industrial": () => (
    <>
      <p>
        Rosario Burletes es una manufacturera argentina de sellos de caucho con 200+
        clientes B2B, 1.364 SKUs, 6 etapas de producción (extrusión, prensa, postcurado,
        control, embalaje, túnel) y 23.000 líneas de venta al mes. También es el{" "}
        <strong>caso cero</strong> de Paraná — el lugar donde probamos todo antes de
        salirlo a vender.
      </p>

      <h2>Punto de partida: cómo estaban antes</h2>
      <ul>
        <li>Catálogo de materias primas en Excel (<code>todas gomas.csv</code>).</li>
        <li>Órdenes de producción en hojas sueltas y otro Excel (<code>perfil e.csv</code>).</li>
        <li>Reloj de presentismo por CSV mensual.</li>
        <li>Cobranzas en una libreta; recordatorios por WhatsApp manual.</li>
        <li>Predicción de recompras hecha en un notebook de Colab por probar.</li>
      </ul>

      <h2>El plan de 30 días</h2>
      <ol>
        <li><strong>Semana 1:</strong> importar el catálogo completo y los clientes desde los CSV. Claude armó la estructura automática en 20 minutos.</li>
        <li><strong>Semana 2:</strong> facturación AFIP electrónica homologada. Del día 10 en adelante, todas las facturas salen de Paraná.</li>
        <li><strong>Semana 3:</strong> QR en cada estación de producción. Los operarios escanean al empezar y terminar cada etapa. Dashboard en vivo para el gerente de planta.</li>
        <li><strong>Semana 4:</strong> agente WhatsApp encendido con el catálogo completo. Recordatorios automáticos de recompra a Paladini, Brafh, Comasa.</li>
      </ol>

      <h2>Qué cambió al mes</h2>
      <ul>
        <li>Tiempo de cotización B2B: de 12 minutos a 90 segundos.</li>
        <li>Facturas emitidas con error: de 3-4% a &lt;0,5%.</li>
        <li>Consultas WhatsApp resueltas sin intervención: 71%.</li>
        <li>Reclamos por factura no recibida: prácticamente cero (se manda auto por WhatsApp).</li>
      </ul>

      <p>
        ¿Lo más importante? El dueño dejó de ser el cuello de botella. La planta corre, él
        mira el negocio desde el celular. Eso es lo que queremos llevar a las 10.000
        PyMEs de LATAM en los próximos 5 años.
      </p>
    </>
  ),
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const Body = POST_BODIES[slug];

  return (
    <>
      <Nav />
      <main className="section pt-24">
        <article className="container-x max-w-3xl">
          <Link
            href="/blog"
            className="text-sm text-[var(--color-brand)] font-semibold hover:underline"
          >
            ← Volver al blog
          </Link>

          <header className="mt-6 mb-10">
            <div className="flex items-center gap-3 text-xs text-[var(--color-ink-soft)] mb-4">
              <span className="badge-info text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} de lectura</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-xl text-[var(--color-ink-soft)]">{post.excerpt}</p>
          </header>

          <div className="prose-custom">{Body && <Body />}</div>

          <div className="card gradient-bg text-white border-none mt-16 text-center">
            <h2 className="text-2xl font-bold">¿Lo probás en tu PyME?</h2>
            <p className="mt-2 text-white/90">
              Sumate a las primeras 100 empresas con 50% off el primer año.
            </p>
            <Link
              href="/#waitlist"
              className="inline-block mt-4 bg-[var(--color-accent)] hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Sumarme a la lista
            </Link>
          </div>
        </article>
      </main>
      <Footer />

      <style>{`
        .prose-custom p { margin-bottom: 1.25rem; font-size: 1.05rem; line-height: 1.75; color: var(--color-ink); }
        .prose-custom h2 { font-size: 1.75rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--color-brand); }
        .prose-custom ul, .prose-custom ol { margin: 1rem 0 1.5rem 1.5rem; }
        .prose-custom li { margin-bottom: 0.5rem; line-height: 1.7; }
        .prose-custom code { background: var(--color-brand-soft); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.9em; }
        .prose-custom strong { color: var(--color-brand); }
      `}</style>
    </>
  );
}
