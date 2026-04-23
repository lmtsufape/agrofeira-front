import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ComerciantesList } from "../ComerciantesList";
import { useComerciantes } from "../../hooks/useComerciantes";
import { useRouter } from "next/navigation";

// Mock do hook useComerciantes
vi.mock("../../hooks/useComerciantes", () => ({
  useComerciantes: vi.fn(),
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ComerciantesList Component", () => {
  const mockPush = vi.fn();
  const mockSetSearchTerm = vi.fn();

  const defaultHookReturn = {
    filteredComerciantes: [],
    comerciantes: [],
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
    (useComerciantes as Mock).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    render(<ComerciantesList />);
    expect(screen.getByText("Carregando comerciantes...")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando houver falha", () => {
    (useComerciantes as Mock).mockReturnValue({
      ...defaultHookReturn,
      error: "Erro na API",
    });

    render(<ComerciantesList />);
    expect(screen.getByText("Erro na API")).toBeInTheDocument();
  });

  it("deve listar comerciantes corretamente", () => {
    const mockComerciantes = [
      { id: "1", nome: "Vendedor A", telefone: "9999-9999" },
      { id: "2", nome: "Vendedor B", telefone: "8888-8888" },
    ];

    (useComerciantes as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciantes: mockComerciantes,
      filteredComerciantes: mockComerciantes,
    });

    render(<ComerciantesList />);

    expect(screen.getByText("Vendedor A")).toBeInTheDocument();
    expect(screen.getByText("Vendedor B")).toBeInTheDocument();
  });

  it("deve navegar para a página de detalhes ao clicar em Editar", () => {
    const mockComerciantes = [
      { id: "777", nome: "Vendedor X", telefone: "1111" },
    ];

    (useComerciantes as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredComerciantes: mockComerciantes,
    });

    render(<ComerciantesList />);

    const editButton = screen.getByText("Editar");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/comerciantes/777");
  });

  it("deve chamar setSearchTerm ao digitar na busca", () => {
    (useComerciantes as Mock).mockReturnValue(defaultHookReturn);

    render(<ComerciantesList />);

    const input = screen.getByPlaceholderText("Buscar comerciante...");
    fireEvent.change(input, { target: { value: "Mercado" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Mercado");
  });

  it("deve exibir mensagem se não houver resultados no filtro", () => {
    (useComerciantes as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredComerciantes: [],
    });

    render(<ComerciantesList />);
    expect(
      screen.getByText("Nenhum comerciante encontrado"),
    ).toBeInTheDocument();
  });
});
