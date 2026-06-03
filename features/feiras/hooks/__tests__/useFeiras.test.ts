import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useFeiras } from "../useFeiras";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { type FeiraDTO } from "@/features/feiras/api/types";

vi.mock("@/features/feiras/api/feiras.service");
vi.mock("@/features/auth/contexts/AuthContext");
vi.mock("swr", () => ({
  default: vi.fn(),
}));

describe("useFeiras", () => {
  const mockFeiras: FeiraDTO[] = [
    {
      id: "1",
      dataHora: "2024-01-01T10:00:00Z",
      status: "ABERTA",
      ativa: true,
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ isAuthenticated: true });
    (feiraService.getAll as Mock).mockResolvedValue({ content: mockFeiras });

    const swr = await import("swr");
    (swr.default as Mock).mockImplementation(
      (_key: unknown, fetcher: unknown) => {
        if (!_key || !fetcher)
          return { data: undefined, error: undefined, isLoading: true };
        return {
          data: { content: mockFeiras },
          error: undefined,
          isLoading: false,
        };
      },
    );
  });

  it("deve expor feiras quando autenticado", async () => {
    const { result } = renderHook(() => useFeiras());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.feiras).toEqual(mockFeiras);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve gerenciar a seleção de uma feira", async () => {
    const { result } = renderHook(() => useFeiras());

    await act(async () => {
      result.current.setSelected(mockFeiras[0]);
    });

    expect(result.current.selected).toEqual(mockFeiras[0]);
    expect(result.current.isFeiraSelected).toBe(true);
  });

  it("não deve buscar feiras quando não autenticado", async () => {
    (useAuth as Mock).mockReturnValue({ isAuthenticated: false });

    const swr = await import("swr");
    (swr.default as Mock).mockImplementation((key: unknown) => {
      expect(key).toBeNull();
      return { data: undefined, error: undefined, isLoading: true };
    });

    renderHook(() => useFeiras());
  });
});
