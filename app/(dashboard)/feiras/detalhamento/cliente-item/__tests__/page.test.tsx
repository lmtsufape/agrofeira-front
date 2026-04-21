import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import ClienteItemPage from "../page";
import { useDetalhamentoCliente } from "@/features/feiras/hooks/useDetalhamentoCliente";
import { useAuth } from "@/features/auth/contexts/AuthContext";

vi.mock("@/features/feiras/hooks/useDetalhamentoCliente");
vi.mock("@/features/auth/contexts/AuthContext");
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ feiraId: "123" }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

// Mock dos componentes filhos
vi.mock("@/features/feiras/components/ClienteDropdown", () => ({
  ClienteDropdown: () => <div data-testid="cliente-dropdown" />,
}));
vi.mock("@/features/feiras/components/ItemTable", () => ({
  ItemTable: () => <div data-testid="item-table" />,
}));

describe("ClienteItemPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ token: "test-token" });
  });

  it("deve mostrar estado vazio se nenhum cliente estiver selecionado", () => {
    (useDetalhamentoCliente as Mock).mockReturnValue({
      clientes: [{ id: "1" }],
      selected: null,
      loading: false,
      erro: null,
    });

    render(<ClienteItemPage />);
    expect(screen.getByText("Nenhum cliente selecionado")).toBeInTheDocument();
  });

  it("deve renderizar a tabela se um cliente for selecionado", () => {
    (useDetalhamentoCliente as Mock).mockReturnValue({
      clientes: [{ id: "1" }],
      selected: { id: "1", clienteNome: "João", itens: [] },
      loading: false,
      erro: null,
    });

    render(<ClienteItemPage />);
    expect(screen.getByTestId("item-table")).toBeInTheDocument();
  });
});
