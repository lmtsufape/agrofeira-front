import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useVisaoGeralFeira } from "../useVisaoGeralFeira";
import { feiraService } from "@/features/feiras/api/feiras.service";

vi.mock("@/features/feiras/api/feiras.service");

describe("useVisaoGeralFeira", () => {
  const mockDetalhes = {
    id: "1",
    dataHora: "2025-05-01T08:00:00",
    status: "FINALIZADA",
    totalPedidos: 10,
    totalComerciantes: 3,
    totalProdutos: 5,
    valorTotalPedidos: 500,
    valorTotalProdutos: 400,
    totalTaxasEntrega: 70,
    pedidosPorStatus: { ENTREGUE: 8, CANCELADO: 2 },
    totalRateado: 400,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar detalhes com sucesso", async () => {
    (feiraService.getDetalhes as Mock).mockResolvedValue(mockDetalhes);

    const { result } = renderHook(() => useVisaoGeralFeira("1"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.detalhes).toEqual(mockDetalhes);
    expect(result.current.loading).toBe(false);
  });

  it("deve tratar erro ao carregar detalhes", async () => {
    (feiraService.getDetalhes as Mock).mockRejectedValue(new Error("Fail"));

    const { result } = renderHook(() => useVisaoGeralFeira("1"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.detalhes).toBeNull();
    expect(result.current.erro).toContain(
      "Não foi possível carregar os detalhes",
    );
  });

  it("não deve buscar sem feiraId", async () => {
    const { result } = renderHook(() => useVisaoGeralFeira(null));

    await act(async () => {
      await Promise.resolve();
    });

    expect(feiraService.getDetalhes).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
