"use client";

import { useEffect, useState } from "react";
import { api, fmt } from "@/lib/api";

type Invoice = {
  id: number;
  number: string;
  invoice_type: string;
  issue_date: string;
  due_date: string | null;
  total: number;
  status: string;
  afip_cae: string | null;
  customer_id: number;
};

type Customer = { id: number; name: string };

type Product = { id: number; sku: string; name: string; price: number };

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const [inv, cus] = await Promise.all([
      api<Invoice[]>("/invoices"),
      api<Customer[]>("/customers?limit=500"),
    ]);
    setInvoices(inv);
    setCustomers(cus);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const customerName = (id: number) =>
    customers.find((c) => c.id === id)?.name ?? `Cliente ${id}`;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Facturas</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1">
            {invoices.length} facturas
          </p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          + Nueva factura
        </button>
      </div>

      {showForm && (
        <NewInvoiceForm
          customers={customers}
          onCreated={() => { load(); setShowForm(false); }}
        />
      )}

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-ink-soft)]">Cargando…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Emisión</th>
                <th>Vto</th>
                <th className="text-right">Total</th>
                <th>Estado</th>
                <th>CAE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--color-bg)]">
                  <td className="font-mono text-xs">{inv.number}</td>
                  <td>
                    <span className="badge badge-info">{inv.invoice_type}</span>
                  </td>
                  <td className="font-medium">{customerName(inv.customer_id)}</td>
                  <td>{fmt.date(inv.issue_date)}</td>
                  <td>{fmt.date(inv.due_date)}</td>
                  <td className="text-right font-semibold">{fmt.currency(inv.total)}</td>
                  <td>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="font-mono text-xs">{inv.afip_cae ?? "—"}</td>
                  <td>
                    {inv.status === "draft" && (
                      <button
                        className="btn-ghost btn !py-1 !px-2 text-xs"
                        onClick={async () => {
                          await api(`/invoices/${inv.id}/issue`, { method: "POST" });
                          load();
                        }}
                      >
                        Emitir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "badge-neutral",
    issued: "badge-info",
    paid: "badge-success",
    overdue: "badge-danger",
  };
  const labels: Record<string, string> = {
    draft: "Borrador",
    issued: "Emitida",
    paid: "Pagada",
    overdue: "Vencida",
  };
  return <span className={`badge ${map[status] ?? "badge-neutral"}`}>{labels[status] ?? status}</span>;
}

function NewInvoiceForm({
  customers,
  onCreated,
}: {
  customers: Customer[];
  onCreated: () => void;
}) {
  const [customerId, setCustomerId] = useState<number | "">("");
  const [type, setType] = useState("B");
  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: 0 },
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Product[]>("/products?limit=500").then(setProducts);
  }, []);

  function updateItem(idx: number, field: string, value: string | number) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  }

  function selectProduct(idx: number, productId: string) {
    const p = products.find((pr) => pr.id === Number(productId));
    if (p) {
      updateItem(idx, "description", p.name);
      updateItem(idx, "unit_price", p.price);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) return;
    setSaving(true);
    try {
      await api("/invoices", {
        method: "POST",
        body: JSON.stringify({
          customer_id: customerId,
          invoice_type: type,
          items: items.filter((i) => i.description),
        }),
      });
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const tax = type === "A" || type === "B" ? subtotal * 0.21 : 0;

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <select
          className="input"
          value={customerId}
          onChange={(e) => setCustomerId(Number(e.target.value) || "")}
          required
        >
          <option value="">Cliente…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="A">Factura A</option>
          <option value="B">Factura B</option>
          <option value="C">Factura C</option>
        </select>
      </div>

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <select
              className="input col-span-4"
              onChange={(e) => selectProduct(i, e.target.value)}
            >
              <option value="">Seleccionar producto…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} · {p.name}
                </option>
              ))}
            </select>
            <input
              className="input col-span-4"
              placeholder="Descripción"
              value={it.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              required
            />
            <input
              className="input col-span-2"
              type="number"
              placeholder="Cant."
              value={it.quantity}
              onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
            />
            <input
              className="input col-span-2"
              type="number"
              placeholder="Precio"
              value={it.unit_price}
              onChange={(e) => updateItem(i, "unit_price", Number(e.target.value))}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost btn text-xs"
          onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0 }])}
        >
          + Agregar ítem
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <div className="text-sm text-[var(--color-ink-soft)]">
          Subtotal: <strong>{fmt.currency(subtotal)}</strong> · IVA: <strong>{fmt.currency(tax)}</strong> · Total:{" "}
          <strong className="text-[var(--color-ink)] text-lg">{fmt.currency(subtotal + tax)}</strong>
        </div>
        <button className="btn" disabled={saving}>
          {saving ? "Guardando…" : "Crear borrador"}
        </button>
      </div>
    </form>
  );
}
