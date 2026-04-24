"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ContactoPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          company: form.company,
          source: "contacto",
          name: form.name,
          phone: form.phone,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setForm({ name: "", company: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Nav />
      <main className="section pt-24">
        <div className="container-x max-w-3xl">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-3">
              Contacto
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Hablemos <span className="gradient-text">15 minutos</span>.
            </h1>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
              Te mostramos Paraná con tus datos. Sin venta forzada.
            </p>
          </div>

          <form onSubmit={submit} className="card mt-12 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Empresa"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
              <input
                className="input"
                type="email"
                placeholder="Email de trabajo"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Teléfono / WhatsApp"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <textarea
              className="input"
              placeholder="Contanos brevemente tu rubro y tu dolor principal"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full justify-center" disabled={status === "loading"}>
              {status === "loading" ? "Enviando…" : "Coordinar demo"}
            </button>
            {status === "ok" && (
              <p className="text-sm text-emerald-600 text-center">
                ¡Gracias! Te escribimos en 24hs con un horario.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600 text-center">
                Algo falló. Podés escribirnos a hola@parana.la mientras tanto.
              </p>
            )}
          </form>

          <div className="mt-10 text-center text-sm text-[var(--color-ink-soft)]">
            <p>📍 Rosario, Santa Fe, Argentina</p>
            <p>✉️ hola@parana.la</p>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #0c4a6e;
          color: white;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .btn-primary:hover { background: #075985; }
      `}</style>
    </>
  );
}
