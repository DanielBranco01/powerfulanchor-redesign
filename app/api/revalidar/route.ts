import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Atualização imediata do catálogo (em vez de esperar 1 hora): o ERP chama este endereço depois de guardar ou apagar
 * um artigo. Protegido por um segredo partilhado (REVALIDATE_SECRET, igual nos dois sítios); sem ele, desligado.
 */
export async function POST(request: Request) {
  const segredo = process.env.REVALIDATE_SECRET;
  if (!segredo) return NextResponse.json({ erro: "Desligado." }, { status: 404 });
  if (request.headers.get("x-revalidate-secret") !== segredo) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  revalidateTag("catalogo");
  revalidatePath("/produtos", "layout");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true });
}
