import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import BasketProvider from "@/components/BasketProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

// Archivo carries a width axis: body text at 100, display headlines pushed to
// 125 (expanded) to echo the heavy, wide wordmark of the logo.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Powerful Anchor — Soluções para redes de comunicações",
  description:
    "Distribuição e comercialização de produtos para redes de comunicações: Redes de Dados, Áudio e Vídeo e Sistemas de RF. Dê POWER ao seu negócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <BasketProvider>
          <Nav />
          {children}
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
