import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useRateioFeira } from "../useRateioFeira";
import { feiraService } from "@/features/feiras/api/feiras.service";

vi.mock("@/features/feiras/api/feiras.service");

describe("useRateioFeira", () => {
  const mockFeiraId = "f1";
  const mockRateio = {
    totalRateado: 100,
    comerciantes: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar dados de rateio com sucesso", async () => {
    (feiraService.getRateio as Mock).mockResolvedValue(mockRateio);

    const { result } = renderHook(() => useRateioFeira(mockFeiraId));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.rateio).toEqual(mockRateio);
    expect(feiraService.getRateio).toHaveBeenCalledWith(mockFeiraId);
  });

  it("deve tratar erro ao carregar rateio", async () => {
    (feiraService.getRateio as Mock).mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(() => useRateioFeira(mockFeiraId));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.erro).toBe(
      "Não foi possível carregar o rateio da feira.",
    );
  });

  it("não deve buscar sem feiraId", async () => {
    const { result } = renderHook(() => useRateioFeira(null));

    expect(result.current.loading).toBe(false);
    expect(feiraService.getRateio).not.toHaveBeenCalled();
  });
});
