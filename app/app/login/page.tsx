"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("admin@rosarioburletes.com");
  const [password, setPassword] = useState("parana2026");
  const [fullName, setFullName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<{ access_token: string }>(
        mode === "login" ? "/auth/login" : "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify(
            mode === "login"
              ? { email, password }
              : { email, password, full_name: fullName, tenant_name: tenantName }
          ),
        }
      );
      setToken(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] bg-clip-text text-transparent">
            Paraná
          </div>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1">
            El sistema operativo digital de tu PyME
          </p>
        </div>

        <div className="flex gap-2 mb-5 p-1 bg-[var(--color-bg)] rounded-lg">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "login" ? "bg-white shadow" : "text-[var(--color-ink-soft)]"
            }`}
          >
            Ingresar
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "signup" ? "bg-white shadow" : "text-[var(--color-ink-soft)]"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div>
                <label className="text-xs font-medium text-[var(--color-ink-soft)]">
                  Tu nombre
                </label>
                <input
                  className="input mt-1"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-ink-soft)]">
                  Nombre de la empresa
                </label>
                <input
                  className="input mt-1"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)]">
              Email
            </label>
            <input
              type="email"
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)]">
              Contraseña
            </label>
            <input
              type="password"
              className="input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <button type="submit" className="btn w-full justify-center" disabled={loading}>
            {loading
              ? "Cargando…"
              : mode === "login"
              ? "Ingresar"
              : "Crear cuenta gratis"}
          </button>
        </form>

        {mode === "login" && (
          <p className="text-xs text-center text-[var(--color-ink-soft)] mt-4">
            Demo: <code>admin@rosarioburletes.com</code> / <code>parana2026</code>
          </p>
        )}
      </div>
    </main>
  );
}
