import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  loginUser,
  forgotPassword,
  resetPassword,
  refreshAuthToken,
  logoutUser,
} from "../auth.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loginUser", () => {
    it("deve chamar o endpoint de login com credenciais", async () => {
      const mockResponse = {
        token: "jwt-token",
        refreshToken: "refresh-uuid",
      };
      (apiClient as Mock).mockResolvedValue(mockResponse);

      const result = await loginUser({
        username: "user@test.com",
        password: "123",
      });

      expect(apiClient).toHaveBeenCalledWith("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "user@test.com", password: "123" }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("refreshAuthToken", () => {
    it("deve chamar o endpoint de refresh", async () => {
      const mockResponse = { token: "new-jwt", refreshToken: "same-refresh" };
      (apiClient as Mock).mockResolvedValue(mockResponse);

      const result = await refreshAuthToken("old-refresh");

      expect(apiClient).toHaveBeenCalledWith("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken: "old-refresh" }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("logoutUser", () => {
    it("deve chamar o endpoint de logout com token e refreshToken no body", async () => {
      (apiClient as Mock).mockResolvedValue(undefined);

      await logoutUser("jwt-token", "refresh-token");

      expect(apiClient).toHaveBeenCalledWith("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({
          token: "jwt-token",
          refreshToken: "refresh-token",
        }),
        authToken: "jwt-token",
      });
    });
  });

  describe("forgotPassword", () => {
    it("deve processar recuperação com sucesso", async () => {
      (apiClient as Mock).mockResolvedValue(undefined);

      await forgotPassword("nettojulio@hotmail.com");

      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/auth/forgot-password",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ identifier: "nettojulio@hotmail.com" }),
        }),
      );
    });
  });

  describe("resetPassword", () => {
    it("deve processar redefinição com sucesso", async () => {
      (apiClient as Mock).mockResolvedValue(undefined);

      await resetPassword("token-123", "nova-senha");

      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/auth/reset-password",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ token: "token-123", novaSenha: "nova-senha" }),
        }),
      );
    });
  });
});
