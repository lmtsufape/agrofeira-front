import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useComerciantes } from "../useComerciantes";
import { comercianteService } from "../../api/comerciantes.service";

vi.mock("../../api/comerciantes.service", () => ({
  comercianteService: {
    getAll: vi.fn(),
  },
}));

describe("useComerciantes", () => {
  const mockComerciantes = [
    { id: "1", nome: "Banca do João" },
    { id: "2", nome: "Feira da Maria" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar comerciantes ao montar", async () => {
    (comercianteService.getAll as Mock).mockResolvedValue(mockComerciantes);

    const { result } = renderHook(() => useComerciantes());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.comerciantes).toEqual(mockComerciantes);
    expect(result.current.error).toBe(null);
  });

  it("deve lidar com erro na busca", async () => {
    (comercianteService.getAll as Mock).mockRejectedValue(
      new Error("Erro de API"),
    );

    const { result } = renderHook(() => useComerciantes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erro de API");
    expect(result.current.comerciantes).toEqual([]);
  });

  it("deve filtrar comerciantes pelo termo de busca", async () => {
    (comercianteService.getAll as Mock).mockResolvedValue(mockComerciantes);

    const { result } = renderHook(() => useComerciantes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm("João");
    });

    expect(result.current.filteredComerciantes).toHaveLength(1);
    expect(result.current.filteredComerciantes[0].nome).toBe("Banca do João");
  });
});
