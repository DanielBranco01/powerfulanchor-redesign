import type { Metadata } from "next";
import "./portal.css";

export const metadata: Metadata = {
  title: { default: "Área de cliente · Powerful Anchor", template: "%s · Área de cliente · Powerful Anchor" },
  robots: { index: false, follow: false },
};

// Sempre por pedido: cada página depende da sessão (cookies) e dos dados atuais do ERP.
export const dynamic = "force-dynamic";

export default function AreaClienteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
