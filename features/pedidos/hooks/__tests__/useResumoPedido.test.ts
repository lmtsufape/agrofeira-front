import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useResumoPedido } from "../useResumoPedido";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useResumoPedido", () => {
  const mockPush = vi.fn();
  const mockItensList = "1:2,2:1"; // id 1 (qty 2), id 2 (qty 1)

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    vi.useFakeTimers();
  });

  it("deve processar itens da query string corretamente", () => {
    const { result } = renderHook(() => useResumoPedido(mockItensList));

    expect(result.current.itensCarrinho).toHaveLength(2);
    expect(result.current.itensCarrinho[0].quantidade).toBe(2);
    expect(result.current.itensCarrinho[0].nome).toBe("Tomate Orgânico");
    expect(result.current.valorTotal).toBe(14.0); // (5.5 * 2) + (3.0 * 1)
  });

  it("deve permitir alterar quantidade no carrinho e recalcular total", () => {
    const { result } = renderHook(() => useResumoPedido(mockItensList));

    act(() => {
      result.current.handleQuantidadeChange("1", 1); // +1
    });

    expect(result.current.itensCarrinho[0].quantidade).toBe(3);
    expect(result.current.valorTotal).toBe(19.5); // (5.5 * 3) + 3.0
  });

  it("deve permitir remover item do carrinho", () => {
    const { result } = renderHook(() => useResumoPedido(mockItensList));

    act(() => {
      result.current.handleRemover("2");
    });

    expect(result.current.itensCarrinho).toHaveLength(1);
    expect(result.current.valorTotal).toBe(11.0);
  });

  it("deve gerenciar opção de retirada e modal de endereço", () => {
    const { result } = renderHook(() => useResumoPedido(""));

    expect(result.current.opcaoRetirada).toBe("local");

    act(() => {
      result.current.setOpcaoRetirada("endereco");
      result.current.setEnderecoModal(true);
    });

    expect(result.current.opcaoRetirada).toBe("endereco");
    expect(result.current.enderecoModal).toBe(true);
  });

  it("deve finalizar pedido, marcar como realizado e redirecionar", async () => {
    const { result } = renderHook(() => useResumoPedido(mockItensList));

    await act(async () => {
      await result.current.finalizarPedido();
    });

    expect(result.current.pedidoRealizado).toBe(true);

    // Avança timers para o setTimeout de redirecionamento
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
