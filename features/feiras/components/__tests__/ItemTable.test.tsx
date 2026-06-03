import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ItemTable } from "../ItemTable";

describe("ItemTable", () => {
  const mockCliente = {
    clienteNome: "João",
    itens: [
      {
        produtoId: "it1",
        nomeItem: "Alface",
        unidadeMedida: "un",
        quantidade: 2,
        valorUnitario: 3.5,
        valorTotal: 7.0,
      },
      {
        produtoId: "it2",
        nomeItem: "Tomate",
        unidadeMedida: "un",
        quantidade: 1,
        valorUnitario: 8.0,
        valorTotal: 8.0,
      },
    ],
    totalGeral: 15.0,
    pedidos: [],
  };

  it("deve renderizar os itens do pedido e calcular o total de itens corretamente", () => {
    render(<ItemTable cliente={mockCliente} />);

    expect(screen.getAllByText("Alface").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tomate").length).toBeGreaterThan(0);

    // Verificando resumo no rodapé
    expect(screen.getByText("Resumo do Pedido")).toBeInTheDocument();
    // Qtd total: 2 + 1 = 3
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    // Total Geral formatado
    expect(screen.getAllByText(/R\$\s?15,00/).length).toBeGreaterThan(0);
  });
});
