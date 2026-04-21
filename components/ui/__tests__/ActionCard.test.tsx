import { render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { ActionCard, ActionCardData } from "../ActionCard";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ActionCard", () => {
  const mockPush = vi.fn();
  const mockCard: ActionCardData = {
    label: "Título Teste",
    description: "Descrição de teste para o card",
    accent: "#003d04",
    href: "/teste",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve renderizar o conteúdo corretamente", () => {
    render(<ActionCard card={mockCard} />);
    expect(screen.getByText("Título Teste")).toBeInTheDocument();
    expect(
      screen.getByText("Descrição de teste para o card"),
    ).toBeInTheDocument();
  });

  it("deve navegar para a rota correta ao clicar", () => {
    render(<ActionCard card={mockCard} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/teste");
  });

  it("não deve navegar se estiver desabilitado", () => {
    render(<ActionCard card={mockCard} disabled />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("deve incluir queryString na navegação se fornecida", () => {
    render(<ActionCard card={mockCard} queryString="?id=123" />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/teste?id=123");
  });

  it("deve renderizar a variante de detalhamento corretamente", () => {
    render(
      <ActionCard
        card={{ ...mockCard, sublabel: "Sublabel" }}
        variant="detalhamento"
      />,
    );
    expect(screen.getByText("Sublabel")).toBeInTheDocument();
  });
});
