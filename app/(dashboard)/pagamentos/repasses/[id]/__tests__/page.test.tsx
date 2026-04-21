import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Page from "../page";

vi.mock("@/features/pagamentos/components/RepasseDetalhes", () => ({
  RepasseDetalhes: () => (
    <div data-testid="repasse-detalhes">Repasse Detalhes</div>
  ),
}));

describe("Repasse Detalhes Page", () => {
  it("deve renderizar o componente RepasseDetalhes", () => {
    render(<Page />);
    expect(screen.getByTestId("repasse-detalhes")).toBeInTheDocument();
  });
});
