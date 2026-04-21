import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useDetalhamentoItem } from "../useDetalhamentoItem";
import { feiraService } from "@/features/feiras/api/feiras.service";

vi.mock("@/features/feiras/api/feiras.service");

describe("useDetalhamentoItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar feiraService.getItensAgrupados e retornar dados dos itens", async () => {
    const mockItens = [{ id: "i1", nome: "Item 1", comerciantes: [] }];
    (feiraService.getItensAgrupados as Mock).mockResolvedValue(mockItens);

    const { result } = renderHook(() =>
      useDetalhamentoItem("valid-token", "feira-123"),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(feiraService.getItensAgrupados).toHaveBeenCalledWith("feira-123");
    expect(result.current.itens).toEqual(mockItens);
  });

  it("deve retornar erro customizado em caso de falha na API", async () => {
    (feiraService.getItensAgrupados as Mock).mockRejectedValue(
      new Error("API Error"),
    );

    const { result } = renderHook(() =>
      useDetalhamentoItem("valid-token", "feira-123"),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.erro).toBe(
      "Erro ao carregar os dados dos itens. Tente novamente.",
    );
  });
});
