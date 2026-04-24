"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Customer = {
  id: number;
  name: string;
  tax_id: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
};

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load(query = "") {
    setLoading(true);
    const data = await api<Customer[]>(
      `/customers${query ? `?q=${encodeURIComponent(query)}` : ""}`
    );
    setCustomers(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1">
            {customers.length} clientes
          </p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          + Nuevo cliente
        </button>
      </div>

      {showForm && <NewCustomerForm onCreated={() => { load(q); setShowForm(false); }} />}

      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Buscar por nombre, CUIT, email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(q)}
        />
        <button className="btn-ghost btn" onClick={() => load(q)}>
          Buscar
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-ink-soft)]">Cargando…</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-ink-soft)]">Sin resultados</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>CUIT</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Ciudad</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-bg)]">
                  <td className="font-medium">{c.name}</td>
                  <td>{c.tax_id ?? "—"}</td>
                  <td>{c.email ?? "—"}</td>
                  <td>{c.whatsapp ?? "—"}</td>
                  <td>{c.city ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function NewCustomerForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [tax_id, setTaxId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/customers", {
        method: "POST",
        body: JSON.stringify({ name, tax_id, email, phone, whatsapp, city }),
      });
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card grid md:grid-cols-3 gap-3">
      <input className="input" placeholder="Nombre*" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="input" placeholder="CUIT" value={tax_id} onChange={(e) => setTaxId(e.target.value)} />
      <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input className="input" placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
      <input className="input" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
      <div className="md:col-span-3 flex justify-end">
        <button className="btn" disabled={saving}>{saving ? "Guardando…" : "Guardar cliente"}</button>
      </div>
    </form>
  );
}
