import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PedidoItensTable } from "../PedidoItensTable";

describe("PedidoItensTable", () => {
  const mockItens = [
    {
      produtoId: "i1",
      nomeItem: "Cenoura",
      unidadeMedida: "kg",
      quantidade: 2,
      valorUnitario: 5.0,
      valorTotal: 10.0,
    },
    {
      produtoId: "i2",
      nomeItem: "Alface",
      unidadeMedida: "un",
      quantidade: 1,
      valorUnitario: 3.5,
      valorTotal: 3.5,
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
