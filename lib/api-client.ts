import { ApiResponse } from "@/types/api";
import { redirect } from "next/navigation";
import { clearAuthCookies } from "@/features/auth/actions/auth.actions";

const API_URL = (() => {
  const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === "true";

  if (useProxy && typeof window !== "undefined") {
    return "/api/proxy";
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
})();

const TOKEN_COOKIE_NAME = "agrofeira_token";
const REFRESH_TOKEN_COOKIE_NAME = "agrofeira_refresh_token";

/**
 * Estado em memória do token para o cliente (evita falha por HttpOnly)
 * Nota: No servidor, esta variável é isolada por processo/instância,
 * por isso usamos getCookie como fallback seguro.
 */
let clientSideToken: string | null = null;

/**
 * Define o token a ser usado em todas as requisições do cliente.
 */
export function setClientToken(token: string | null) {
  if (typeof window !== "undefined") {
    clientSideToken = token;
  }
}

export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export interface ApiClientOptions extends RequestInit {
  authToken?: string;
}

async function getCookie(name: string): Promise<string | undefined> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(name)?.value;
    } catch {
      return undefined;
    }
  }
  // Se for httpOnly, isso retornará undefined no cliente (correto)
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(cookieName) === 0)
      return c.substring(cookieName.length, c.length);
  }
  return undefined;
}

function handleSuccessResponse<T>(responseData: unknown, endpoint: string): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData
  ) {
    const apiResponse = responseData as ApiResponse<T>;
    if (!apiResponse.success) {
      throw new ApiError(
        apiResponse.message || "Erro na operação",
        200,
        apiResponse.errors,
      );
    }
    // Fallback para array vazio se o endpoint for de lista e data for nulo
    if (apiResponse.data === null || apiResponse.data === undefined) {
      return (endpoint.endsWith("s") ? [] : {}) as T;
    }
    return apiResponse.data as T;
  }
  return (responseData ?? (endpoint.endsWith("s") ? [] : {})) as T;
}

async function handleApiError(
  response: Response,
  responseData: ApiResponse<unknown> | Record<string, unknown> | unknown,
  endpoint: string,
  options: ApiClientOptions,
): Promise<unknown> {
  const isObject = responseData && typeof responseData === "object";
  const data = isObject ? (responseData as Record<string, unknown>) : {};

  if (response.status === 401 && !endpoint.includes("/auth/")) {
    const refreshToken = await getCookie(REFRESH_TOKEN_COOKIE_NAME);

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const { token: newToken } = refreshData.data;

          // Atualiza o token em memória para futuras requisições
          setClientToken(newToken);

          return apiClient(endpoint, {
            ...options,
            authToken: newToken,
          });
        }
      } catch (err) {
        console.error("Erro no auto-refresh:", err);
      }
    }
  }

  const errorMessage =
    (data.message as string) ||
    (data.error as string) ||
    `Erro ${response.status}`;

  if (response.status === 401 && !endpoint.includes("/auth/")) {
    const hasToken =
      options.authToken ||
      clientSideToken ||
      (await getCookie(TOKEN_COOKIE_NAME));
    if (hasToken) {
      if (typeof window !== "undefined") {
        setClientToken(null);
        await clearAuthCookies();
        window.location.href = "/login";
      } else {
        clearAuthCookies();
        redirect("/login");
      }
    }
  }

  throw new ApiError(
    errorMessage,
    response.status,
    data.errors as Record<string, string[]> | undefined,
  );
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  // Prioridade: 1. Explícito | 2. Memória (Client) | 3. Cookie (Server/Client)
  const token =
    options.authToken ||
    (typeof window !== "undefined" ? clientSideToken : null) ||
    (await getCookie(TOKEN_COOKIE_NAME));

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    // Se o endpoint termina com 's', retorna array vazio, caso contrário objeto vazio
    return (endpoint.endsWith("s") ? [] : {}) as T;
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(
        `Erro ${response.status}: ${response.statusText}`,
        response.status,
      );
    }
    throw new Error("Erro ao parsear resposta da API");
  }

  if (!response.ok) {
    return handleApiError(
      response,
      responseData,
      endpoint,
      options,
    ) as Promise<T>;
  }

  return handleSuccessResponse<T>(responseData, endpoint);
}
