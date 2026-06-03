import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useDetalhamentoCliente } from "../useDetalhamentoCliente";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";

vi.mock("@/features/pedidos/api/pedidos.service");

describe("useDetalhamentoCliente", () => {
  const mockPedidos = [
    {
      id: "p-1",
      feiraId: "f1",
      consumidorNome: "João",
      status: "PENDENTE",
      tipoRetirada: "RETIRADA",
      taxaEntrega: 0,
      valorProdutos: 50,
      valorTotal: 50,
      criadoEm: "2025-01-01T08:00:00",
      itens: [
        {
          produtoId: "i1",
          nomeItem: "X",
          unidadeMedida: "un",
          quantidade: 1,
          valorUnitario: 50,
          valorTotal: 50,
        },
      ],
    },
    {
      id: "p-2",
      feiraId: "f1",
      consumidorNome: "João",
      status: "PENDENTE",
      tipoRetirada: "RETIRADA",
      taxaEntrega: 0,
      valorProdutos: 30,
      valorTotal: 30,
      criadoEm: "2025-01-01T08:00:00",
      itens: [
        {
          produtoId: "i2",
          nomeItem: "Y",
          unidadeMedida: "un",
          quantidade: 1,
          valorUnitario: 30,
          valorTotal: 30,
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve agrupar pedidos do mesmo cliente e somar valores", async () => {
    (pedidoService.listarPorFeira as Mock).mockResolvedValue(mockPedidos);

    const { result } = renderHook(() => useDetalhamentoCliente("f1"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.clientes).toHaveLength(1);
    expect(result.current.clientes[0].clienteNome).toBe("João");
    expect(result.current.clientes[0].totalGeral).toBe(80);
    expect(result.current.clientes[0].itens).toHaveLength(2);
  });

  it("não deve buscar sem feiraId", async () => {
    const { result } = renderHook(() => useDetalhamentoCliente(null));

    await act(async () => {
      await Promise.resolve();
    });

    expect(pedidoService.listarPorFeira).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("deve tratar erro ao carregar pedidos", async () => {
    (pedidoService.listarPorFeira as Mock).mockRejectedValue(new Error("Fail"));

    const { result } = renderHook(() => useDetalhamentoCliente("f1"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.clientes).toHaveLength(0);
    expect(result.current.erro).toContain(
      "Não foi possível carregar os pedidos",
    );
  });
});
