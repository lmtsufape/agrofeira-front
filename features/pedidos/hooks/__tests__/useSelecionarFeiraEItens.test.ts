import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useSelecionarFeiraEItens } from "../useSelecionarFeiraEItens";

vi.mock("swr", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

import useSWR from "swr";

const mockFeiras = [
  {
    id: "f1",
    dataHora: "2026-05-01T09:00:00",
    status: "FINALIZADA",
    ativa: false,
  },
  { id: "f2", dataHora: "2026-06-01T09:00:00", status: "ABERTA", ativa: true },
];

const mockOfertas = [
  {
    id: "o1",
    produto: { id: "p1", nome: "Tomate", unidadeMedida: "kg", precoBase: 5.5 },
    quantidadeDisponivel: 10,
  },
  {
    id: "o2",
    produto: {
      id: "p2",
      nome: "Alface",
      unidadeMedida: "maço",
      precoBase: 3.0,
    },
    quantidadeDisponivel: 20,
  },
];

describe("useSelecionarFeiraEItens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSWR as Mock).mockImplementation((key: string | null) => {
      if (key === "/api/v1/feiras?size=100") {
        return { data: { content: mockFeiras }, isLoading: false };
      }
      if (key && key.startsWith("/api/v1/estoque-bancas/feira/")) {
        return { data: mockOfertas, isLoading: false };
      }
      return { data: null, isLoading: false };
    });
  });

  it("deve inicializar com feiras carregadas da API", () => {
    const { result } = renderHook(() => useSelecionarFeiraEItens());

    expect(result.current.feiras.length).toBeGreaterThan(0);
    expect(result.current.itens).toHaveLength(0); // itens só carregam após selecionar feira
    expect(result.current.selectedFeira).toBe(null);
  });

  it("deve permitir selecionar uma feira", () => {
    const { result } = renderHook(() => useSelecionarFeiraEItens());

    const feira = result.current.feiras[0];
    act(() => {
      result.current.setSelectedFeira(feira);
    });

    expect(result.current.selectedFeira).toEqual(feira);
  });

  it("deve filtrar feiras pela busca (data)", () => {
    const { result } = renderHook(() => useSelecionarFeiraEItens());

    act(() => {
      result.current.setSearchTerm("2026");
    });

    expect(result.current.feirasFiltradasPorPesquisa.length).toBeGreaterThan(0);

    act(() => {
      result.current.setSearchTerm("Data Inexistente");
    });

    expect(result.current.feirasFiltradasPorPesquisa).toHaveLength(0);
  });

  it("deve atualizar quantidade de itens e calcular itensSelecionados", async () => {
    const { result } = renderHook(() => useSelecionarFeiraEItens());

    act(() => {
      result.current.setSelectedFeira(result.current.feiras[0]);
    });

    await waitFor(() => {
      expect(result.current.itens.length).toBeGreaterThan(0);
    });

    const item = result.current.itens[0];

    act(() => {
      result.current.handleQuantidadeChange(item.id, 2);
    });

    expect(result.current.itens[0].quantidade).toBe(2);
    expect(result.current.itensSelecionados).toHaveLength(1);
    expect(result.current.itensSelecionados[0].id).toBe(item.id);

    act(() => {
      result.current.handleQuantidadeChange(item.id, -1);
    });

    expect(result.current.itens[0].quantidade).toBe(1);

    act(() => {
      result.current.handleQuantidadeChange(item.id, -5);
    });

    expect(result.current.itens[0].quantidade).toBe(0);
    expect(result.current.itensSelecionados).toHaveLength(0);
  });
});
