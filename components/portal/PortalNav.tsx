"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/area-cliente", label: "Resumo", n: "00" },
  { href: "/area-cliente/pedidos", label: "Pedidos", n: "01" },
  { href: "/area-cliente/propostas", label: "Propostas", n: "02" },
  { href: "/area-cliente/encomendas", label: "Encomendas", n: "03" },
  { href: "/area-cliente/pagamentos", label: "Pagamentos", n: "04" },
];

export default function PortalNav() {
  const path = usePathname() ?? "";
  return (
    <nav className="pt-tabs" aria-label="Área de cliente">
      {TABS.map((t) => {
        const active = t.href === "/area-cliente" ? path === t.href : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
            <span className="pt-tab-n">{t.n}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
