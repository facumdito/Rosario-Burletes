"use client";

import { useEffect, useState } from "react";
import { api, fmt } from "@/lib/api";

type Stats = {
  cash_today: number;
  invoices_this_month: number;
  pending_collection: number;
  overdue_count: number;
  whatsapp_open: number;
  production_active: number;
  top_customers: { name: string; total: number }[];
  monthly_sales: { month: string; total: number }[];
};

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/dashboard/stats")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <div className="card bg-red-50 border-red-200 text-red-800">
          No pudimos cargar los datos: {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-[var(--color-ink-soft)]">Cargando…</div>;
  }

  const maxMonthly = Math.max(...stats.monthly_sales.map((m) => m.total), 1);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inicio</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-1">
          Tu negocio en una pantalla.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Caja hoy" value={fmt.currency(stats.cash_today)} color="success" />
        <StatCard
          label="Facturas del mes"
          value={fmt.number(stats.invoices_this_month)}
          color="info"
        />
        <StatCard
          label="Por cobrar"
          value={fmt.currency(stats.pending_collection)}
          hint={`${stats.overdue_count} vencidas`}
          color={stats.overdue_count > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="WhatsApp abiertos"
          value={fmt.number(stats.whatsapp_open)}
          color="info"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="card md:col-span-2">
          <h2 className="font-semibold mb-4">Ventas últimos 6 meses</h2>
          <div className="flex items-end gap-2 h-40">
            {stats.monthly_sales.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full bg-gradient-to-t from-[var(--color-brand)] to-[var(--color-brand-2)] rounded-t"
                  style={{ height: `${(m.total / maxMonthly) * 100}%`, minHeight: 4 }}
                  title={fmt.currency(m.total)}
                />
                <div className="text-xs text-[var(--color-ink-soft)] mt-2">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Órdenes en producción</h2>
          <div className="text-4xl font-bold">{stats.production_active}</div>
          <p className="text-sm text-[var(--color-ink-soft)] mt-2">
            activas entre pendientes y en curso.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Top clientes del mes</h2>
        {stats.top_customers.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">
            Todavía no hay ventas este mes.
          </p>
        ) : (
          <ul className="space-y-2">
            {stats.top_customers.map((c, i) => (
              <li
                key={c.name}
                className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-[var(--color-brand-soft)] text-[var(--color-brand)] rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {c.name}
                </span>
                <span className="font-semibold">{fmt.currency(c.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: string;
  hint?: string;
  color: "success" | "info" | "warning" | "neutral";
}) {
  const colorMap = {
    success: "text-emerald-600",
    info: "text-sky-600",
    warning: "text-amber-600",
    neutral: "text-[var(--color-ink-soft)]",
  };
  return (
    <div className="card">
      <div className="text-xs font-medium text-[var(--color-ink-soft)] uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-2xl font-bold mt-2 ${colorMap[color]}`}>{value}</div>
      {hint && <div className="text-xs text-[var(--color-ink-soft)] mt-1">{hint}</div>}
    </div>
  );
}
