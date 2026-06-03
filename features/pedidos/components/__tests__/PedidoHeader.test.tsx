import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
import { PedidoHeader } from "../PedidoHeader";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("PedidoHeader", () => {
  const mockOnPrint = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: vi.fn() });
  });

  it("deve renderizar o título e o status corretamente", () => {
    render(<PedidoHeader status="ENTREGUE" onPrint={mockOnPrint} />);

    expect(screen.getByText("Detalhes do Pedido")).toBeInTheDocument();
    expect(screen.getByText("Entregue")).toBeInTheDocument();
  });

  it("deve disparar onPrint ao clicar no botão de imprimir", () => {
    render(<PedidoHeader status="PENDENTE" onPrint={mockOnPrint} />);

    fireEvent.click(screen.getByText("Imprimir Recibo"));
    expect(mockOnPrint).toHaveBeenCalledTimes(1);
  });
});
