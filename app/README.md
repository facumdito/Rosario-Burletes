# Paraná — App (dashboard)

Aplicación web para el uso interno de la PyME cliente. Next.js 15 (App Router) + TypeScript + Tailwind v4. Conecta con el backend FastAPI de Paraná.

## Desarrollo local

```bash
# Backend + Postgres levantado en docker-compose (ver raíz del repo)
npm install
npm run dev
# → http://localhost:3001
```

Credenciales demo (seed):

- **Email:** `admin@rosarioburletes.com`
- **Contraseña:** `parana2026`

## Variables

- `NEXT_PUBLIC_API_URL` — URL del backend (default `http://localhost:8000/api/v1`).

## Estructura

```
app/
├── app/
│   ├── page.tsx               # redirect login/dashboard
│   ├── login/page.tsx         # login + signup
│   └── dashboard/
│       ├── layout.tsx         # guard + sidebar
│       ├── page.tsx           # inicio (KPIs + chart)
│       ├── clientes/page.tsx
│       ├── productos/page.tsx # + búsqueda semántica IA
│       ├── facturas/page.tsx  # crear + emitir CAE
│       ├── whatsapp/page.tsx  # bandeja + simulador
│       └── produccion/page.tsx # 6 etapas con QR-ready
├── components/Sidebar.tsx
├── lib/api.ts                 # cliente HTTP + auth
└── ...
```

## Deploy a Vercel

```bash
npm i -g vercel
vercel --prod
```

Configurar en Vercel:
- `NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api/v1`
