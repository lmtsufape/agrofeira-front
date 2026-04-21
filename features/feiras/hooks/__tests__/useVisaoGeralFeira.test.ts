import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useVisaoGeralFeira } from "../useVisaoGeralFeira";
import { feiraService } from "@/features/feiras/api/feiras.service";

vi.mock("@/features/feiras/api/feiras.service");

describe("useVisaoGeralFeira", () => {
  const mockResumo = {
    feiraId: "1",
    items: [],
    comerciantes: [],
    clientes: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar resumo com sucesso", async () => {
    (feiraService.getResumo as Mock).mockResolvedValue(mockResumo);

    const { result } = renderHook(() => useVisaoGeralFeira("token", "123"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.resumo).toEqual(mockResumo);
    expect(result.current.loading).toBe(false);
  });

  it("deve tratar erro carregando mock local de fallback", async () => {
    (feiraService.getResumo as Mock).mockRejectedValue(new Error("Fail"));

    const { result } = renderHook(() => useVisaoGeralFeira("token", "123"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.resumo).toBeDefined(); // Fallback MOCK_RESUMO
    expect(result.current.erro).toContain("Não foi possível carregar o resumo");
  });
});
