import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kataplum · Tu día de aventura empieza aquí",
  description:
    "Parque de diversiones con 4 zonas temáticas, más de 40 atracciones, Mundo Acuático y shows en vivo. Compra tu boleto de 1 día o tu Pase Anual aquí mismo.",
  keywords: ["parque de diversiones", "Kataplum", "boletos", "pase anual", "atracciones"],
};

export const viewport: Viewport = {
  themeColor: "#5d2260",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="font-body bg-nube text-tinta antialiased">{children}</body>
    </html>
  );
}
