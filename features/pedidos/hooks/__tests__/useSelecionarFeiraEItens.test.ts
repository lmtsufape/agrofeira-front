import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSelecionarFeiraEItens } from "../useSelecionarFeiraEItens";

describe("useSelecionarFeiraEItens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar com lista de feiras e itens mockados", () => {
    const { result } = renderHook(() => useSelecionarFeiraEItens());

    expect(result.current.feiras.length).toBeGreaterThan(0);
    expect(result.current.itens.length).toBeGreaterThan(0);
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
      // Mock feiras tem datas em 2026
      result.current.setSearchTerm("2026");
    });

    expect(result.current.feirasFiltradasPorPesquisa.length).toBeGreaterThan(0);

    act(() => {
      result.current.setSearchTerm("Data Inexistente");
    });

    expect(result.current.feirasFiltradasPorPesquisa).toHaveLength(0);
  });

  it("deve atualizar quantidade de itens e calcular itensSelecionados", () => {
    const { result } = renderHook(() => useSelecionarFeiraEItens());

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
      result.current.handleQuantidadeChange(item.id, -5); // Testando limite inferior (Math.max(0, ...))
    });

    expect(result.current.itens[0].quantidade).toBe(0);
    expect(result.current.itensSelecionados).toHaveLength(0);
  });
});
