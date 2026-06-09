import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClientesList } from "../ClientesList";
import { useClientes } from "../../hooks/useClientes";
import { useRouter } from "next/navigation";

vi.mock("../../hooks/useClientes", () => ({
  useClientes: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ClientesList Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  const defaultHookReturn = {
    clientes: [],
    pageData: { totalPages: 1, totalElements: 0 },
    isLoading: false,
    isError: null,
    mutate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
  });

  it("deve exibir estado de carregamento", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<ClientesList />);
    expect(screen.getByText("Carregando clientes...")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando a API falhar", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      isError: new Error("Falha na API"),
    });

    render(<ClientesList />);
    expect(screen.getByText("Erro ao carregar clientes")).toBeInTheDocument();
  });

  it("deve listar clientes corretamente", () => {
    const mockClientes = [
      { id: "1", nome: "Cliente A", descricao: "Desc A" },
      { id: "2", nome: "Cliente B", descricao: "Desc B" },
    ];

    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      clientes: mockClientes,
      pageData: { totalPages: 1, totalElements: 2 },
    });

    render(<ClientesList />);

    expect(screen.getByText("Cliente A")).toBeInTheDocument();
    expect(screen.getByText("Cliente B")).toBeInTheDocument();
  });

  it("deve navegar para a página de edição ao clicar em Editar", () => {
    const mockClientes = [{ id: "123", nome: "Cliente Teste", descricao: "" }];
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      clientes: mockClientes,
    });

    render(<ClientesList />);

    const editButton = screen.getByText("Editar");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/clientes/123");
  });

  it("deve atualizar a busca com debounce", async () => {
    vi.useFakeTimers();
    (useClientes as Mock).mockReturnValue(defaultHookReturn);

    render(<ClientesList />);

    const searchInput = screen.getByPlaceholderText("Buscar cliente...");
    fireEvent.change(searchInput, { target: { value: "Maria" } });

    // Logo após a mudança, o hook não deve ter sido chamado com o novo valor
    expect(useClientes).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "" }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(useClientes).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "Maria" }),
    );
    vi.useRealTimers();
  });

  it("deve mudar de página ao clicar nos botões de navegação", () => {
    (useClientes as Mock).mockReturnValue({
      ...defaultHookReturn,
      clientes: [{ id: "1", nome: "C1" }],
      pageData: { totalPages: 3, totalElements: 3 },
    });

    render(<ClientesList />);

    // Localiza botões de paginação (ChevronLeft e ChevronRight)
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1]; // Último costuma ser o Next

    fireEvent.click(nextButton);

    expect(useClientes).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 }),
    );
  });

  it("deve voltar ao clicar no botão de voltar do header", () => {
    (useClientes as Mock).mockReturnValue(defaultHookReturn);

    render(<ClientesList />);

    const backButton = screen.getAllByRole("button")[0];
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });
});
