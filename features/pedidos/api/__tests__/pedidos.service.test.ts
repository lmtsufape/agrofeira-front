import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { pedidoService } from "../pedidos.service";
import { apiClient } from "@/lib/api-client";
import { type PedidoDTO } from "../types";

vi.mock("@/lib/api-client");

describe("pedidoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPedido: Partial<PedidoDTO> = {
    id: "p1",
    consumidorNome: "João Silva",
    valorTotal: 100,
  };

  const mockPage = { content: [mockPedido], totalElements: 1, totalPages: 1 };

  it("listar deve chamar o endpoint /api/v1/pedidos com paginação", async () => {
    (apiClient as Mock).mockResolvedValue(mockPage);

    const result = await pedidoService.listar(0, 10);

    expect(apiClient).toHaveBeenCalledWith(
      "/api/v1/pedidos?page=0&size=10&sort=criadoEm,desc",
    );
    expect(result).toEqual(mockPage);
  });

  it("buscarPorId deve chamar o endpoint com o ID correto", async () => {
    (apiClient as Mock).mockResolvedValue(mockPedido);

    const result = await pedidoService.buscarPorId("123");

    expect(apiClient).toHaveBeenCalledWith("/api/v1/pedidos/123");
    expect(result).toEqual(mockPedido);
  });

  it("listarPorFeira deve chamar o endpoint da feira", async () => {
    (apiClient as Mock).mockResolvedValue([mockPedido]);

    const result = await pedidoService.listarPorFeira("feira-abc");

    expect(apiClient).toHaveBeenCalledWith("/api/v1/pedidos/feira/feira-abc");
    expect(result).toEqual([mockPedido]);
  });

  it("deve propagar erros vindos do apiClient", async () => {
    const apiError = new Error("Network Error");
    (apiClient as Mock).mockRejectedValue(apiError);

    await expect(pedidoService.listar()).rejects.toThrow("Network Error");
  });
});
