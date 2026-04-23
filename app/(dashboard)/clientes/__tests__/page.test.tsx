import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ClientesPage from "../page";

// Mock do componente ClientesList para isolar o teste da página
vi.mock("@/features/clientes/components/ClientesList", () => ({
  ClientesList: () => (
    <div data-testid="clientes-list">Mocked Clientes List</div>
  ),
}));

describe("ClientesPage", () => {
  it("deve renderizar o componente ClientesList corretamente", () => {
    render(<ClientesPage />);

    const listComponent = screen.getByTestId("clientes-list");
    expect(listComponent).toBeInTheDocument();
    expect(listComponent).toHaveTextContent("Mocked Clientes List");
  });
});
