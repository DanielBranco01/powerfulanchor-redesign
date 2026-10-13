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
 * `/api/catalogo` (index) and `/api/catalogo/<id>` (specs), refreshed hourly. See `lib/catalogue-store.ts`
 * (browser) and `lib/catalogue-server.ts` (server, with the JSON files in `data/` as fallback).
 */
export const CATEGORIES: Category[] = categoriesData;

export const STOCK_META: Record<StockKey, { label: string; cls: string }> = {
  in: { label: "Em stock", cls: "s-in" },
  low: { label: "Stock reduzido", cls: "s-low" },
  order: { label: "Sob encomenda", cls: "s-order" },
};

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
