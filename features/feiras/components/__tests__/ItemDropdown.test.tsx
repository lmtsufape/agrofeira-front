import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ItemDropdown } from "../ItemDropdown";

describe("ItemDropdown", () => {
  const mockItens = [{ id: "i1", nome: "Tomate", comerciantes: [{}, {}] }];
  const mockOnSelect = vi.fn();

  it("deve exibir a lista de itens e contagem de comerciantes que o oferecem", () => {
    render(
      <ItemDropdown
        itens={mockItens}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("2 comerciantes")).toBeInTheDocument();
  });
});
