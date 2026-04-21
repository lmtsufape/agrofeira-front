import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Page from "../page";

vi.mock("@/features/pagamentos/components/CentralPagamentos", () => ({
  CentralPagamentos: () => (
    <div data-testid="central-pagamentos">Central Pagamentos</div>
  ),
}));

describe("Pagamentos Page", () => {
  it("deve renderizar o componente CentralPagamentos", () => {
    render(<Page />);
    expect(screen.getByTestId("central-pagamentos")).toBeInTheDocument();
  });
});
