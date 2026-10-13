/**
 * Catálogo a partir do ERP (só no servidor).
 * Fonte: funções públicas do ERP `catalogo_indice` (lista, sem características) e `catalogo_artigo` (ficha).
 * Cada pedido ao ERP fica em cache durante uma hora; se o ERP falhar ou não estiver configurado, usa os
 * ficheiros JSON em `lib/data/` (a cópia gerada por `scripts/sync-catalogue.mjs`).
 */
import fallbackIndex from "./data/products-index.json";
import { CATEGORIES, type Product, type ProductSummary } from "./catalogue";

const URL = process.env.ERP_SUPABASE_URL;
const KEY = process.env.ERP_SUPABASE_PUBLISHABLE_KEY;
export const REVALIDAR_S = 3600;

type Fonte = "erp" | "reserva";

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY!, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    next: { revalidate: REVALIDAR_S, tags: ["catalogo"] },
  });
  if (!res.ok) throw new Error(`${fn} falhou (${res.status})`);
  return (await res.json()) as T;
}

export async function getCatalogueIndex(): Promise<{ produtos: ProductSummary[]; fonte: Fonte }> {
  if (URL && KEY) {
    try {
      const produtos: ProductSummary[] = [];
      for (let off = 0; ; off += 1000) {
        const pagina = await rpc<ProductSummary[]>("catalogo_indice", { p_limit: 1000, p_offset: off });
        produtos.push(...pagina);
        if (pagina.length < 1000) break;
      }
      // um catálogo vazio ou quase vazio quase de certeza é um erro do lado do ERP: não esvazia o site
      if (produtos.length > 100) return { produtos: produtos.map((p) => ({ ...p, desc: p.desc ?? "", subcat: p.subcat ?? "" })), fonte: "erp" };
      console.error(`[catalogo] o ERP devolveu só ${produtos.length} artigos; a usar a cópia local.`);
    } catch (e) {
      console.error("[catalogo] ERP indisponível; a usar a cópia local.", e);
    }
  }
  return { produtos: fallbackIndex as ProductSummary[], fonte: "reserva" };
}

const SLUG_DA_CATEGORIA = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.slug]));

async function specsDeReserva(id: string): Promise<[string, string][]> {
  const p = (fallbackIndex as ProductSummary[]).find((x) => x.id === id);
  const slug = p && SLUG_DA_CATEGORIA[p.cat];
  if (!slug) return [];
  const mod = (await import(`./data/specs/${slug}.json`)) as { default: Record<string, [string, string][]> };
  return mod.default[id] ?? [];
}

/** Ficha de um artigo com as características técnicas. `null` se não existir (ou estiver oculto). */
export async function getCatalogueProduct(id: string): Promise<Product | null> {
  if (URL && KEY) {
    try {
      const [p] = await rpc<Product[]>("catalogo_artigo", { p_id: id });
      if (!p) return null;
      return { ...p, desc: p.desc ?? "", subcat: p.subcat ?? "", specs: Array.isArray(p.specs) ? p.specs : [] };
    } catch (e) {
      console.error("[catalogo] ficha indisponível no ERP; a usar a cópia local.", e);
    }
  }
  const resumo = (fallbackIndex as ProductSummary[]).find((x) => x.id === id);
  return resumo ? { ...resumo, specs: await specsDeReserva(id) } : null;
}
