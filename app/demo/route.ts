import { NextResponse } from "next/server";

/**
 * Atalho fácil de dizer/escrever para a demonstração da área de cliente.
 * Location relativo: no Netlify, request.nextUrl.origin é o endereço interno do deploy, não o domínio público.
 */
export function GET() {
  return new NextResponse(null, { status: 307, headers: { Location: "/area-cliente/demo" } });
}
