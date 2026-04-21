import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useDetalhamentoCliente } from "../useDetalhamentoCliente";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";

vi.mock("@/features/pedidos/api/pedidos.service");

describe("useDetalhamentoCliente", () => {
  const mockPedidos = [
    {
      clienteId: "c1",
      clienteNome: "João",
      valorTotal: 50,
      itens: [{ id: "i1", itemNome: "X" }],
      feiraData: "2024-01-01",
    },
    {
      clienteId: "c1",
      clienteNome: "João",
      valorTotal: 30,
      itens: [{ id: "i2", itemNome: "Y" }],
      feiraData: "2024-01-01",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve agrupar pedidos do mesmo cliente e somar valores", async () => {
    (pedidoService.listarPorFeira as Mock).mockResolvedValue(mockPedidos);

    const { result } = renderHook(() =>
      useDetalhamentoCliente("valid-token", "f1"),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.clientes).toHaveLength(1);
    expect(result.current.clientes[0].clienteNome).toBe("João");
    expect(result.current.clientes[0].totalGeral).toBe(80);
    expect(result.current.clientes[0].itens).toHaveLength(2);
  });

  it("deve carregar mock local se o token for o de desenvolvimento", async () => {
    const { result } = renderHook(() =>
      useDetalhamentoCliente("mock-token-dev", "f1"),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.clientes.length).toBeGreaterThan(0);
    expect(pedidoService.listarPorFeira).not.toHaveBeenCalled();
  });
});
