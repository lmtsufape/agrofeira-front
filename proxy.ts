import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "agrofeira_token";

// Define rotas públicas que não exigem autenticação
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

/**
 * Middleware de Proxy/Segurança (Padrão Next.js 16.2+)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  // 1. Acesso à raiz é delegado para o app/page.tsx resolver (dashboard ou login)
  if (pathname === "/") {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // 2. Usuário autenticado acessando páginas de login/esqueci senha -> vai pro dashboard
  // Usamos comparação exata para evitar capturar páginas inexistentes que comecem com nomes similares
  const isExactAuthPage = PUBLIC_ROUTES.includes(pathname);
  if (token && isExactAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Usuário NÃO autenticado acessando rotas privadas -> vai pro login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configuração de Matcher para interceptar rotas
export const config = {
  matcher: [
    /*
     * Ignora rotas de API e arquivos com extensões (estáticos, imagens, favicon, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.).*)",
  ],
};
