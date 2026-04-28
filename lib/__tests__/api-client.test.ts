import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { apiClient, ApiError, setClientToken } from "../api-client";
import { clearAuthCookies } from "@/features/auth/actions/auth.actions";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/features/auth/actions/auth.actions", () => ({
  clearAuthCookies: vi.fn().mockResolvedValue(undefined),
}));

describe("apiClient", () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("window", undefined);
    setClientToken(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Ambiente de Servidor", () => {
    it("deve adicionar o token do cookie no header de autorização", async () => {
      const { cookies } = await import("next/headers");
      (cookies as Mock).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: "server-token" }),
      });

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { foo: "bar" } }),
      } as Response);

      const result = await apiClient("/test");

      expect(result).toEqual({ foo: "bar" });
      const lastCallHeaders = fetchSpy.mock.calls[0][1]!.headers as Headers;
      expect(lastCallHeaders.get("Authorization")).toBe("Bearer server-token");
    });
  });

  describe("Ambiente de Cliente", () => {
    beforeEach(() => {
      vi.stubGlobal("window", { location: { href: "" } });
    });

    it("deve usar o token em memória (clientSideToken) se disponível", async () => {
      setClientToken("memoized-token");

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { ok: true } }),
      } as Response);

      await apiClient("/test");

      const lastCallHeaders = fetchSpy.mock.calls[0][1]!.headers as Headers;
      expect(lastCallHeaders.get("Authorization")).toBe(
        "Bearer memoized-token",
      );
    });

    it("deve redirecionar para /login em caso de 401 se houver token em memória", async () => {
      const mockLocation = { href: "" };
      vi.stubGlobal("window", { location: mockLocation });
      setClientToken("invalid-token");

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      } as Response);

      await expect(apiClient("/test")).rejects.toThrow(ApiError);
      expect(clearAuthCookies).toHaveBeenCalled();
      expect(mockLocation.href).toBe("/login");
    });
  });

  describe("Tratamento de Respostas", () => {
    it("deve retornar objeto vazio para status 204", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      const result = await apiClient("/test");
      expect(result).toEqual({});
    });
  });
});
