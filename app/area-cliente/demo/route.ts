import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE } from "@/lib/portal-demo";

/**
 * Entrada direta na demonstração da área de cliente (empresa e valores fictícios, sem login e sem ERP).
 * Atalho curto: /demo. Sai-se com o botão "Sair" (apaga o cookie) ou ao fim de 8 horas.
 */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/area-cliente", request.nextUrl.origin));
  response.cookies.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
