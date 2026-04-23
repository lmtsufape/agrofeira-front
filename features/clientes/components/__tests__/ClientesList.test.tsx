import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClientesList } from "../ClientesList";
import { useClientes } from "../../hooks/useClientes";
import { useRouter } from "next/navigation";

// Mock do hook useClientes
vi.mock("../../hooks/useClientes", () => ({
  useClientes: vi.fn(),
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ClientesList Component", () => {
  const mockPush = vi.fn();
  const mockSetSearchTerm = vi.fn();

  const defaultHookReturn = {
    filteredClientes: [],
    clientes: [],
    loading: false,
    error: null,
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: vi.fn() });
  });

  it("deve exibir estado de carregamento", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    render(<ClientesList />);
    expect(screen.getByText("Carregando clientes...")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando a API falhar", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      error: "Falha na conexão",
    });

    render(<ClientesList />);
    expect(screen.getByText("Falha na conexão")).toBeInTheDocument();
  });

  it("deve listar clientes quando houver dados", () => {
    const mockClientes = [
      { id: "1", nome: "Ana Silva", dataCadastro: "2023-01-01" },
      { id: "2", nome: "Bruno Souza", dataCadastro: "2023-02-01" },
    ];

    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      clientes: mockClientes,
      filteredClientes: mockClientes,
    });

    render(<ClientesList />);

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Bruno Souza")).toBeInTheDocument();
    expect(screen.getAllByText("Editar")).toHaveLength(2);
  });

  it("deve filtrar clientes através do campo de busca", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      searchTerm: "",
    });

    render(<ClientesList />);

    const searchInput = screen.getByPlaceholderText("Buscar cliente...");
    fireEvent.change(searchInput, { target: { value: "Ana" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Ana");
  });

  it("deve exibir mensagem de 'nenhum cliente encontrado' se a lista estiver vazia", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredClientes: [],
    });

    render(<ClientesList />);
    expect(screen.getByText("Nenhum cliente encontrado")).toBeInTheDocument();
  });

  it("deve navegar para a página de edição ao clicar no botão Editar", () => {
    const mockClientes = [
      { id: "123", nome: "Ana Silva", dataCadastro: "2023-01-01" },
    ];

    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      clientes: mockClientes,
      filteredClientes: mockClientes,
    });

    render(<ClientesList />);

    const editButton = screen.getByText("Editar");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/clientes/123");
  });

  it("deve exibir a primeira letra do nome em maiúsculo no avatar", () => {
    const mockClientes = [{ id: "1", nome: "pedro oliveira" }];
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredClientes: mockClientes,
      clientes: mockClientes,
    });

    render(<ClientesList />);
    expect(screen.getByText("P")).toBeInTheDocument();
  });
});
