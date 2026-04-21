import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { apiClient, ApiError } from "../api-client";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("apiClient", () => {
  // Usar spyOn no global.fetch para capturar as chamadas sem tentar conectar
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("window", undefined);
    // Nota: O API_URL é capturado no carregamento do módulo,
    // então mockar process.env aqui pode não surtir efeito se o módulo já foi importado.
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
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          headers: expect.any(Headers),
        }),
      );

      const lastCallHeaders = fetchSpy.mock.calls[0][1]!.headers as Headers;
      expect(lastCallHeaders.get("Authorization")).toBe("Bearer server-token");
    });

    it("deve redirecionar para /login em caso de 401", async () => {
      const { cookies } = await import("next/headers");
      (cookies as Mock).mockResolvedValue({ get: vi.fn() });

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      } as Response);

      await expect(apiClient("/test")).rejects.toThrow(ApiError);
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("Ambiente de Cliente", () => {
    beforeEach(() => {
      vi.stubGlobal("window", { location: { href: "" } });
      vi.stubGlobal("document", { cookie: "agrofeira_token=client-token" });
    });

    it("deve recuperar o token do document.cookie", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { ok: true } }),
      } as Response);

      await apiClient("/test");

      const lastCallHeaders = fetchSpy.mock.calls[0][1]!.headers as Headers;
      expect(lastCallHeaders.get("Authorization")).toBe("Bearer client-token");
    });

    it("deve atualizar window.location.href em caso de 401", async () => {
      const mockLocation = { href: "" };
      vi.stubGlobal("window", { location: mockLocation });

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      } as Response);

      await expect(apiClient("/test")).rejects.toThrow(ApiError);
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

    it("deve lançar ApiError se apiResponse.success for false", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: false, message: "Erro de negócio" }),
      } as Response);

      await expect(apiClient("/test")).rejects.toThrow("Erro de negócio");
    });

    it("deve lidar com falha no parse do JSON", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("JSON Parse Error");
        },
      } as Response);

      await expect(apiClient("/test")).rejects.toThrow(
        "Erro ao parsear resposta da API",
      );
    });

    it("deve lançar ApiError genérico se response.ok for false e JSON falhar", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error();
        },
      } as Response);

      const promise = apiClient("/test");
      await expect(promise).rejects.toThrow("Erro 500: Internal Server Error");
    });
  });
});
