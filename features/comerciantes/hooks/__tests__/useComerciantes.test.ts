import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useComerciantes } from "../useComerciantes";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";

vi.mock("@/hooks/usePaginatedQuery", () => ({
  usePaginatedQuery: vi.fn(),
}));

describe("useComerciantes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar comerciantes da query paginada", () => {
    const mockComerciantes = [{ id: "1", nome: "Comerciante 1" }];
    (usePaginatedQuery as Mock).mockReturnValue({
      items: mockComerciantes,
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useComerciantes());

    expect(result.current.comerciantes).toEqual(mockComerciantes);
    expect(usePaginatedQuery).toHaveBeenCalledWith("/api/v1/comerciantes", {
      sort: "nome,ASC",
    });
  });

  it("deve passar parâmetros adicionais para usePaginatedQuery", () => {
    (usePaginatedQuery as Mock).mockReturnValue({
      items: [],
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    renderHook(() => useComerciantes({ page: 1, size: 20 }));

    expect(usePaginatedQuery).toHaveBeenCalledWith("/api/v1/comerciantes", {
      sort: "nome,ASC",
      page: 1,
      size: 20,
    });
  });
});
