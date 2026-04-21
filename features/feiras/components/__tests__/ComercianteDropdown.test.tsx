import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComercianteDropdown } from "../ComercianteDropdown";

describe("ComercianteDropdown", () => {
  const mockBancas = [
    {
      comercianteId: "com1",
      comercianteNome: "Banca do Zé",
      itens: [{}, {}],
      id: "1",
    },
  ];
  const mockOnSelect = vi.fn();

  it("deve exibir a lista de bancas e contagem de itens cadastrados", () => {
    render(
      <ComercianteDropdown
        bancas={mockBancas}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Banca do Zé")).toBeInTheDocument();
    expect(screen.getByText("2 itens cadastrados")).toBeInTheDocument();
  });
});
