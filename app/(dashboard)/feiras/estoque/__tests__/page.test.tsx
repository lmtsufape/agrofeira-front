import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import EstoqueFeiraPage from "../page";
import { useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@/features/feiras/components/EstoqueFeira", () => ({
  EstoqueFeira: ({ feiraId }: { feiraId: string }) => (
    <div data-testid="estoque-feira" data-feira-id={feiraId} />
  ),
}));

describe("EstoqueFeiraPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o componente EstoqueFeira com o feiraId dos searchParams", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue("f-123"),
    });

    render(<EstoqueFeiraPage />);

    const component = screen.getByTestId("estoque-feira");
    expect(component).toBeInTheDocument();
    expect(component.getAttribute("data-feira-id")).toBe("f-123");
  });

  it("deve renderizar com feiraId vazio se não estiver presente na URL", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });

    render(<EstoqueFeiraPage />);

    const component = screen.getByTestId("estoque-feira");
    expect(component.getAttribute("data-feira-id")).toBe("");
  });
});
