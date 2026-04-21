import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BancaItemTable } from "../BancaItemTable";
import { type EstoqueBancaDTO } from "@/features/feiras/api/types";

describe("BancaItemTable", () => {
  const mockBanca: EstoqueBancaDTO = {
    id: "1",
    comercianteId: "c1",
    comercianteNome: "Banca do João",
    itens: [
      { id: "i1", itemNome: "Item A", quantidadeDisponivel: 10, precoBase: 5 },
      { id: "i2", itemNome: "Item B", quantidadeDisponivel: 2, precoBase: 10 },
    ],
  };

  it("deve calcular e renderizar os totais corretamente (ajustado para duplicidade Desktop/Mobile)", () => {
    render(<BancaItemTable banca={mockBanca} />);

    // Verifica presença (pelo menos um de cada)
    expect(screen.getAllByText("Item A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Item B").length).toBeGreaterThan(0);

    // Verificando os totais
    expect(screen.getByText("Resumo da Banca")).toBeInTheDocument();
    expect(screen.getAllByText("12").length).toBeGreaterThan(0); // Qtd total
    expect(screen.getAllByText(/R\$\s?70,00/).length).toBeGreaterThan(0);
  });

  it("deve lidar com banca sem itens", () => {
    const emptyBanca = { ...mockBanca, itens: [] };
    render(<BancaItemTable banca={emptyBanca} />);

    expect(screen.queryByText("Item A")).not.toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s?0,00/).length).toBeGreaterThan(0);
  });
});
