import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ItensList } from "../ItensList";
import { useItens } from "../../hooks/useItens";
import { useRouter } from "next/navigation";

// Mock do hook useItens
vi.mock("../../hooks/useItens", () => ({
  useItens: vi.fn(),
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ItensList Component", () => {
  const mockBack = vi.fn();
  const mockSetSearchTerm = vi.fn();
  const mockUpdateItem = vi.fn();
  const mockDeleteItem = vi.fn();

  const defaultHookReturn = {
    itens: [],
    filteredItens: [],
    loading: false,
    error: null,
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    updateItem: mockUpdateItem,
    deleteItem: mockDeleteItem,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ back: mockBack });
    // Mock do window.confirm
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true),
    );
  });

  it("deve exibir estado de carregamento", () => {
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    render(<ItensList />);
    expect(screen.getByText("Carregando itens...")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando falhar", () => {
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      error: "Erro ao buscar itens",
    });

    render(<ItensList />);
    expect(screen.getByText("Erro ao buscar itens")).toBeInTheDocument();
  });

  it("deve listar itens corretamente", () => {
    const mockItens = [
      {
        id: "1",
        nome: "Tomate",
        valor: "5.00",
        unidadeMedida: "Kg",
        dataCadastro: "2024-01-01",
      },
      {
        id: "2",
        nome: "Alface",
        valor: "3.00",
        unidadeMedida: "Un",
        dataCadastro: "2024-01-02",
      },
    ];

    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      itens: mockItens,
      filteredItens: mockItens,
    });

    render(<ItensList />);

    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("Alface")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição ao clicar em Editar", () => {
    const mockItens = [
      { id: "1", nome: "Tomate", valor: "5.00", unidadeMedida: "Kg" },
    ];
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredItens: mockItens,
    });

    render(<ItensList />);

    fireEvent.click(screen.getByText("Editar"));
    expect(screen.getByText("Editar Item")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tomate")).toBeInTheDocument();
  });

  it("deve chamar updateItem ao salvar alterações no modal", async () => {
    const mockItens = [
      { id: "1", nome: "Tomate", valor: "5.00", unidadeMedida: "Kg" },
    ];
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredItens: mockItens,
    });

    render(<ItensList />);

    fireEvent.click(screen.getByText("Editar"));

    const inputNome = screen.getByPlaceholderText("Ex: Banana");
    fireEvent.change(inputNome, { target: { value: "Tomate Cereja" } });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockUpdateItem).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          nome: "Tomate Cereja",
        }),
      );
    });
  });

  it("deve chamar deleteItem ao confirmar exclusão", async () => {
    const mockItens = [
      { id: "1", nome: "Tomate", valor: "5.00", unidadeMedida: "Kg" },
    ];
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredItens: mockItens,
    });

    render(<ItensList />);

    fireEvent.click(screen.getByText("Editar"));
    fireEvent.click(screen.getByText("Excluir Item"));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteItem).toHaveBeenCalledWith("1");
  });

  it("deve chamar setSearchTerm ao digitar na busca", () => {
    (useItens as Mock).mockReturnValue(defaultHookReturn);

    render(<ItensList />);

    const input = screen.getByPlaceholderText("Buscar item...");
    fireEvent.change(input, { target: { value: "Cenoura" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Cenoura");
  });

  it("deve exibir mensagem de 'nenhum item encontrado'", () => {
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredItens: [],
    });

    render(<ItensList />);
    expect(screen.getByText("Nenhum item encontrado")).toBeInTheDocument();
  });
});
