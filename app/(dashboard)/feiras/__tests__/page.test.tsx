import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import GerenciarFeiraPage from "../page";
import { useFeiras } from "@/features/feiras/hooks/useFeiras";

vi.mock("@/features/feiras/hooks/useFeiras");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock do Dropdown para isolar a página
vi.mock("@/features/feiras/components/FeiraDropdown", () => ({
  default: () => <div data-testid="feira-dropdown" />,
}));

describe("GerenciarFeiraPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve desabilitar os cards de ação se nenhuma feira estiver selecionada", () => {
    (useFeiras as Mock).mockReturnValue({
      feiras: [],
      selected: null,
      loading: false,
      isFeiraSelected: false,
    });

    render(<GerenciarFeiraPage />);

    // As opções de gestão devem estar desabilitadas
    const buttons = screen.getAllByRole("button");
    // O primeiro botão é do Dropdown (ou PageHeader), os demais são ActionCards
    // Verificamos se algum ActionCard está desabilitado
    const actionCards = buttons.filter((b) =>
      b.classList.contains("cursor-not-allowed"),
    );
    expect(actionCards.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Selecione uma feira para continuar/i),
    ).toBeInTheDocument();
  });

  it("deve mostrar badge da data se uma feira estiver selecionada", () => {
    const mockFeira = { id: "1", dataHora: "2024-12-25T10:00:00Z" };
    (useFeiras as Mock).mockReturnValue({
      feiras: [mockFeira],
      selected: mockFeira,
      loading: false,
      isFeiraSelected: true,
    });

    render(<GerenciarFeiraPage />);
    expect(screen.getByText("25/12/2024")).toBeInTheDocument();
    expect(screen.getByText(/O que deseja fazer?/i)).toBeInTheDocument();
  });
});
