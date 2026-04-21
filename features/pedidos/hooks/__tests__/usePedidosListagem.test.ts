import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { usePedidosListagem } from "../usePedidosListagem";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import { useRouter } from "next/navigation";

vi.mock("@/features/pedidos/api/pedidos.service");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("usePedidosListagem", () => {
  const mockPush = vi.fn();
  const mockPedidos = [
    { id: "p1", clienteNome: "João Silva" },
    { id: "p2", clienteNome: "Maria Souza" },
    { id: "p3", clienteNome: "Jose Santos" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (pedidoService.listar as Mock).mockResolvedValue(mockPedidos);
  });

  it("deve carregar os pedidos ao inicializar", async () => {
    const { result } = renderHook(() => usePedidosListagem(2));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.totalCount).toBe(3);
    // Verificando paginação (limitada a 2 itens por página no setup)
    expect(result.current.pedidos).toHaveLength(2);
  });

  it("deve filtrar os pedidos corretamente", async () => {
    const { result } = renderHook(() => usePedidosListagem(10));
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleSearch("Maria");
    });

    expect(result.current.pedidos).toHaveLength(1);
    expect(result.current.pedidos[0].clienteNome).toBe("Maria Souza");
  });

  it("deve gerenciar a navegação entre páginas", async () => {
    const { result } = renderHook(() => usePedidosListagem(2));
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pedidos).toHaveLength(1);
  });

  it("deve navegar para os detalhes ao selecionar um pedido", async () => {
    const { result } = renderHook(() => usePedidosListagem());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleRowClick("p1");
    });

    expect(mockPush).toHaveBeenCalledWith("/pedidos/p1");
  });

  it("deve capturar erro se a API falhar", async () => {
    (pedidoService.listar as Mock).mockRejectedValue(new Error("Erro API"));
    const { result } = renderHook(() => usePedidosListagem());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.erro).toBe("Erro ao carregar lista de pedidos");
  });
});
