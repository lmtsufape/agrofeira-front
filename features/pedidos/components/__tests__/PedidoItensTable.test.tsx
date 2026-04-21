import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PedidoItensTable } from "../PedidoItensTable";

describe("PedidoItensTable", () => {
  const mockItens = [
    {
      id: "1",
      itemNome: "Cenoura",
      quantidade: 2,
      valorUnitario: 5.0,
      valorTotal: 10.0,
      itemId: "i1",
    },
    {
      id: "2",
      itemNome: "Alface",
      quantidade: 1,
      valorUnitario: 3.5,
      valorTotal: 3.5,
      itemId: "i2",
    },
  ];

  it("deve renderizar a lista de itens e o valor total corretamente", () => {
    render(<PedidoItensTable itens={mockItens} total={13.5} />);

    expect(screen.getByText("Cenoura")).toBeInTheDocument();
    expect(screen.getByText("Alface")).toBeInTheDocument();

    // Valores formatados
    expect(screen.getByText(/R\$\s?10,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?3,50/)).toBeInTheDocument();

    // Valor total
    expect(screen.getByText("Valor Total")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?13,50/)).toBeInTheDocument();
  });
});
