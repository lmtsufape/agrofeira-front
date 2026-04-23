import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useSelecionarParticipante } from "../useSelecionarParticipante";
import { clienteService } from "@/features/clientes/api/clientes.service";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";

vi.mock("@/features/clientes/api/clientes.service", () => ({
  clienteService: {
    getAll: vi.fn(),
  },
}));

vi.mock("@/features/comerciantes/api/comerciantes.service", () => ({
  comercianteService: {
    getAll: vi.fn(),
  },
}));

describe("useSelecionarParticipante", () => {
  const mockClientes = [{ id: "c1", nome: "Cliente A", telefone: "123" }];
  const mockComerciantes = [
    { id: "m1", nome: "Comerciante B", telefone: "456" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve carregar clientes e comerciantes ao montar", async () => {
    (clienteService.getAll as Mock).mockResolvedValue(mockClientes);
    (comercianteService.getAll as Mock).mockResolvedValue(mockComerciantes);

    const { result } = renderHook(() => useSelecionarParticipante());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.participantes).toHaveLength(2);
    expect(result.current.participantes).toContainEqual(
      expect.objectContaining({ id: "c1", tipo: "cliente" }),
    );
    expect(result.current.participantes).toContainEqual(
      expect.objectContaining({ id: "m1", tipo: "comerciante" }),
    );
  });

  it("deve usar dados mock em caso de erro na API", async () => {
    (clienteService.getAll as Mock).mockRejectedValue(new Error("API Fail"));
    (comercianteService.getAll as Mock).mockRejectedValue(
      new Error("API Fail"),
    );

    const { result } = renderHook(() => useSelecionarParticipante());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // MOCK_PARTICIPANTES tem 6 itens
    expect(result.current.participantes.length).toBeGreaterThan(0);
    expect(result.current.error).toBe(null); // O hook silencia o erro usando mock
  });

  it("deve filtrar participantes pelo termo de busca", async () => {
    (clienteService.getAll as Mock).mockResolvedValue(mockClientes);
    (comercianteService.getAll as Mock).mockResolvedValue(mockComerciantes);

    const { result } = renderHook(() => useSelecionarParticipante());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchTerm("Cliente");
    });

    expect(result.current.filteredParticipantes).toHaveLength(1);
    expect(result.current.filteredParticipantes[0].nome).toBe("Cliente A");
  });

  it("deve permitir selecionar um participante", async () => {
    (clienteService.getAll as Mock).mockResolvedValue(mockClientes);
    (comercianteService.getAll as Mock).mockResolvedValue(mockComerciantes);

    const { result } = renderHook(() => useSelecionarParticipante());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const p = result.current.participantes[0];
    act(() => {
      result.current.setSelectedParticipante(p);
    });

    expect(result.current.selectedParticipante).toEqual(p);
  });
});
