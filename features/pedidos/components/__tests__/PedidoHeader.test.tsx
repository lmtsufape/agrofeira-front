import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PedidoHeader } from "../PedidoHeader";

describe("PedidoHeader", () => {
  const mockOnPrint = vi.fn();

  it("deve renderizar o título e o status corretamente", () => {
    render(<PedidoHeader status="ENTREGUE" onPrint={mockOnPrint} />);

    expect(screen.getByText("Detalhes do Pedido")).toBeInTheDocument();
    expect(screen.getByText("ENTREGUE")).toBeInTheDocument();
  });

  it("deve disparar onPrint ao clicar no botão de imprimir", () => {
    render(<PedidoHeader status="PENDENTE" onPrint={mockOnPrint} />);

    fireEvent.click(screen.getByText("Imprimir Recibo"));
    expect(mockOnPrint).toHaveBeenCalledTimes(1);
  });
});
