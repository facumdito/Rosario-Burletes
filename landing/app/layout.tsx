import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paraná — El sistema operativo digital de tu PyME",
  description:
    "Paraná reemplaza WhatsApp + Excel + facturador + banco + planilla por una sola app con IA. Desde Rosario para toda LATAM.",
  openGraph: {
    title: "Paraná — El sistema operativo digital de tu PyME",
    description:
      "Facturación AFIP, cobranzas automáticas, agente IA en WhatsApp y módulos verticales. Empezá gratis.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
