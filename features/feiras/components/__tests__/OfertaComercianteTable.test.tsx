import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OfertaComercianteTable } from "../OfertaComercianteTable";

describe("OfertaComercianteTable", () => {
  const mockItem = {
    id: "i1",
    nome: "Melancia",
    comerciantes: [
      { id: "com1", nome: "Fazenda A", quantidade: 5, valorUnitario: 20.0 },
      { id: "com2", nome: "Sítio B", quantidade: 3, valorUnitario: 18.5 },
    ],
  };

  it("deve renderizar os comerciantes ofertantes e calcular os totais", () => {
    render(<OfertaComercianteTable item={mockItem} />);

    expect(screen.getAllByText("Fazenda A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sítio B").length).toBeGreaterThan(0);

    // Total de itens: 5 + 3 = 8
    expect(screen.getAllByText("8").length).toBeGreaterThan(0);
    // Valor total: (5*20) + (3*18.5) = 100 + 55.5 = 155.5
    expect(screen.getAllByText(/R\$\s?155,50/).length).toBeGreaterThan(0);
  });
});
