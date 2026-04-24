"use client";

import { useEffect, useState } from "react";
import { api, fmt } from "@/lib/api";

type Stage = {
  id: number;
  stage: string;
  started_at: string | null;
  finished_at: string | null;
  operator: string | null;
};

type Order = {
  id: number;
  number: string;
  description: string;
  quantity: number;
  status: string;
  current_stage: string;
  customer_id: number | null;
  product_id: number | null;
  created_at: string;
  stages: Stage[];
};

const STAGES = ["extrusion", "prensa", "postcurado", "control", "embalaje", "tunel"];
const STAGE_LABELS: Record<string, string> = {
  extrusion: "Extrusión",
  prensa: "Prensa",
  postcurado: "Postcurado",
  control: "Control",
  embalaje: "Embalaje",
  tunel: "Túnel",
};

export default function ProduccionPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await api<Order[]>("/production/orders");
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function advance(orderId: number, stage: string, action: "start" | "finish") {
    await api(`/production/orders/${orderId}/stage`, {
      method: "POST",
      body: JSON.stringify({ stage, action, operator: "Operador demo" }),
    });
    load();
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Producción</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-1">
          Trazabilidad por etapa. Cada orden pasa por 6 estaciones.
        </p>
      </div>

      {loading ? (
        <div className="card text-[var(--color-ink-soft)]">Cargando…</div>
      ) : orders.length === 0 ? (
        <div className="card text-[var(--color-ink-soft)]">Sin órdenes de producción</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-xs text-[var(--color-ink-soft)]">{o.number}</div>
                  <div className="font-semibold">{o.description}</div>
                  <div className="text-sm text-[var(--color-ink-soft)] mt-1">
                    Cantidad: {fmt.number(o.quantity)} · Creada: {fmt.date(o.created_at)}
                  </div>
                </div>
                <span
                  className={`badge ${
                    o.status === "done"
                      ? "badge-success"
                      : o.status === "in_progress"
                      ? "badge-info"
                      : "badge-neutral"
                  }`}
                >
                  {o.status === "done" ? "Terminada" : o.status === "in_progress" ? "En curso" : "Pendiente"}
                </span>
              </div>

              <div className="flex gap-0 relative">
                {STAGES.map((s, idx) => {
                  const stage = o.stages.find((st) => st.stage === s);
                  const finished = !!stage?.finished_at;
                  const started = !!stage?.started_at;
                  const active = o.current_stage === s && started && !finished;
                  return (
                    <div
                      key={s}
                      className="flex-1 text-center relative"
                    >
                      <div
                        className={`h-12 flex items-center justify-center text-xs font-medium ${
                          idx === 0 ? "rounded-l-lg" : ""
                        } ${idx === STAGES.length - 1 ? "rounded-r-lg" : ""} ${
                          finished
                            ? "bg-emerald-500 text-white"
                            : active
                            ? "bg-sky-500 text-white animate-pulse"
                            : "bg-[var(--color-bg)] text-[var(--color-ink-soft)]"
                        }`}
                      >
                        {STAGE_LABELS[s]}
                      </div>
                      <div className="text-[10px] text-[var(--color-ink-soft)] mt-1 h-4">
                        {stage?.operator ?? ""}
                      </div>
                      <div className="flex gap-1 justify-center mt-1">
                        {!started && o.status !== "done" && (
                          <button
                            className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-700 hover:bg-sky-200"
                            onClick={() => advance(o.id, s, "start")}
                          >
                            Iniciar
                          </button>
                        )}
                        {started && !finished && (
                          <button
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            onClick={() => advance(o.id, s, "finish")}
                          >
                            Finalizar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
