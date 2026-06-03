import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { usePedidosListagem } from "../usePedidosListagem";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";

vi.mock("@/features/pedidos/api/pedidos.service");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("usePedidosListagem", () => {
  const mockPage = {
    content: [
      { id: "p1", consumidorNome: "João Silva" },
      { id: "p2", consumidorNome: "Maria Souza" },
      { id: "p3", consumidorNome: "Jose Santos" },
    ],
    totalElements: 3,
    totalPages: 2,
    number: 0,
    size: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (pedidoService.listar as Mock).mockResolvedValue(mockPage);
  });

  it("deve carregar os pedidos ao inicializar", async () => {
    const { result } = renderHook(() => usePedidosListagem(2));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.pedidos).toHaveLength(3);
  });

  it("deve filtrar os pedidos na página atual ao buscar", async () => {
    const { result } = renderHook(() => usePedidosListagem(10));
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleSearch("Maria");
    });

    expect(result.current.pedidos).toHaveLength(1);
    expect(result.current.pedidos[0].consumidorNome).toBe("Maria Souza");
  });

  it("deve gerenciar a navegação entre páginas", async () => {
    const { result } = renderHook(() => usePedidosListagem(2));
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
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
