import type { MetadataRoute } from "next";
import { CATEGORIES, TODAS, hrefProduto } from "@/lib/catalogue";
import { getCatalogueIndex } from "@/lib/catalogue-server";
import { SITE_URL } from "@/lib/site";

// O catálogo vem do ERP (cache de 1 hora): o mapa do site acompanha-o.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { produtos } = await getCatalogueIndex();
  const fixas = ["", "/produtos", `/produtos/${TODAS}`, ...CATEGORIES.map((c) => `/produtos/${c.slug}`), "/privacidade", "/termos"];
  return [
    ...fixas.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...produtos.map((p) => ({ url: `${SITE_URL}${hrefProduto(p)}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
