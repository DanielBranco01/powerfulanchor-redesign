import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PAGE_SIZE,
  TODAS,
  brandsOf,
  categoryBySlug,
  filterProducts,
  hrefCategoria,
  subcategoriesOf,
} from "@/lib/catalogue";
import { getCatalogueIndex, searchCatalogue } from "@/lib/catalogue-server";
import ProductCard from "@/components/produtos/ProductCard";

type Props = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const cat = categoryBySlug(categoria);
  if (!cat && categoria !== TODAS) return {};
  const nome = cat ? cat.key : "Todos os produtos";
  return {
    title: `${nome} · Produtos · Powerful Anchor`,
    description: cat?.desc ?? "Toda a gama de produtos da Powerful Anchor. Preços e disponibilidade em proposta.",
    alternates: { canonical: `/produtos/${categoria}` },
  };
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { categoria } = await params;
  const cat = categoryBySlug(categoria);
  if (!cat && categoria !== TODAS) notFound();

  const sp = await searchParams;
  const sub = um(sp.sub);
  const marca = um(sp.marca);
  const q = um(sp.q)?.slice(0, 80);
  const ord = um(sp.ord);
  const pagina = Math.max(1, Number(um(sp.pag)) || 1);

  const { produtos } = await getCatalogueIndex();
  const daCategoria = cat ? produtos.filter((p) => p.cat === cat.key) : produtos;
  const subs = cat ? subcategoriesOf(produtos, cat.key) : [];
  const marcas = brandsOf(daCategoria);
  // com texto: pesquisa inteligente do ERP (relevância); se não responder, a pesquisa simples sobre o índice
  const acertos = q ? await searchCatalogue(q) : null;
  const lista = acertos
    ? filterProducts(acertos, { cat: cat?.key, sub, marca, ord })
    : filterProducts(daCategoria, { sub, marca, q, ord });
  const paginas = Math.max(1, Math.ceil(lista.length / PAGE_SIZE));
  const atual = Math.min(pagina, paginas);
  const visiveis = lista.slice((atual - 1) * PAGE_SIZE, atual * PAGE_SIZE);

  const ligacao = (extra: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const todos = { sub, marca, q, ord, ...extra };
    for (const [k, v] of Object.entries(todos)) if (v) p.set(k, v);
    const qs = p.toString();
    return `/produtos/${categoria}${qs ? `?${qs}` : ""}`;
  };
  const filtrado = !!(sub || marca || q);

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/produtos">Produtos</Link>
            <span className="sep">/</span>
            {cat && sub ? <Link href={hrefCategoria(cat.key)}>{cat.key}</Link> : <span className="cur">{cat ? cat.key : "Todos"}</span>}
            {cat && sub && (
              <>
                <span className="sep">/</span>
                <span className="cur">{sub}</span>
              </>
            )}
          </div>
          <div className="head-row">
            <div className="head-text">
              <h1>{sub ?? (cat ? cat.key : "Todos os produtos")}</h1>
              <p>{cat ? cat.desc : "Toda a gama de produtos. Preços e disponibilidade em proposta."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-body">
        <div className="wrap">
          {subs.length > 1 && (
            <nav className="subchips" aria-label="Tipos de produto">
              <Link href={ligacao({ sub: undefined, pag: undefined })} className={`chip${!sub ? " active" : ""}`}>
                Todos
              </Link>
              {subs.map((s) => (
                <Link key={s.name} href={ligacao({ sub: s.name, pag: undefined })} className={`chip${sub === s.name ? " active" : ""}`}>
                  {s.name} <small>{s.count}</small>
                </Link>
              ))}
            </nav>
          )}

          <form method="get" className="fbar" action={`/produtos/${categoria}`}>
            {sub && <input type="hidden" name="sub" value={sub} />}
            <input type="search" name="q" defaultValue={q ?? ""} placeholder="Pesquisar por nome, referência ou marca…" aria-label="Pesquisar" />
            <select name="marca" defaultValue={marca ?? ""} aria-label="Marca">
              <option value="">Todas as marcas</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select name="ord" defaultValue={ord ?? ""} aria-label="Ordenar">
              <option value="">Ordenar por</option>
              <option value="nome">Nome (A–Z)</option>
              <option value="marca">Marca</option>
            </select>
            <button type="submit" className="btn-primary">
              Filtrar
            </button>
            {filtrado && (
              <Link href={`/produtos/${categoria}`} className="clear">
                Limpar
              </Link>
            )}
          </form>

          <p className="count">
            <b>{lista.length}</b> produto{lista.length === 1 ? "" : "s"}
          </p>

          <div className="grid">
            {visiveis.length === 0 ? (
              <div className="empty">
                <h3>Sem resultados</h3>
                <p>Tente ajustar a pesquisa ou os filtros.</p>
              </div>
            ) : (
              visiveis.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>

          {paginas > 1 && (
            <nav className="pager" aria-label="Páginas">
              {atual > 1 ? <Link href={ligacao({ pag: String(atual - 1) })}>← Anterior</Link> : <span />}
              <span>
                Página {atual} de {paginas}
              </span>
              {atual < paginas ? <Link href={ligacao({ pag: String(atual + 1) })}>Seguinte →</Link> : <span />}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
