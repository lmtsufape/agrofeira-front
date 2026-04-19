import { ApiResponse } from "@/types/api";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const TOKEN_COOKIE_NAME = "agrofeira_token";

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

/**
 * Recupera o token de forma universal (Server/Client)
 */
async function getToken(): Promise<string | undefined> {
  // Ambiente de Servidor (RSC, Server Actions, Route Handlers)
  if (typeof window === "undefined") {
    try {
      // Import dinâmico para evitar que o bundle do cliente tente carregar next/headers
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    } catch {
      return undefined;
    }
  }

  // Ambiente de Cliente
  const name = `${TOKEN_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

function handleApiError(
  response: Response,
  responseData: ApiResponse<unknown> | Record<string, unknown> | unknown,
): never {
  const isObject = responseData && typeof responseData === "object";
  const data = isObject ? (responseData as Record<string, unknown>) : {};

  const errorMessage =
    (data.message as string) ||
    (data.error as string) ||
    `Erro ${response.status}`;

  // Redirecionamento 401 polimórfico
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      redirect("/login");
    }
  }

  throw new ApiError(
    errorMessage,
    response.status,
    data.errors as Record<string, string[]> | undefined,
  );
}

function handleSuccessResponse<T>(responseData: unknown): T {
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
    return apiResponse.data as T;
  }

  return responseData as T;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
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
    return {} as T;
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
    handleApiError(response, responseData);
  }

  return handleSuccessResponse<T>(responseData);
}
