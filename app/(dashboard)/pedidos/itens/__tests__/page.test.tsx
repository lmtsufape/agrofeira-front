import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ItensFeiraPage from "../page";

vi.mock("@/features/pedidos/components/SelecionarFeiraEItens", () => ({
  SelecionarFeiraEItens: () => <div data-testid="selecionar-feira-itens" />,
}));

describe("ItensFeiraPage", () => {
  it("deve renderizar o componente SelecionarFeiraEItens", async () => {
    render(<ItensFeiraPage />);
    // O componente está dentro de um Suspense, mas como o mock é síncrono, ele deve aparecer
    expect(screen.getByTestId("selecionar-feira-itens")).toBeInTheDocument();
  });
});
