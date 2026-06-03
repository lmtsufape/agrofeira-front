import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useResumoPedido } from "../useResumoPedido";
import { useRouter } from "next/navigation";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/features/pedidos/api/pedidos.service", () => ({
  pedidoService: {
    criar: vi.fn(),
  },
}));

const mockCartItems = [
  {
    id: "1",
    nome: "Tomate Orgânico",
    unidadeMedida: "kg",
    precoBase: 5.5,
    quantidade: 2,
  },
  {
    id: "2",
    nome: "Alface",
    unidadeMedida: "maço",
    precoBase: 3.0,
    quantidade: 1,
  },
];

describe("useResumoPedido", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "agrofeira_pedido_itens")
        return JSON.stringify(mockCartItems);
      return null;
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
  });

  it("deve processar itens do sessionStorage corretamente", () => {
    const { result } = renderHook(() => useResumoPedido("feira-1", "part-1"));

    expect(result.current.itensCarrinho).toHaveLength(2);
    expect(result.current.itensCarrinho[0].quantidade).toBe(2);
    expect(result.current.itensCarrinho[0].nome).toBe("Tomate Orgânico");
    expect(result.current.valorTotal).toBe(14.0); // (5.5 * 2) + (3.0 * 1)
  });

  it("deve permitir alterar quantidade no carrinho e recalcular total", () => {
    const { result } = renderHook(() => useResumoPedido("feira-1", "part-1"));

    act(() => {
      result.current.handleQuantidadeChange("1", 1); // +1
    });

    expect(result.current.itensCarrinho[0].quantidade).toBe(3);
    expect(result.current.valorTotal).toBe(19.5); // (5.5 * 3) + 3.0
  });

  it("deve permitir remover item do carrinho", () => {
    const { result } = renderHook(() => useResumoPedido("feira-1", "part-1"));

    act(() => {
      result.current.handleRemover("2");
    });

    expect(result.current.itensCarrinho).toHaveLength(1);
    expect(result.current.valorTotal).toBe(11.0);
  });

  it("deve gerenciar opção de retirada e modal de endereço", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    const { result } = renderHook(() => useResumoPedido("feira-1", ""));

    expect(result.current.opcaoRetirada).toBe("local");

    act(() => {
      result.current.setOpcaoRetirada("endereco");
      result.current.setEnderecoModal(true);
    });

    expect(result.current.opcaoRetirada).toBe("endereco");
    expect(result.current.enderecoModal).toBe(true);
  });

  it("deve finalizar pedido, marcar como realizado e redirecionar", async () => {
    vi.useFakeTimers();
    (pedidoService.criar as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useResumoPedido("feira-1", "part-1"));

    await act(async () => {
      await result.current.finalizarPedido();
    });

    expect(result.current.pedidoRealizado).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockPush).toHaveBeenCalledWith("/pedidos");
    vi.useRealTimers();
  });
});
