import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import DetalhePedidoPage from "../page";
import { usePedidoDetalhes } from "@/features/pedidos/hooks/usePedidoDetalhes";
import { useParams } from "next/navigation";

vi.mock("@/features/pedidos/hooks/usePedidoDetalhes");
vi.mock("next/navigation");

describe("DetalhePedidoPage", () => {
  const mockId = "order-123";

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as Mock).mockReturnValue({ id: mockId });
  });

  it("deve exibir loader durante o carregamento", () => {
    (usePedidoDetalhes as Mock).mockReturnValue({
      pedido: null,
      loading: true,
      erro: null,
    });

    const { container } = render(<DetalhePedidoPage />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro se houver falha", () => {
    (usePedidoDetalhes as Mock).mockReturnValue({
      pedido: null,
      loading: false,
      erro: "Pedido não encontrado",
    });

    render(<DetalhePedidoPage />);
    expect(screen.getByText("Pedido não encontrado")).toBeInTheDocument();
  });

  it("deve renderizar os detalhes do pedido em caso de sucesso", () => {
    const mockPedido = {
      id: mockId,
      clienteNome: "João Silva",
      feiraData: "2024-12-25T10:00:00Z",
      status: "Concluído",
      valorTotal: 150.5,
      itens: [
        {
          id: "1",
          itemNome: "Cenoura",
          quantidade: 2,
          precoUnitario: 5.0,
          valorTotal: 10.0,
        },
      ],
    };

    (usePedidoDetalhes as Mock).mockReturnValue({
      pedido: mockPedido,
      loading: false,
      erro: null,
      handlePrint: vi.fn(),
    });

    render(<DetalhePedidoPage />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText(/Nome do Cliente/i)).toBeInTheDocument();
    expect(screen.getByText(/Data do Pedido/i)).toBeInTheDocument();
    expect(screen.getByText("Cenoura")).toBeInTheDocument();
  });
});
