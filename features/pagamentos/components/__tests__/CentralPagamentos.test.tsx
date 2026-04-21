import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { CentralPagamentos } from "../CentralPagamentos";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CentralPagamentos", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve renderizar os cards de opções", () => {
    render(<CentralPagamentos />);
    expect(screen.getByText("Relatórios Financeiros")).toBeInTheDocument();
    expect(screen.getByText("Pagamento aos Comerciantes")).toBeInTheDocument();
  });

  it("deve navegar para relatórios ao clicar no card", () => {
    render(<CentralPagamentos />);
    fireEvent.click(screen.getByText("Relatórios Financeiros"));
    expect(mockPush).toHaveBeenCalledWith("/pagamentos/relatorios");
  });

  it("deve navegar para repasses ao clicar no card", () => {
    render(<CentralPagamentos />);
    fireEvent.click(screen.getByText("Pagamento aos Comerciantes"));
    expect(mockPush).toHaveBeenCalledWith("/pagamentos/repasses");
  });

  it("deve navegar de volta para o dashboard ao clicar no botão de voltar", () => {
    render(<CentralPagamentos />);
    const backBtn = screen.getByRole("button", { name: "" }); // O botão com ícone ArrowLeft
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
