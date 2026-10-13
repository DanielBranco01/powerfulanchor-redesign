import { NextResponse, type NextRequest } from "next/server";
import { portalClient } from "@/lib/portal";

/**
 * Destino do link de entrada enviado por email. O Supabase valida o link e reencaminha para aqui com ?code=
 * (fluxo PKCE: o link tem de ser aberto no mesmo navegador onde se pediu a entrada) ou com ?token_hash=&type=
 * (se o modelo do email for personalizado). Confirma que o email tem acesso a um cliente antes de entrar.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const entrar = (erro: string) => NextResponse.redirect(new URL(`/area-cliente/entrar?erro=${erro}`, url.origin));
  const nextParam = url.searchParams.get("next") ?? "";
  const next = /^\/area-cliente(\/[\w\-/]*)?$/.test(nextParam) ? nextParam : "/area-cliente";

  if (url.searchParams.get("error")) return entrar("link");

  const supabase = await portalClient();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" })
      : { error: new Error("sem código") };
  if (error) return entrar("link");

  const { data: sessao } = await supabase.rpc("portal_sessao");
  if (!sessao) {
    await supabase.auth.signOut();
    return entrar("sem-acesso");
  }
  await supabase.rpc("portal_registar_entrada");
  return NextResponse.redirect(new URL(next, url.origin));
}
