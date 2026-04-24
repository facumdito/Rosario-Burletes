import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paraná — Dashboard",
  description: "El sistema operativo digital de tu PyME.",
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
