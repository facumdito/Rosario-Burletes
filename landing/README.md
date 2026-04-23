# Paraná — Landing

Landing page de **Paraná**, el sistema operativo digital para PyMEs LATAM.

Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.

---

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build de producción

```bash
npm run build
npm run start
```

## Deploy a Vercel

```bash
# Si no tenés Vercel CLI
npm i -g vercel

# Desde el directorio landing/
vercel            # primer deploy (preview)
vercel --prod     # deploy a producción
```

El proyecto funciona sin configuración adicional. Si querés conectar el formulario de waitlist a un webhook externo (Zapier, Make, Google Sheets, Airtable, Resend, etc.), definí la env var en Vercel:

```
WAITLIST_WEBHOOK_URL=https://hooks.zapier.com/...
```

Sin esa variable, los emails quedan solo en los logs del servidor.

## Estructura

```
landing/
├── app/
│   ├── api/waitlist/route.ts   # endpoint del formulario
│   ├── globals.css             # Tailwind v4 + tokens de diseño
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx                # hero + mockup de dashboard
│   ├── Problem.tsx
│   ├── Solution.tsx            # con chat WhatsApp en vivo
│   ├── Features.tsx
│   ├── CaseStudy.tsx           # Rosario Burletes como caso 0
│   ├── Pricing.tsx
│   ├── Waitlist.tsx
│   ├── FAQ.tsx
│   └── Footer.tsx
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Secciones de la página

1. **Hero** — tagline + CTA + mockup del dashboard de Paraná.
2. **Problem** — los 6 dolores de la PyME.
3. **Solution** — 4 principios + preview del agente IA WhatsApp.
4. **Features** — 9 módulos del producto (core + verticales).
5. **Case Study** — Rosario Burletes, números reales.
6. **Pricing** — 4 tiers (Free → Business) + mención Enterprise.
7. **Waitlist** — formulario con gancho de 50% off primeras 100 PyMEs.
8. **FAQ** — 8 preguntas frecuentes.
9. **Footer**.

## Siguientes pasos sugeridos

1. Comprar dominio `parana.la` (o `parana.app` / `paranaapp.com`).
2. Conectar dominio en Vercel.
3. Configurar webhook de waitlist (Resend + Airtable recomendado).
4. Agregar Google Analytics 4 o PostHog para tracking.
5. Subir Open Graph image a `public/og.png` (1200×630).

## Meta de validación

**50 emails de PyMEs argentinas en 30 días** tras compartir en LinkedIn + cámaras de Rosario, como señal suficiente para arrancar el MVP.
