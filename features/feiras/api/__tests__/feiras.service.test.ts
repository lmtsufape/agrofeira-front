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
    expect(apiClient).toHaveBeenCalledWith("/api/feiras/123/resumo");
  });

  it("getEstoques deve chamar o endpoint correto", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await feiraService.getEstoques("123");
    expect(apiClient).toHaveBeenCalledWith("/api/feiras/123/estoques");
  });

  it("getItensAgrupados deve agrupar itens corretamente a partir do estoque flat", async () => {
    const mockRawData = [
      {
        itemId: "i1",
        itemNome: "Item 1",
        comercianteId: "c1",
        comercianteNome: "Com 1",
        quantidadeDisponivel: 10,
        precoBase: 5,
      },
      {
        itemId: "i1",
        itemNome: "Item 1",
        comercianteId: "c2",
        comercianteNome: "Com 2",
        quantidadeDisponivel: 5,
        precoBase: 6,
      },
      {
        itemId: "i2",
        itemNome: "Item 2",
        comercianteId: "c1",
        comercianteNome: "Com 1",
        quantidadeDisponivel: 20,
        precoBase: 2,
      },
    ];

    (apiClient as Mock).mockResolvedValue(mockRawData);

    const result = await feiraService.getItensAgrupados("123");

    expect(apiClient).toHaveBeenCalledWith("/api/estoque-banca?feiraId=123");
    expect(result, "Expected 2 items: Item 1 and Item 2").toHaveLength(2);

    const item1 = result.find((r) => r.id === "i1");
    expect(item1?.comerciantes).toHaveLength(2);
    expect(item1?.comerciantes[0].nome).toBe("Com 1");
  });
});
