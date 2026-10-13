import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Renova a sessão da área de cliente (tokens em cookies) antes de cada página de /area-cliente.
 * Os Server Components não conseguem gravar cookies; sem isto, a sessão expiraria ao fim de uma hora.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.ERP_SUPABASE_URL;
  const key = process.env.ERP_SUPABASE_PUBLISHABLE_KEY;
  let response = NextResponse.next({ request });
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/area-cliente/:path*"],
};
