"use server";

import { cookies } from "next/headers";

const TOKEN_KEY = "agrofeira_token";
const REFRESH_TOKEN_KEY = "agrofeira_refresh_token";
const USERNAME_KEY = "agrofeira_username";

/**
 * Define cookies de autenticação no lado do servidor com flags de segurança.
 */
export async function setAuthCookies(
  token: string,
  refreshToken: string,
  username: string,
) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  };

  cookieStore.set(TOKEN_KEY, token, options);
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, options);
  cookieStore.set(USERNAME_KEY, username, { ...options, httpOnly: false }); // Username pode ser lido no cliente para UI
}

/**
 * Remove todos os cookies de autenticação.
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(USERNAME_KEY);
}

/**
 * Recupera os cookies de autenticação (usado para hidratação inicial).
 */
export async function getAuthData() {
  const cookieStore = await cookies();
  return {
    token: cookieStore.get(TOKEN_KEY)?.value || null,
    refreshToken: cookieStore.get(REFRESH_TOKEN_KEY)?.value || null,
    username: cookieStore.get(USERNAME_KEY)?.value || null,
  };
}
