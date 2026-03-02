import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Métele un Gol al Cáncer | Campaña Preventiva Tarapacá",
  description: "Campaña preventiva para la detección del cáncer de próstata en la Región de Tarapacá, Chile. Hazte el test PSA y queda listo para el 2do Tiempo.",
  keywords: ["cáncer de próstata", "PSA", "prevención", "Tarapacá", "Iquique", "Alto Hospicio", "salud masculina", "examen preventivo"],
  authors: [{ name: "Campaña Métele un Gol al Cáncer" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='11' stroke='%2300D4FF' stroke-width='1.5' fill='%230D1117'/><path d='M12 6L8 9L8 15L12 18L16 15L16 9L12 6Z' stroke='%2300D4FF' fill='%2300D4FF' fill-opacity='0.2'/></svg>",
  },
  openGraph: {
    title: "Métele un Gol al Cáncer",
    description: "Campaña preventiva para la detección del cáncer de próstata en Tarapacá",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Métele un Gol al Cáncer",
    description: "Hazte el test PSA y salva vidas",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
