import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResumoPage from "../page";

vi.mock("@/features/pedidos/components/ResumoPedido", () => ({
  ResumoPedido: () => <div data-testid="resumo-pedido" />,
}));

describe("ResumoPage", () => {
  it("deve renderizar o componente ResumoPedido", () => {
    render(<ResumoPage />);
    expect(screen.getByTestId("resumo-pedido")).toBeInTheDocument();
  });
});
