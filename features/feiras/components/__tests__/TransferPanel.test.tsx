import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Panel } from "../TransferPanel";

describe("TransferPanel (Panel)", () => {
  const items = [
    { id: "1", label: "Item 1" },
    { id: "2", label: "Item 2" },
  ];
  const onSelect = vi.fn();

  it("deve renderizar a lista de itens", () => {
    render(
      <Panel
        items={items}
        selected={[]}
        onSelect={onSelect}
        gradient="bg-blue-500"
      />,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("deve destacar itens selecionados", () => {
    render(
      <Panel
        items={items}
        selected={["1"]}
        onSelect={onSelect}
        gradient="bg-blue-500"
      />,
    );
    // O botão selecionado deve ter a classe do gradiente
    const selectedBtn = screen.getByText("Item 1").closest("button");
    expect(selectedBtn).toHaveClass("bg-blue-500");
  });

  it("deve exibir estado de carregamento", () => {
    render(
      <Panel
        items={[]}
        selected={[]}
        onSelect={onSelect}
        gradient="bg-blue-500"
        loading
      />,
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve exibir estado vazio", () => {
    render(
      <Panel
        items={[]}
        selected={[]}
        onSelect={onSelect}
        gradient="bg-blue-500"
      />,
    );
    expect(screen.getByText("Nenhum item")).toBeInTheDocument();
  });

  it("deve disparar onSelect ao clicar no item", () => {
    render(
      <Panel
        items={items}
        selected={[]}
        onSelect={onSelect}
        gradient="bg-blue-500"
      />,
    );
    fireEvent.click(screen.getByText("Item 1"));
    expect(onSelect).toHaveBeenCalledWith("1");
  });
});
