import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { SelecionarFeiraEItens } from "../SelecionarFeiraEItens";
import { useSelecionarFeiraEItens } from "../../hooks/useSelecionarFeiraEItens";
import { useRouter, useSearchParams } from "next/navigation";

vi.mock("../../hooks/useSelecionarFeiraEItens");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("SelecionarFeiraEItens Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  const defaultHookReturn = {
    feirasFiltradasPorPesquisa: [],
    selectedFeira: null,
    setSelectedFeira: vi.fn(),
    searchTerm: "",
    setSearchTerm: vi.fn(),
    itens: [],
    itensSelecionados: [],
    handleQuantidadeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => {
        if (key === "participante") return "p1";
        if (key === "tipo") return "cliente";
        if (key === "nome") return "João Silva";
        return null;
      }),
    });
  });

  it("deve renderizar lista de feiras quando nenhuma estiver selecionada", () => {
    const mockFeiras = [
      {
        id: "f1",
        dataHora: "2026-04-15T12:00:00Z",
        local: "Garanhuns",
        status: "ABERTA",
      },
    ];
    (useSelecionarFeiraEItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      feirasFiltradasPorPesquisa: mockFeiras,
    });

    render(<SelecionarFeiraEItens />);
    // Usamos um matcher flexível para a data pois toLocaleDateString depende do timezone
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(screen.getByText("Garanhuns")).toBeInTheDocument();
  });

  it("deve selecionar uma feira ao clicar nela", () => {
    const mockSetSelected = vi.fn();
    const mockFeira = {
      id: "f1",
      dataHora: "2026-04-15T12:00:00Z",
      local: "Garanhuns",
    };
    (useSelecionarFeiraEItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      feirasFiltradasPorPesquisa: [mockFeira],
      setSelectedFeira: mockSetSelected,
    });

    render(<SelecionarFeiraEItens />);
    fireEvent.click(screen.getByText(/2026/));
    expect(mockSetSelected).toHaveBeenCalledWith(mockFeira);
  });

  it("deve mostrar lista de itens quando uma feira for selecionada", () => {
    (useSelecionarFeiraEItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      selectedFeira: { id: "f1", dataHora: "2026-04-15", local: "Garanhuns" },
      itens: [{ id: "i1", nome: "Tomate", unidadeMedida: "Kg", quantidade: 0 }],
    });

    render(<SelecionarFeiraEItens />);
    expect(screen.getByText("Selecione os Produtos")).toBeInTheDocument();
    expect(screen.getByText("Tomate")).toBeInTheDocument();
  });

  it("deve chamar handleQuantidadeChange ao alterar quantidade", () => {
    const mockChangeQty = vi.fn();
    (useSelecionarFeiraEItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      selectedFeira: { id: "f1", dataHora: "2026-04-15", local: "Garanhuns" },
      itens: [{ id: "i1", nome: "Tomate", unidadeMedida: "Kg", quantidade: 1 }],
      handleQuantidadeChange: mockChangeQty,
    });

    render(<SelecionarFeiraEItens />);
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);
    expect(mockChangeQty).toHaveBeenCalledWith("i1", 1);
  });

  it("deve navegar para resumo ao clicar em Próximo com itens selecionados", () => {
    (useSelecionarFeiraEItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      selectedFeira: { id: "f1", dataHora: "2026-04-15", local: "Garanhuns" },
      itensSelecionados: [{ id: "i1", nome: "Tomate", quantidade: 2 }],
    });

    render(<SelecionarFeiraEItens />);
    fireEvent.click(screen.getByText("Próximo"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/pedidos/resumo"),
    );
  });

  it("deve exibir mensagem se não houver feiras encontradas", () => {
    (useSelecionarFeiraEItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      feirasFiltradasPorPesquisa: [],
    });
    render(<SelecionarFeiraEItens />);
    expect(screen.getByText("Nenhuma feira encontrada")).toBeInTheDocument();
  });
});
