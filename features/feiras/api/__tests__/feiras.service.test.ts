import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { feiraService } from "../feiras.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client");

describe("feiraService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getResumo deve chamar o endpoint correto", async () => {
    (apiClient as Mock).mockResolvedValue({ feiraId: "1" });
    await feiraService.getResumo("123");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/feiras/123/resumo");
  });

  it("getEstoques deve chamar o endpoint correto", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await feiraService.getEstoques("123");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/estoque-bancas/feira/123");
  });

  it("getItensAgrupados deve agrupar itens corretamente a partir do estoque flat", async () => {
    const mockRawData = [
      {
        id: "o1",
        feira: {
          id: "f1",
          dataHora: "2026-04-15",
          status: "ABERTA",
          ativa: true,
        },
        comerciante: { id: "c1", nome: "Com 1" },
        produto: {
          id: "i1",
          nome: "Item 1",
          unidadeMedida: "kg",
          precoBase: 5,
        },
        quantidadeDisponivel: 10,
      },
      {
        id: "o2",
        feira: {
          id: "f1",
          dataHora: "2026-04-15",
          status: "ABERTA",
          ativa: true,
        },
        comerciante: { id: "c2", nome: "Com 2" },
        produto: {
          id: "i1",
          nome: "Item 1",
          unidadeMedida: "kg",
          precoBase: 6,
        },
        quantidadeDisponivel: 5,
      },
      {
        id: "o3",
        feira: {
          id: "f1",
          dataHora: "2026-04-15",
          status: "ABERTA",
          ativa: true,
        },
        comerciante: { id: "c1", nome: "Com 1" },
        produto: {
          id: "i2",
          nome: "Item 2",
          unidadeMedida: "un",
          precoBase: 2,
        },
        quantidadeDisponivel: 20,
      },
    ];

    (apiClient as Mock).mockResolvedValue(mockRawData);

    const result = await feiraService.getItensAgrupados("123");

    expect(apiClient).toHaveBeenCalledWith("/api/v1/estoque-bancas/feira/123");
    expect(result, "Expected 2 items: Item 1 and Item 2").toHaveLength(2);

    const item1 = result.find((r) => r.id === "i1");
    expect(item1?.comerciantes).toHaveLength(2);
    expect(item1?.comerciantes[0].nome).toBe("Com 1");
  });
});
