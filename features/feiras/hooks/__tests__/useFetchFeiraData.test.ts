import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFetchFeiraData } from "../useFetchFeiraData";

describe("useFetchFeiraData", () => {
  const mockFetchFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar dados com sucesso", async () => {
    const mockData = [{ id: "1", val: "A" }];
    mockFetchFn.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useFetchFeiraData("token", "feira-1", mockFetchFn),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.erro).toBe(null);
  });

  it("deve tratar erro na busca de dados", async () => {
    mockFetchFn.mockRejectedValue(new Error("Erro de rede"));

    const { result } = renderHook(() =>
      useFetchFeiraData(
        "token",
        "feira-1",
        mockFetchFn,
        "Mensagem customizada",
      ),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.erro).toBe("Mensagem customizada");
    expect(result.current.data).toEqual([]);
  });

  it("não deve buscar dados se token ou feiraId estiverem ausentes", () => {
    const { result } = renderHook(() =>
      useFetchFeiraData(null, "feira-1", mockFetchFn),
    );

    expect(result.current.loading).toBe(false);
    expect(mockFetchFn).not.toHaveBeenCalled();
  });
});
