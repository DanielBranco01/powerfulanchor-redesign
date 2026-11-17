import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TODAS, categoryByKey, categoryBySlug, hrefCategoria, hrefProduto } from "@/lib/catalogue";
import { getCatalogueIndex, getCatalogueProduct } from "@/lib/catalogue-server";
import ProductCard from "@/components/produtos/ProductCard";
import ProductImage from "@/components/produtos/ProductImage";
import AddToQuote from "@/components/produtos/AddToQuote";
import QuoteForm from "@/components/produtos/QuoteForm";

type Props = { params: Promise<{ categoria: string; id: string }> };
const ID = /^[a-z0-9-]{1,120}$/;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!ID.test(id)) return {};
  const p = await getCatalogueProduct(id);
  if (!p) return {};
  return {
    title: `${p.name} (${p.ref}) · ${p.brand} · Powerful Anchor`,
    description: `${p.name}, ref. ${p.ref}, ${p.brand}. Peça proposta com preço e disponibilidade.`,
    alternates: { canonical: hrefProduto(p) },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { categoria, id } = await params;
  if (!ID.test(id)) notFound();
  const p = await getCatalogueProduct(id);
  if (!p) notFound();

  // um só endereço por artigo: `/produtos/todos/<id>` e categorias trocadas passam para o canónico
  const cat = categoryByKey(p.cat);
  if (cat ? categoryBySlug(categoria)?.slug !== cat.slug : categoria !== TODAS) redirect(hrefProduto(p));

  const { produtos } = await getCatalogueIndex();
  const related = produtos.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const highlights = p.specs.slice(0, 3);

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/produtos">Produtos</Link>
            <span className="sep">/</span>
            <Link href={hrefCategoria(p.cat)}>{p.cat}</Link>
            <span className="sep">/</span>
            <span className="cur">{p.name}</span>
          </div>
        </div>
      </section>

      <section className="detail">
        <div className="wrap">
          <div className="detail-top">
            <div className="detail-media">
              <ProductImage img={p.img} cat={p.cat} name={p.name} big />
            </div>
            <div className="detail-info">
              <span className="dbrand">{p.brand}</span>
              <div className="dcat">{p.cat}</div>
              {p.subcat && <div className="dsubcat">{p.subcat}</div>}
              <h1>{p.name}</h1>
              <div className="dref">Referência: {p.ref}</div>
              <div className="dstock">
                <span className="stock s-order">
                  <span className="dot" />
                  Preço e disponibilidade sob consulta
                </span>
              </div>
              <p className="ddesc">{p.desc}</p>
              {highlights.length > 0 && (
                <div className="hl">
                  {highlights.map(([k, v]) => (
                    <div className="hchip" key={k}>
                      <span className="hk">{k}</span>
                      <span className="hv">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="dactions">
                <AddToQuote product={p} />
                <Link href={hrefCategoria(p.cat)} className="btn-ghost">
                  Ver mais em {p.cat}
                </Link>
              </div>
              <a className="linklike" href="#pedir">
                ou peça já só este produto ↓
              </a>
            </div>
          </div>

          <div className="specs">
            <h2>Especificações técnicas</h2>
            <div className="subtle">
              Ref. {p.ref} · {p.brand}
            </div>
            <table className="spec-table">
              <tbody>
                {p.specs.length === 0 ? (
                  <tr>
                    <td className="k">Especificações</td>
                    <td className="v">Sem dados técnicos detalhados para este artigo.</td>
                  </tr>
                ) : (
                  p.specs.map(([k, v]) => (
                    <tr key={k}>
                      <td className="k">{k}</td>
                      <td className="v">{v}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="quote-sec" id="pedir">
            <h2>Pedir proposta deste produto</h2>
            <div className="subtle">
              Enviamos preço e disponibilidade para <b>{p.name}</b> na sua área de cliente.
            </div>
            <QuoteForm mode="single" product={p} />
          </div>

          {related.length > 0 && (
            <div className="related">
              <h2>Produtos relacionados</h2>
              <div className="rel-grid">
                {related.map((r) => (
                  <ProductCard key={r.id} product={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
