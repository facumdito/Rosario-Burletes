"use client";

import { useEffect, useState } from "react";
import { api, fmt } from "@/lib/api";

type Product = {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  material: string | null;
  hardness: number | null;
  unit: string;
  price: number;
  stock: number;
  stock_min: number;
};

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [semantic, setSemantic] = useState(false);

  async function load() {
    setLoading(true);
    if (semantic && q) {
      const data = await api<Product[]>("/products/search", {
        method: "POST",
        body: JSON.stringify({ query: q, limit: 50 }),
      });
      setProducts(data);
    } else {
      const data = await api<Product[]>(
        `/products${q ? `?q=${encodeURIComponent(q)}` : ""}`
      );
      setProducts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1">
            {products.length} SKUs
          </p>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            className="input"
            placeholder={semantic ? 'Probá "burlete 31mm caucho dureza 70"' : "Buscar por nombre o SKU…"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <button className="btn" onClick={load}>
            Buscar
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)] cursor-pointer">
          <input
            type="checkbox"
            checked={semantic}
            onChange={(e) => setSemantic(e.target.checked)}
          />
          🧠 Búsqueda semántica con IA (entiende descripciones técnicas en lenguaje natural)
        </label>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-ink-soft)]">Cargando…</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-ink-soft)]">Sin resultados</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Material</th>
                <th>Dureza</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-bg)]">
                  <td className="font-mono text-xs">{p.sku}</td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.material ?? "—"}</td>
                  <td>{p.hardness ?? "—"}</td>
                  <td className="text-right">{fmt.currency(p.price)}</td>
                  <td className="text-right">
                    <span
                      className={
                        p.stock <= p.stock_min ? "badge badge-warning" : "badge badge-neutral"
                      }
                    >
                      {fmt.number(p.stock)} {p.unit}
                    </span>
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
