import { apiClient } from "@/lib/api-client";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiClient("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function forgotPassword(identifier: string): Promise<void> {
  return apiClient("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function resetPassword(
  token: string,
  novaSenha: string,
): Promise<void> {
  return apiClient("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, novaSenha }),
  });
}

export async function refreshAuthToken(
  refreshToken: string,
): Promise<RefreshResponse> {
  return apiClient("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutUser(
  token: string,
  refreshToken: string,
): Promise<void> {
  return apiClient("/api/v1/auth/logout", {
    method: "POST",
    // Informa o token no body conforme exigência da API
    body: JSON.stringify({ token, refreshToken }),
    // Também informa o token explicitamente para o cabeçalho Authorization
    authToken: token,
  });
}
