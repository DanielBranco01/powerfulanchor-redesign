import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CATEGORIES, TODAS, categoryByKey, hrefCategoria } from "@/lib/catalogue";
import { getCatalogueIndex } from "@/lib/catalogue-server";
import SvgIcon from "@/components/produtos/SvgIcon";

export const metadata: Metadata = {
  title: "Produtos · Powerful Anchor",
  description:
    "Catálogo de produtos para redes de comunicações: Redes de Dados, Armários e Servidores, Áudio e Vídeo, Cablagem e Sistemas de RF. Preços sob proposta, para clientes com acesso.",
  alternates: { canonical: "/produtos" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ProdutosPage({ searchParams }: { searchParams: SP }) {
  // ligações antigas (`/produtos?cat=…`, `/produtos?produto=…`) passam para as rotas novas
  const sp = await searchParams;
  const produto = um(sp.produto);
  const cat = um(sp.cat);
  if (produto && /^[a-z0-9-]{1,120}$/.test(produto)) redirect(`/produtos/${TODAS}/${produto}`);
  if (cat === "all") redirect(`/produtos/${TODAS}`);
  if (cat && categoryByKey(cat)) redirect(hrefCategoria(cat, { sub: um(sp.sub) }));

  const { produtos } = await getCatalogueIndex();
  const total = new Map<string, number>();
  for (const p of produtos) total.set(p.cat, (total.get(p.cat) ?? 0) + 1);

  return (
    <>
      <section className="head">
        <div className="wrap">
          <span className="eyebrow">Produtos</span>
          <h1>Explore por categoria</h1>
          <p>
            Todo o catálogo da Powerful Anchor. Os preços e a disponibilidade são dados em proposta: adicione artigos ao
            orçamento e a nossa equipa responde.
          </p>
        </div>
      </section>
      <section className="cats">
        <div className="wrap">
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.key} href={hrefCategoria(c.key)} className={`catcard ${c.cls}`}>
                <div className="cico">
                  <SvgIcon inner={c.icon} />
                </div>
                <h3>{c.key}</h3>
                <p>{c.desc}</p>
                <div className="go">
                  <span className="cnt">{total.get(c.key) ?? 0} produtos</span>
                  <span className="arrow">Ver produtos →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="allbtn">
            <Link href={`/produtos/${TODAS}`}>Ver todos os produtos →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
