import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { posts } from "@/lib/posts";

export const metadata = {
  title: "Blog — Paraná",
  description:
    "Guías prácticas sobre digitalización PyME, AFIP, WhatsApp Business, IA aplicada y casos reales de la industria LATAM.",
};

export default function BlogIndex() {
  return (
    <>
      <Nav />
      <main className="section pt-24">
        <div className="container-x max-w-4xl">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
              Blog
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Guías <span className="gradient-text">prácticas</span> para digitalizar tu PyME.
            </h1>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
              Sin relleno. Escrito desde la planta, no desde un pitch.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <article className="card hover:shadow-lg transition">
                  <div className="flex items-center gap-3 text-xs text-[var(--color-ink-soft)] mb-3">
                    <span className="badge-info text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime} de lectura</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <p className="text-[var(--color-ink-soft)]">{post.excerpt}</p>
                  <div className="mt-4 text-[var(--color-brand)] font-semibold text-sm">
                    Leer nota →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
