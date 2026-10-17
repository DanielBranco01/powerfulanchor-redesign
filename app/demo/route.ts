import { NextResponse, type NextRequest } from "next/server";

/** Atalho fácil de dizer/escrever para a demonstração da área de cliente. */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/area-cliente/demo", request.nextUrl.origin));
}
