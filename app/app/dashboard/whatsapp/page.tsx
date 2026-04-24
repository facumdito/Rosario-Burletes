"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Message = {
  id: number;
  direction: string;
  sender: string;
  content: string;
  created_at: string;
};

type Conversation = {
  id: number;
  phone: string;
  contact_name: string | null;
  status: string;
  ai_enabled: boolean;
  last_message_at: string | null;
  messages: Message[];
};

export default function WhatsAppPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [simulateMode, setSimulateMode] = useState(false);
  const [simPhone, setSimPhone] = useState("+5493415550101");
  const [simText, setSimText] = useState("");

  async function load() {
    setLoading(true);
    const data = await api<Conversation[]>("/whatsapp/conversations");
    setConvs(data);
    if (data.length && !active) setActive(data[0]);
    if (active) {
      const fresh = data.find((c) => c.id === active.id);
      if (fresh) setActive(fresh);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !reply) return;
    await api(`/whatsapp/conversations/${active.id}/send`, {
      method: "POST",
      body: JSON.stringify({ phone: active.phone, content: reply }),
    });
    setReply("");
    load();
  }

  async function simulateIncoming(e: React.FormEvent) {
    e.preventDefault();
    if (!simText) return;
    await api("/whatsapp/simulate", {
      method: "POST",
      body: JSON.stringify({ phone: simPhone, content: simText }),
    });
    setSimText("");
    load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1">
            Bandeja unificada con agente IA + handoff a humano
          </p>
        </div>
        <button
          className="btn-ghost btn"
          onClick={() => setSimulateMode(!simulateMode)}
        >
          {simulateMode ? "Cerrar simulador" : "🧪 Simular mensaje entrante"}
        </button>
      </div>

      {simulateMode && (
        <form onSubmit={simulateIncoming} className="card mb-6 grid md:grid-cols-3 gap-2">
          <input
            className="input"
            placeholder="Teléfono (+54…)"
            value={simPhone}
            onChange={(e) => setSimPhone(e.target.value)}
          />
          <input
            className="input md:col-span-1"
            placeholder='Mensaje del cliente — ej "hola, precio burlete 31mm?"'
            value={simText}
            onChange={(e) => setSimText(e.target.value)}
          />
          <button className="btn">Enviar como cliente (dispara IA)</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4 h-[70vh]">
        <div className="card !p-0 overflow-y-auto">
          {loading && convs.length === 0 ? (
            <div className="p-4 text-sm text-[var(--color-ink-soft)]">Cargando…</div>
          ) : convs.length === 0 ? (
            <div className="p-4 text-sm text-[var(--color-ink-soft)]">Sin conversaciones</div>
          ) : (
            convs.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className={`w-full text-left p-4 border-b border-[var(--color-border)] transition ${
                  active?.id === c.id ? "bg-[var(--color-brand-soft)]" : "hover:bg-[var(--color-bg)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.contact_name ?? c.phone}</div>
                  <span className={`badge ${c.status === "open" ? "badge-success" : c.status === "human" ? "badge-warning" : "badge-neutral"}`}>
                    {c.status === "human" ? "👤 humano" : c.ai_enabled ? "🤖 IA" : "manual"}
                  </span>
                </div>
                <div className="text-xs text-[var(--color-ink-soft)] mt-1 truncate">
                  {c.messages[c.messages.length - 1]?.content ?? "—"}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="md:col-span-2 card flex flex-col">
          {active ? (
            <>
              <div className="pb-3 mb-3 border-b border-[var(--color-border)]">
                <div className="font-semibold">
                  {active.contact_name ?? active.phone}
                </div>
                <div className="text-xs text-[var(--color-ink-soft)]">{active.phone}</div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        m.direction === "outbound"
                          ? m.sender === "ai"
                            ? "bg-sky-50 text-sky-900 border border-sky-200"
                            : "bg-[var(--color-brand)] text-white"
                          : "bg-[var(--color-bg)] text-[var(--color-ink)]"
                      }`}
                    >
                      {m.sender === "ai" && (
                        <div className="text-[10px] font-semibold text-sky-700 mb-1">🤖 IA</div>
                      )}
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="mt-4 flex gap-2">
                <input
                  className="input"
                  placeholder="Respuesta manual al cliente…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button className="btn">Enviar</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-ink-soft)]">
              Seleccioná una conversación
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
