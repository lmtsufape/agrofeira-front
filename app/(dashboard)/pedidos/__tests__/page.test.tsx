import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import PedidosPage from "../page";
import { usePedidosListagem } from "@/features/pedidos/hooks/usePedidosListagem";

vi.mock("@/features/pedidos/hooks/usePedidosListagem");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/features/pedidos/components/PedidosTable", () => ({
  PedidosTable: () => <div data-testid="pedidos-table" />,
}));
vi.mock("@/features/pedidos/components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

describe("PedidosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir loader durante o carregamento", () => {
    (usePedidosListagem as Mock).mockReturnValue({
      loading: true,
      pedidos: [],
      totalCount: 0,
      searchTerm: "",
      erro: null,
    });

    const { container } = render(<PedidosPage />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve mostrar mensagem específica quando a busca não retorna resultados", () => {
    (usePedidosListagem as Mock).mockReturnValue({
      loading: false,
      pedidos: [],
      searchTerm: "Busca Inexistente",
      erro: null,
    });

    render(<PedidosPage />);
    expect(
      screen.getByText("Nenhum pedido encontrado para esta busca"),
    ).toBeInTheDocument();
  });

  it("deve mostrar mensagem padrão quando não há pedidos no sistema", () => {
    (usePedidosListagem as Mock).mockReturnValue({
      loading: false,
      pedidos: [],
      searchTerm: "",
      erro: null,
    });

    render(<PedidosPage />);
    expect(
      screen.getByText("Nenhum pedido disponível no momento"),
    ).toBeInTheDocument();
  });

  it("deve renderizar a tabela e paginação em caso de sucesso", () => {
    (usePedidosListagem as Mock).mockReturnValue({
      loading: false,
      pedidos: [{ id: "1" }],
      totalCount: 1,
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      startIndex: 0,
      erro: null,
    });

    render(<PedidosPage />);
    expect(screen.getByTestId("pedidos-table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });
});
