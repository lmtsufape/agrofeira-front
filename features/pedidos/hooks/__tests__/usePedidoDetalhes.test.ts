import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { usePedidoDetalhes } from "../usePedidoDetalhes";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import { useRouter } from "next/navigation";

vi.mock("@/features/pedidos/api/pedidos.service");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("usePedidoDetalhes", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve carregar detalhes do pedido com sucesso", async () => {
    const mockPedido = { id: "p1", clienteNome: "João" };
    (pedidoService.buscarPorId as Mock).mockResolvedValue(mockPedido);

    const { result } = renderHook(() => usePedidoDetalhes("p1"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pedido).toEqual(mockPedido);
    expect(pedidoService.buscarPorId).toHaveBeenCalledWith("p1");
  });

  it("deve tratar erro ao buscar pedido", async () => {
    (pedidoService.buscarPorId as Mock).mockRejectedValue(new Error("Fail"));

    const { result } = renderHook(() => usePedidoDetalhes("p1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.erro).toBe("Erro ao carregar detalhes do pedido");
    expect(result.current.pedido).toBe(null);
  });

  it("deve navegar de volta ao clicar em voltar", () => {
    const { result } = renderHook(() => usePedidoDetalhes("p1"));

    result.current.handleVoltar();
    expect(mockPush).toHaveBeenCalledWith("/pedidos");
  });
});
