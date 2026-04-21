import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useDetalhamentoComerciante } from "../useDetalhamentoComerciante";
import { feiraService } from "@/features/feiras/api/feiras.service";

vi.mock("@/features/feiras/api/feiras.service");

describe("useDetalhamentoComerciante", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar feiraService.getEstoques e retornar dados das bancas", async () => {
    const mockBancas = [{ id: "b1", comercianteNome: "Banca 1", itens: [] }];
    (feiraService.getEstoques as Mock).mockResolvedValue(mockBancas);

    const { result } = renderHook(() =>
      useDetalhamentoComerciante("valid-token", "feira-123"),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(feiraService.getEstoques).toHaveBeenCalledWith("feira-123");
    expect(result.current.bancas).toEqual(mockBancas);
  });

  it("deve retornar erro customizado em caso de falha na API", async () => {
    (feiraService.getEstoques as Mock).mockRejectedValue(
      new Error("API Error"),
    );

    const { result } = renderHook(() =>
      useDetalhamentoComerciante("valid-token", "feira-123"),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.erro).toBe(
      "Erro ao carregar os dados das bancas. Tente novamente.",
    );
  });
});
