import Link from "next/link";

export const metadata = { title: "Página não encontrada · Powerful Anchor", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "160px var(--gutter) 96px", minHeight: "60vh" }}>
      <span className="tag">
        <b>404</b>
        <span>Página não encontrada</span>
      </span>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", margin: "18px 0 12px" }}>Não encontrámos esta página.</h1>
      <p style={{ maxWidth: "52ch", marginBottom: 24 }}>
        O endereço pode estar errado ou o artigo já não estar no catálogo. Veja os produtos ou fale connosco.
      </p>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/produtos" className="btn btn-primary">
          Ver produtos <span className="arrow">→</span>
        </Link>
        <Link href="/#contacto" className="btn btn-line">
          Falar connosco
        </Link>
      </p>
    </main>
  );
}
