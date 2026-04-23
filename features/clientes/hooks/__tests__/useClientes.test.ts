import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useClientes } from "../useClientes";
import { clienteService } from "../../api/clientes.service";

vi.mock("../../api/clientes.service", () => ({
  clienteService: {
    getAll: vi.fn(),
  },
}));

describe("useClientes", () => {
  const mockClientes = [
    { id: "1", nome: "Ana Silva" },
    { id: "2", nome: "Bruno Costa" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar clientes ao montar", async () => {
    (clienteService.getAll as Mock).mockResolvedValue(mockClientes);

    const { result } = renderHook(() => useClientes());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.clientes).toEqual(mockClientes);
    expect(result.current.error).toBe(null);
  });

  it("deve lidar com erro na busca", async () => {
    (clienteService.getAll as Mock).mockRejectedValue(
      new Error("Erro de rede"),
    );

    const { result } = renderHook(() => useClientes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erro de rede");
    expect(result.current.clientes).toEqual([]);
  });

  it("deve filtrar clientes pelo termo de busca", async () => {
    (clienteService.getAll as Mock).mockResolvedValue(mockClientes);

    const { result } = renderHook(() => useClientes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm("Ana");
    });

    expect(result.current.filteredClientes).toHaveLength(1);
    expect(result.current.filteredClientes[0].nome).toBe("Ana Silva");

    act(() => {
      result.current.setSearchTerm("Xyz");
    });

    expect(result.current.filteredClientes).toHaveLength(0);
  });

  it("deve permitir atualizar a lista manualmente", async () => {
    (clienteService.getAll as Mock).mockResolvedValue(mockClientes);

    const { result } = renderHook(() => useClientes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const novosClientes = [...mockClientes, { id: "3", nome: "Clara" }];
    (clienteService.getAll as Mock).mockResolvedValue(novosClientes);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.clientes).toHaveLength(3);
  });
});
