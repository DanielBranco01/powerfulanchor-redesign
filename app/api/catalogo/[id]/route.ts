import { NextResponse } from "next/server";
import { getCatalogueProduct } from "@/lib/catalogue-server";

const ID = /^[a-z0-9-]{1,120}$/;

/** Ficha de um artigo (com as características técnicas), pedida quando se abre o detalhe no catálogo. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID.test(id)) return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  const produto = await getCatalogueProduct(id);
  if (!produto) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  return NextResponse.json(produto, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
