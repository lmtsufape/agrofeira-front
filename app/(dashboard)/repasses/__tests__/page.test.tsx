import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import RepassesPage from "../page";
import { useRepasses } from "@/features/repasses/hooks/useRepasses";

vi.mock("@/features/repasses/hooks/useRepasses");
vi.mock("@/features/repasses/components/RepassesTable", () => ({
  RepassesTable: () => <div data-testid="repasses-table" />,
}));
vi.mock("@/features/repasses/components/CadastrarRepasseForm", () => ({
  CadastrarRepasseForm: () => <div data-testid="cadastrar-repasse-form" />,
}));
vi.mock("@/features/pedidos/components/SearchInput", () => ({
  SearchInput: () => <div data-testid="search-input" />,
}));
vi.mock("@/features/pedidos/components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("RepassesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir loader quando estiver carregando", () => {
    (useRepasses as Mock).mockReturnValue({
      repasses: [],
      loading: true,
      erro: null,
      searchTerm: "",
    });

    render(<RepassesPage />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve exibir erro se houver falha no carregamento", () => {
    (useRepasses as Mock).mockReturnValue({
      repasses: [],
      loading: false,
      erro: "Erro ao carregar",
      searchTerm: "",
    });

    render(<RepassesPage />);
    expect(screen.getByText("Erro ao carregar")).toBeInTheDocument();
  });

  it("deve exibir mensagem de vazio quando não houver repasses", () => {
    (useRepasses as Mock).mockReturnValue({
      repasses: [],
      loading: false,
      erro: null,
      searchTerm: "",
    });

    render(<RepassesPage />);
    expect(
      screen.getByText(/Nenhum repasse registrado no momento/i),
    ).toBeInTheDocument();
  });

  it("deve exibir a tabela e paginação quando houver dados", () => {
    (useRepasses as Mock).mockReturnValue({
      repasses: [{ id: "1", comerciante: { nome: "Teste" } }],
      loading: false,
      erro: null,
      totalCount: 1,
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      startIndex: 0,
    });

    render(<RepassesPage />);
    expect(screen.getByTestId("repasses-table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("deve alternar a exibição do formulário de cadastro ao clicar no botão", () => {
    (useRepasses as Mock).mockReturnValue({
      repasses: [],
      loading: false,
      erro: null,
      searchTerm: "",
    });

    render(<RepassesPage />);

    const button = screen.getByText(/Cadastrar Repasse/i);
    fireEvent.click(button);

    expect(screen.getByTestId("cadastrar-repasse-form")).toBeInTheDocument();
    expect(screen.getByText(/Fechar/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Fechar/i));
    expect(
      screen.queryByTestId("cadastrar-repasse-form"),
    ).not.toBeInTheDocument();
  });
});
