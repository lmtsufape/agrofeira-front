import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ClienteDropdown } from "../ClienteDropdown";

describe("ClienteDropdown", () => {
  const mockClientes = [
    {
      clienteId: "c1",
      clienteNome: "João Silva",
      itens: [{}, {}],
      pedidos: [],
      totalGeral: 0,
    },
    {
      clienteId: "c2",
      clienteNome: "Maria Souza",
      itens: [{}],
      pedidos: [],
      totalGeral: 0,
    },
  ];
  const mockOnSelect = vi.fn();

  it("deve renderizar o placeholder quando não houver seleção", () => {
    render(
      <ClienteDropdown
        clientes={[]}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
      />,
    );
    expect(screen.getByText("Selecione o Cliente")).toBeInTheDocument();
  });

  it("deve exibir a lista de clientes e seus contadores de itens", () => {
    render(
      <ClienteDropdown
        clientes={mockClientes}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("2 itens pedidos")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
    expect(screen.getByText("1 item pedido")).toBeInTheDocument();
  });

  it("deve exibir estado de carregamento", () => {
    render(
      <ClienteDropdown
        clientes={[]}
        selected={null}
        onSelect={mockOnSelect}
        loading={true}
      />,
    );
    expect(screen.getByText("Carregando clientes...")).toBeInTheDocument();
  });
});
