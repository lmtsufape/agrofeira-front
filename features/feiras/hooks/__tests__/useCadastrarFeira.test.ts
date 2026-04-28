import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import useSWR from "swr";
import { useCadastrarFeira } from "../useCadastrarFeira";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";

vi.mock("swr");
vi.mock("@/features/feiras/api/feiras.service");
vi.mock("@/features/comerciantes/api/comerciantes.service");
vi.mock("@/features/itens/api/itens.service");
vi.mock("@/features/auth/contexts/AuthContext");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useCadastrarFeira", () => {
  const mockPush = vi.fn();
  const mockComs = [{ id: "c1", nome: "Com 1" }];
  const mockItens = [{ id: "i1", nome: "Item 1", unidadeMedida: "UN" }];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useAuth as Mock).mockReturnValue({
      token: "valid-token",
      isAuthenticated: true,
    });

    (useSWR as Mock).mockImplementation((key: string) => {
      if (key?.includes("comerciantes")) {
        return { data: { content: mockComs }, error: null };
      }
      if (key?.includes("itens")) {
        return { data: { content: mockItens }, error: null };
      }
      return { data: null, error: null };
    });
  });

  it("deve carregar dados iniciais (comerciantes e itens) ao montar", async () => {
    const { result } = renderHook(() => useCadastrarFeira());

    expect(result.current.comerciantes.right).toEqual(mockComs);
    expect(result.current.itens.right).toEqual(mockItens);
    expect(result.current.loadingData).toBe(false);
  });

  it("deve gerenciar a transferência de comerciantes entre as listas", async () => {
    const { result } = renderHook(() => useCadastrarFeira());
    await act(async () => {
      await Promise.resolve();
    });

    // Seleciona e move para a esquerda
    act(() => {
      result.current.toggleSel(
        "c1",
        result.current.comerciantes.rightSel,
        result.current.comerciantes.setRightSel,
      );
    });
    act(() => {
      result.current.comerciantes.toLeft();
    });

    expect(result.current.comerciantes.left).toHaveLength(1);
    expect(result.current.comerciantes.right).toHaveLength(0);
  });

  it("deve validar campos obrigatórios antes de confirmar", async () => {
    const { result } = renderHook(() => useCadastrarFeira());
    await act(async () => {
      await Promise.resolve();
    });

    // Remove tudo da direita (comerciantes e itens) para forçar erro
    act(() => {
      result.current.comerciantes.allToLeft();
      result.current.itens.allToLeft();
    });

    await act(async () => {
      await result.current.handleConfirmar();
    });

    expect(result.current.erro).toBe("Adicione ao menos um comerciante");
    expect(feiraService.create).not.toHaveBeenCalled();
  });

  it("deve chamar feiraService.create e redirecionar em caso de sucesso", async () => {
    (feiraService.create as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCadastrarFeira());
    await act(async () => {
      await Promise.resolve();
    });

    // Garante que existem itens na direita (padrão do mock)
    await act(async () => {
      await result.current.handleConfirmar();
    });

    expect(feiraService.create).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/feiras");
  });
});
