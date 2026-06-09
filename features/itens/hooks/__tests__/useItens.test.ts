import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useItens } from "../useItens";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";

vi.mock("@/hooks/usePaginatedQuery", () => ({
  usePaginatedQuery: vi.fn(),
}));

describe("useItens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar itens da query paginada", () => {
    const mockItens = [{ id: "1", nome: "Item 1" }];
    (usePaginatedQuery as Mock).mockReturnValue({
      items: mockItens,
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useItens());

    expect(result.current.itens).toEqual(mockItens);
    expect(usePaginatedQuery).toHaveBeenCalledWith("/api/v1/itens", {
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

    renderHook(() => useItens({ page: 2, size: 50 }));

    expect(usePaginatedQuery).toHaveBeenCalledWith("/api/v1/itens", {
      sort: "nome,ASC",
      page: 2,
      size: 50,
    });
  });
});
