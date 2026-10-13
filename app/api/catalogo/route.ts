import { NextResponse } from "next/server";
import { getCatalogueIndex } from "@/lib/catalogue-server";

// Gerado no servidor e guardado em cache durante uma hora (ISR): as alterações no ERP chegam ao site sem deploy.
export const revalidate = 3600;

export async function GET() {
  const { produtos, fonte } = await getCatalogueIndex();
  return NextResponse.json(produtos, { headers: { "X-Catalogo-Fonte": fonte } });
}
