import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "agrofeira_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

  const isRootPath = pathname === "/";

  // Se o usuário está na raiz "/", decide para onde ir baseado no token
  if (isRootPath) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se o usuário está autenticado e tenta acessar login/forgot-password, manda pro dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se o usuário NÃO está autenticado e tenta acessar o dashboard ou rotas protegidas
  if (!token && !isAuthPage) {
    // Permite acesso apenas a arquivos estáticos e manifestos
    const isPublicStatic =
      pathname.startsWith("/_next") ||
      pathname.includes(".") ||
      pathname === "/manifest.webmanifest";

    if (!isPublicStatic) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configuração dos paths que o proxy deve interceptar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
