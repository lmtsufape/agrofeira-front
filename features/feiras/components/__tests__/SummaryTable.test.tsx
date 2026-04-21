import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SummaryTable } from "../SummaryTable";

describe("SummaryTable", () => {
  const mockData = [
    { id: "1", nome: "Item 1" },
    { id: "2", nome: "Item 2" },
  ];
  const mockOnClick = vi.fn();

  it("deve renderizar a lista de itens e o cabeçalho corretamente", () => {
    render(
      <SummaryTable type="item" data={mockData} onDetailClick={mockOnClick} />,
    );

    expect(screen.getByText(/Itens \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("deve disparar onDetailClick ao clicar no botão", () => {
    render(
      <SummaryTable
        type="comerciante"
        data={mockData}
        onDetailClick={mockOnClick}
      />,
    );

    const buttons = screen.getAllByText("Detalhar");
    fireEvent.click(buttons[0]);

    expect(mockOnClick).toHaveBeenCalledWith("comerciante", "1");
  });

  it("deve exibir mensagem de estado vazio", () => {
    render(
      <SummaryTable type="cliente" data={[]} onDetailClick={mockOnClick} />,
    );

    expect(screen.getByText("Nenhum dado disponível")).toBeInTheDocument();
  });
});
