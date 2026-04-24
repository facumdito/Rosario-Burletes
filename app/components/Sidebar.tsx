"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";

const items = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/dashboard/clientes", label: "Clientes", icon: "👥" },
  { href: "/dashboard/productos", label: "Productos", icon: "📦" },
  { href: "/dashboard/facturas", label: "Facturas", icon: "🧾" },
  { href: "/dashboard/whatsapp", label: "WhatsApp", icon: "💬" },
  { href: "/dashboard/produccion", label: "Producción", icon: "🏭" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="w-60 bg-[var(--color-card)] border-r border-[var(--color-border)] min-h-screen flex flex-col">
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="text-xl font-bold bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] bg-clip-text text-transparent">
          Paraná
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                  : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg)]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <button onClick={logout} className="btn-ghost btn w-full justify-center">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
