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
    clienteNome: "João Silva",
    valorTotal: 100,
  };

  it("listar deve chamar o endpoint /api/pedidos", async () => {
    (apiClient as Mock).mockResolvedValue([mockPedido]);

    const result = await pedidoService.listar();

    expect(apiClient).toHaveBeenCalledWith("/api/pedidos");
    expect(result).toEqual([mockPedido]);
  });

  it("buscarPorId deve chamar o endpoint com o ID correto", async () => {
    (apiClient as Mock).mockResolvedValue(mockPedido);

    const result = await pedidoService.buscarPorId("123");

    expect(apiClient).toHaveBeenCalledWith("/api/pedidos/123");
    expect(result).toEqual(mockPedido);
  });

  it("listarPorFeira deve chamar o endpoint com query param feiraId", async () => {
    (apiClient as Mock).mockResolvedValue([mockPedido]);

    const result = await pedidoService.listarPorFeira("feira-abc");

    expect(apiClient).toHaveBeenCalledWith("/api/pedidos?feiraId=feira-abc");
    expect(result).toEqual([mockPedido]);
  });

  it("deve propagar erros vindos do apiClient", async () => {
    const apiError = new Error("Network Error");
    (apiClient as Mock).mockRejectedValue(apiError);

    await expect(pedidoService.listar()).rejects.toThrow("Network Error");
  });
});
