import { render, screen, fireEvent } from "@testing-library/react";
import { SearchableDropdown } from "../SearchableDropdown";
import { vi } from "vitest";

interface MockItem {
  id: string;
  name: string;
}

describe("SearchableDropdown", () => {
  const items: MockItem[] = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
  ];

  const defaultProps = {
    items,
    selected: null,
    onSelect: vi.fn(),
    loading: false,
    icon: () => <svg data-testid="icon" />,
    loadingText: "Carregando...",
    placeholderText: "Selecione um item",
    searchPlaceholder: "Pesquisar...",
    emptyText: "Nenhum item encontrado",
    getSearchableString: (item: MockItem) => item.name,
    getId: (item: MockItem) => item.id,
    renderItem: (item: MockItem) => <span>{item.name}</span>,
    renderSelected: (item: MockItem) => item.name,
  };

  it("deve renderizar o placeholder corretamente", () => {
    render(<SearchableDropdown {...defaultProps} />);
    expect(screen.getByText("Selecione um item")).toBeInTheDocument();
  });

  it("deve abrir o menu ao clicar", () => {
    render(<SearchableDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
  });

  it("deve filtrar itens com base na pesquisa", () => {
    render(<SearchableDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByPlaceholderText("Pesquisar...");
    fireEvent.change(input, { target: { value: "Item 1" } });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });

  it("deve chamar onSelect ao clicar em um item", () => {
    render(<SearchableDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Item 1"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(items[0]);
  });

  it("deve mostrar texto de vazio se nenhum item for encontrado", () => {
    render(<SearchableDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByPlaceholderText("Pesquisar...");
    fireEvent.change(input, { target: { value: "Inexistente" } });
    expect(screen.getByText("Nenhum item encontrado")).toBeInTheDocument();
  });

  it("deve desabilitar e mostrar loading se loading for true", () => {
    render(<SearchableDropdown {...defaultProps} loading={true} />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("deve fechar o menu ao clicar fora", () => {
    render(
      <div>
        <div data-testid="outside">Lado de fora</div>
        <SearchableDropdown {...defaultProps} />
      </div>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(
      screen.queryByPlaceholderText("Pesquisar..."),
    ).not.toBeInTheDocument();
  });
});
