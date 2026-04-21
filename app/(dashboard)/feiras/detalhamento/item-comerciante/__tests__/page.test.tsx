import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import ItemComerciantePage from "../page";
import { useDetalhamentoItem } from "@/features/feiras/hooks/useDetalhamentoItem";
import { useAuth } from "@/features/auth/contexts/AuthContext";

vi.mock("@/features/feiras/hooks/useDetalhamentoItem");
vi.mock("@/features/auth/contexts/AuthContext");
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ feiraId: "123" }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

vi.mock("@/features/feiras/components/ItemDropdown", () => ({
  ItemDropdown: () => <div data-testid="item-dropdown" />,
}));
vi.mock("@/features/feiras/components/OfertaComercianteTable", () => ({
  OfertaComercianteTable: () => <div data-testid="oferta-table" />,
}));

describe("ItemComerciantePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ token: "test-token" });
  });

  it("deve mostrar estado vazio se nenhum item estiver selecionado", () => {
    (useDetalhamentoItem as Mock).mockReturnValue({
      itens: [{ id: "1" }],
      selected: null,
      loading: false,
      erro: null,
    });

    render(<ItemComerciantePage />);
    expect(screen.getByText("Nenhum item selecionado")).toBeInTheDocument();
  });

  it("deve renderizar a tabela se um item for selecionado", () => {
    (useDetalhamentoItem as Mock).mockReturnValue({
      itens: [{ id: "1" }],
      selected: { id: "1", nome: "Tomate", comerciantes: [] },
      loading: false,
      erro: null,
    });

    render(<ItemComerciantePage />);
    expect(screen.getByTestId("oferta-table")).toBeInTheDocument();
  });
});
