import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useRepasses } from "../useRepasses";
import { repasseService } from "@/features/repasses/api/repasses.service";

vi.mock("@/features/repasses/api/repasses.service", () => ({
  repasseService: {
    listar: vi.fn(),
  },
}));

const mockRepasses = [
  {
    id: "1",
    comerciante: { nome: "João" },
    produtoNome: "Tomate",
  },
  {
    id: "2",
    comerciante: { nome: "Maria" },
    produtoNome: "Alface",
  },
];

describe("useRepasses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar repasses ao montar", async () => {
    (repasseService.listar as Mock).mockResolvedValue({
      content: mockRepasses,
      totalElements: 2,
      totalPages: 1,
    });

    const { result } = renderHook(() => useRepasses(10));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // Aguarda o useEffect
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.repasses).toEqual(mockRepasses);
    expect(result.current.totalCount).toBe(2);
  });

  it("deve lidar com erro ao carregar repasses", async () => {
    (repasseService.listar as Mock).mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(() => useRepasses(10));

    await act(async () => {
      // Aguarda o useEffect
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.erro).toBe("Erro ao carregar lista de repasses");
  });

  it("deve filtrar repasses pelo termo de busca", async () => {
    (repasseService.listar as Mock).mockResolvedValue({
      content: mockRepasses,
      totalElements: 2,
      totalPages: 1,
    });

    const { result } = renderHook(() => useRepasses(10));

    await act(async () => {
      // Aguarda o useEffect
    });

    act(() => {
      result.current.handleSearch("João");
    });

    expect(result.current.searchTerm).toBe("João");
    expect(result.current.repasses).toHaveLength(1);
    expect(result.current.repasses[0].comerciante.nome).toBe("João");
  });

  it("deve atualizar a página e recarregar dados", async () => {
    (repasseService.listar as Mock).mockResolvedValue({
      content: mockRepasses,
      totalElements: 2,
      totalPages: 2,
    });

    const { result } = renderHook(() => useRepasses(10));

    await act(async () => {
      // Aguarda o useEffect inicial
    });

    await act(async () => {
      result.current.setCurrentPage(2);
    });

    expect(repasseService.listar).toHaveBeenCalledWith(1, 10);
  });

  it("deve permitir atualizar os dados manualmente via refresh", async () => {
    (repasseService.listar as Mock).mockResolvedValue({
      content: mockRepasses,
      totalElements: 2,
      totalPages: 1,
    });

    const { result } = renderHook(() => useRepasses(10));

    await act(async () => {
      // Aguarda o useEffect inicial
    });

    vi.clearAllMocks();
    (repasseService.listar as Mock).mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
    });

    await act(async () => {
      result.current.refresh();
    });

    expect(repasseService.listar).toHaveBeenCalled();
    expect(result.current.repasses).toEqual([]);
  });
});
