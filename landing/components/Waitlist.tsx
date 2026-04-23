"use client";

import { useState } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });

      if (!res.ok) throw new Error("fail");

      setStatus("success");
      setMessage("¡Listo! Te sumamos a la lista. Te avisamos apenas abramos acceso.");
      setEmail("");
      setCompany("");
    } catch {
      setStatus("error");
      setMessage("Algo falló. Probá de nuevo en un minuto.");
    }
  }

  return (
    <section id="waitlist" className="section">
      <div className="container-x max-w-3xl">
        <div className="card gradient-bg text-white border-none text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-soft)] mb-3">
            Early access
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Sumate a las primeras 100 PyMEs.
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-xl mx-auto">
            Los primeros 100 acceden al plan Pro con <strong>50% de descuento el primer año</strong> y
            soporte directo del equipo fundador.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-[var(--color-ink)] bg-white border border-white/20 outline-none focus:ring-2 focus:ring-[var(--color-brand-soft)]"
            />
            <input
              type="text"
              placeholder="Tu empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-[var(--color-ink)] bg-white border border-white/20 outline-none focus:ring-2 focus:ring-[var(--color-brand-soft)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[var(--color-accent)] hover:bg-amber-600 transition text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-60"
            >
              {status === "loading" ? "Enviando..." : "Sumate"}
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm ${status === "success" ? "text-emerald-200" : "text-amber-200"}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-xs text-white/70">
            Solo usamos tu email para avisarte cuando abramos acceso. Sin spam.
          </p>
        </div>
      </div>
    </section>
  );
}
