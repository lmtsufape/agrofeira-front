import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

  if (response.status === 401 && globalThis.window !== undefined) {
    globalThis.window.location.href = "/login";
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
        200, // Status ok, but application level error
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
  const isBrowser = globalThis.window !== undefined;
  const token = isBrowser ? localStorage.getItem("ecofeira_token") : null;
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
