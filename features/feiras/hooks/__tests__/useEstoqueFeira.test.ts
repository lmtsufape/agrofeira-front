import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useEstoqueFeira, type OfertaCadastrada } from "../useEstoqueFeira";
import useSWR from "swr";
import { apiClient } from "@/lib/api-client";

vi.mock("swr");
vi.mock("@/lib/api-client");
vi.mock("@/features/feiras/api/feiras.service");
vi.mock("@/features/comerciantes/api/comerciantes.service");
vi.mock("@/features/itens/api/itens.service");

describe("useEstoqueFeira", () => {
  const mockFeiraId = "f1";
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSWR as Mock).mockImplementation((key: string) => {
      if (key?.includes("/api/v1/feiras/"))
        return { data: { id: mockFeiraId } };
      if (key?.includes("/api/v1/estoque-bancas/feira/"))
        return { data: [], mutate: mockMutate, isLoading: false };
      if (key?.includes("/api/v1/comerciantes"))
        return { data: { content: [] } };
      if (key?.includes("/api/v1/itens")) return { data: { content: [] } };
      return { data: null };
    });
  });

  it("deve inicializar com valores vazios", () => {
    const { result } = renderHook(() => useEstoqueFeira(mockFeiraId));

    expect(result.current.comercianteId).toBe("");
    expect(result.current.produtoId).toBe("");
    expect(result.current.quantidade).toBe("");
  });

  it("deve cadastrar uma nova oferta com sucesso", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useEstoqueFeira(mockFeiraId));

    act(() => {
      result.current.setComercianteId("c1");
      result.current.setProdutoId("p1");
      result.current.setQuantidade("10");
    });

    await act(async () => {
      await result.current.handleAdicionar();
    });

    expect(apiClient).toHaveBeenCalledWith("/api/v1/estoque-bancas", {
      method: "POST",
      body: JSON.stringify({
        feiraId: mockFeiraId,
        comercianteId: "c1",
        produtoId: "p1",
        quantidadeOfertada: 10,
      }),
    });
    expect(result.current.sucesso).toBe("Oferta cadastrada com sucesso!");
    expect(mockMutate).toHaveBeenCalled();
  });

  it("deve validar campos obrigatórios ao adicionar", async () => {
    const { result } = renderHook(() => useEstoqueFeira(mockFeiraId));

    await act(async () => {
      await result.current.handleAdicionar();
    });

    expect(result.current.erro).toBe("Preencha todos os campos corretamente.");
    expect(apiClient).not.toHaveBeenCalled();
  });

  it("deve iniciar e cancelar edição", () => {
    const { result } = renderHook(() => useEstoqueFeira(mockFeiraId));
    const mockOferta = {
      id: "o1",
      quantidadeOfertada: 5,
    } as OfertaCadastrada;

    act(() => {
      result.current.iniciarEdicao(mockOferta);
    });

    expect(result.current.editandoId).toBe("o1");
    expect(result.current.novaQtd).toBe("5");

    act(() => {
      result.current.cancelarEdicao();
    });

    expect(result.current.editandoId).toBe(null);
    expect(result.current.novaQtd).toBe("");
  });

  it("deve atualizar uma oferta com sucesso", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useEstoqueFeira(mockFeiraId));

    act(() => {
      result.current.setNovaQtd("15");
    });

    await act(async () => {
      await result.current.handleAtualizar("o1");
    });

    expect(apiClient).toHaveBeenCalledWith("/api/v1/estoque-bancas/o1", {
      method: "PUT",
      body: JSON.stringify({ quantidadeOfertada: 15 }),
    });
    expect(result.current.editandoId).toBe(null);
    expect(mockMutate).toHaveBeenCalled();
  });

  it("deve lidar com erro ao atualizar", async () => {
    (apiClient as Mock).mockRejectedValue({ message: "Erro customizado" });
    const { result } = renderHook(() => useEstoqueFeira(mockFeiraId));

    act(() => {
      result.current.setNovaQtd("15");
    });

    await act(async () => {
      await result.current.handleAtualizar("o1");
    });

    expect(result.current.erro).toBe("Erro customizado");
    expect(result.current.editSubmitting).toBe(false);
  });
});
