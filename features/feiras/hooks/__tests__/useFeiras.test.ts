import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useFeiras } from "../useFeiras";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { type FeiraDTO } from "@/features/feiras/api/types";

vi.mock("@/features/feiras/api/feiras.service");
vi.mock("@/features/auth/contexts/AuthContext");

describe("useFeiras", () => {
  const mockFeiras: FeiraDTO[] = [
    {
      id: "1",
      dataHora: "2024-01-01T10:00:00Z",
      status: "ABERTA_PEDIDOS",
      comerciantes: [],
      itens: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar feiras com sucesso", async () => {
    (useAuth as Mock).mockReturnValue({ token: "valid-token" });
    (feiraService.getAll as Mock).mockResolvedValue(mockFeiras);

    const { result } = renderHook(() => useFeiras());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.feiras).toEqual(mockFeiras);
    expect(result.current.loading).toBe(false);
  });

  it("deve gerenciar a seleção de uma feira", async () => {
    (useAuth as Mock).mockReturnValue({ token: "valid-token" });
    (feiraService.getAll as Mock).mockResolvedValue(mockFeiras);

    const { result } = renderHook(() => useFeiras());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setSelected(mockFeiras[0]);
    });

    expect(result.current.selected).toEqual(mockFeiras[0]);
    expect(result.current.isFeiraSelected).toBe(true);
  });

  it("deve carregar mocks locais se o token for mock-token-dev", async () => {
    (useAuth as Mock).mockReturnValue({ token: "mock-token-dev" });

    const { result } = renderHook(() => useFeiras());
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.feiras.length).toBeGreaterThan(0);
    expect(feiraService.getAll).not.toHaveBeenCalled();
  });
});
