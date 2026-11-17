import categoriesData from "./data/categories.json";

export type StockKey = "in" | "low" | "order";

export type Category = {
  key: string;
  slug: string;
  cls: string;
  desc: string;
  /** Inner SVG markup (paths) drawn inside a 24×24 stroked <svg>. */
  icon: string;
};

/** Full product record — summary plus technical specs (loaded per product). */
export type Product = {
  id: string;
  name: string;
  brand: string;
  cat: string;
  ref: string;
  desc: string;
  img: string | null;
  specs: [string, string][];
  subcat: string;
  stock: StockKey;
};

/** Lightweight product record — everything needed for browsing, search and the basket. */
export type ProductSummary = Omit<Product, "specs">;

/**
 * The product data itself is no longer bundled here: the catalogue is managed in the ERP and served by
 * `/api/catalogo` (index) and `/api/catalogo/<id>` (specs), refreshed hourly. See `lib/catalogue-server.ts`
 * (server, with the JSON files in `data/` as fallback). As páginas `/produtos/*` são renderizadas no servidor.
 */
export const CATEGORIES: Category[] = categoriesData;

export const DEFAULT_ICON = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>';

const CAT_ICON: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.icon]));

export const catIcon = (cat: string): string => CAT_ICON[cat] ?? DEFAULT_ICON;

export type SubcategorySummary = { name: string; count: number };

export function subcategoriesOf(products: ProductSummary[], catKey: string): SubcategorySummary[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    if (p.cat !== catKey) continue;
    counts.set(p.subcat, (counts.get(p.subcat) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
}

/* ── Rotas do catálogo (`/produtos/[categoria]/[id]`) ─────────────────────────────────────────── */

export const TODAS = "todos";
export const PAGE_SIZE = 24;

export const categoryBySlug = (slug: string): Category | undefined => CATEGORIES.find((c) => c.slug === slug);
export const categoryByKey = (key: string): Category | undefined => CATEGORIES.find((c) => c.key === key);

export const hrefCategoria = (key: string, params?: Record<string, string | undefined>): string => {
  const slug = categoryByKey(key)?.slug ?? TODAS;
  const qs = new URLSearchParams(Object.entries(params ?? {}).filter(([, v]) => v) as [string, string][]).toString();
  return `/produtos/${slug}${qs ? `?${qs}` : ""}`;
};

export const hrefProduto = (p: Pick<ProductSummary, "id" | "cat">): string =>
  `/produtos/${categoryByKey(p.cat)?.slug ?? TODAS}/${p.id}`;

export type ListFilters = { cat?: string; sub?: string; marca?: string; q?: string; ord?: string };

export function filterProducts(products: ProductSummary[], f: ListFilters): ProductSummary[] {
  const q = (f.q ?? "").trim().toLowerCase();
  const list = products.filter((p) => {
    if (f.cat && p.cat !== f.cat) return false;
    if (f.sub && p.subcat !== f.sub) return false;
    if (f.marca && p.brand !== f.marca) return false;
    if (q && !`${p.name} ${p.brand} ${p.ref} ${p.cat} ${p.subcat}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (f.ord === "nome") list.sort((a, b) => a.name.localeCompare(b.name));
  if (f.ord === "marca") list.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
  return list;
}

/** Marcas dos artigos dados, das que têm mais artigos para as que têm menos. */
export function brandsOf(products: ProductSummary[]): string[] {
  const n = new Map<string, number>();
  for (const p of products) if (p.brand) n.set(p.brand, (n.get(p.brand) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([b]) => b);
}
