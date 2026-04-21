import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Page from "../page";

vi.mock("@/features/pagamentos/components/RelatoriosFinanceiros", () => ({
  RelatoriosFinanceiros: () => (
    <div data-testid="relatorios-financeiros">Relatórios Financeiros</div>
  ),
}));

describe("Relatórios Financeiros Page", () => {
  it("deve renderizar o componente RelatoriosFinanceiros", () => {
    render(<Page />);
    expect(screen.getByTestId("relatorios-financeiros")).toBeInTheDocument();
  });
});
