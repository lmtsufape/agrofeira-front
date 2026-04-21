import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
import { PedidosTable } from "../PedidosTable";
import { type PedidoDTO } from "@/features/pedidos/api/types";
import { useRouter } from "next/navigation";

// Mock do useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("PedidosTable", () => {
  const mockPush = vi.fn();
  const mockPedidos: PedidoDTO[] = [
    {
      id: "ped-123456",
      clienteNome: "João da Silva",
      feiraData: "2024-12-25T10:00:00Z",
      status: "ENTREGUE",
      valorTotal: 150.0,
      clienteId: "c1",
      feiraId: "f1",
      comercianteVendedorId: "com1",
      comercianteVendedorNome: "Banca A",
      tipoRetirada: "ENTREGA",
      taxaEntrega: 10,
      valorProdutos: 140,
      itens: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve renderizar a tabela com os dados do pedido", () => {
    render(<PedidosTable pedidos={mockPedidos} />);

    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    // A lógica de iniciais pegou JD (provavelmente João Da)
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("ENTREGUE")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?150,00/)).toBeInTheDocument();
    expect(screen.getByText(/ID: #123456/i)).toBeInTheDocument();
  });

  it("deve navegar para os detalhes ao clicar no ícone de olho", () => {
    render(<PedidosTable pedidos={mockPedidos} />);

    const viewButton = screen.getByTitle("Ver Detalhes");
    fireEvent.click(viewButton);

    expect(mockPush).toHaveBeenCalledWith("/pedidos/ped-123456");
  });
});
