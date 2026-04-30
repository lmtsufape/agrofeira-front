import { render, screen } from "@testing-library/react";
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

  const defaultHookReturn = {
    clientes: [],
    pageData: { totalPages: 1, totalElements: 0 },
    isLoading: false,
    isError: null,
    mutate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: vi.fn() });
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
      { id: "1", nome: "Cliente A", dataCadastro: "2023-01-01" },
      { id: "2", nome: "Cliente B", dataCadastro: "2023-01-02" },
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
});
