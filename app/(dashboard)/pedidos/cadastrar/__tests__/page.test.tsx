import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CadastrarPedidoPage from "../page";

vi.mock("@/features/pedidos/components/SelecionarParticipante", () => ({
  SelecionarParticipante: () => <div data-testid="selecionar-participante" />,
}));

describe("CadastrarPedidoPage", () => {
  it("deve renderizar o componente SelecionarParticipante", () => {
    render(<CadastrarPedidoPage />);
    expect(screen.getByTestId("selecionar-participante")).toBeInTheDocument();
  });
});
