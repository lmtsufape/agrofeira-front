import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useItens } from "../useItens";
import { itemService } from "../../api/itens.service";

vi.mock("../../api/itens.service", () => ({
  itemService: {
    getAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useItens", () => {
  const mockItens = [
    { id: "1", nome: "Tomate", valor: "5.00", unidadeMedida: "kg" },
    { id: "2", nome: "Alface", valor: "3.00", unidadeMedida: "un" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar itens ao montar", async () => {
    (itemService.getAll as Mock).mockResolvedValue(mockItens);

    const { result } = renderHook(() => useItens());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.itens).toEqual(mockItens);
  });

  it("deve filtrar itens pelo nome", async () => {
    (itemService.getAll as Mock).mockResolvedValue(mockItens);
    const { result } = renderHook(() => useItens());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchTerm("Tomate");
    });

    expect(result.current.filteredItens).toHaveLength(1);
    expect(result.current.filteredItens[0].nome).toBe("Tomate");
  });

  it("deve chamar update e atualizar lista", async () => {
    (itemService.getAll as Mock).mockResolvedValue(mockItens);
    (itemService.update as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useItens());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateItem("1", { valor: "6.00" });
    });

    expect(itemService.update).toHaveBeenCalledWith("1", { valor: "6.00" });
    expect(itemService.getAll).toHaveBeenCalledTimes(2); // Initial + after update
  });

  it("deve chamar delete e atualizar lista", async () => {
    (itemService.getAll as Mock).mockResolvedValue(mockItens);
    (itemService.delete as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useItens());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteItem("2");
    });

    expect(itemService.delete).toHaveBeenCalledWith("2");
    expect(itemService.getAll).toHaveBeenCalledTimes(2);
  });

  it("deve lidar com erro na busca", async () => {
    (itemService.getAll as Mock).mockRejectedValue(new Error("Erro de rede"));

    const { result } = renderHook(() => useItens());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erro de rede");
  });
});
