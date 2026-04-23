import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ItensPage from "../page";

// Mock do componente ItensList
vi.mock("@/features/itens/components/ItensList", () => ({
  ItensList: () => <div data-testid="itens-list">Mocked Itens List</div>,
}));

describe("ItensPage", () => {
  it("deve renderizar o componente ItensList corretamente", () => {
    render(<ItensPage />);

    const listComponent = screen.getByTestId("itens-list");
    expect(listComponent).toBeInTheDocument();
    expect(listComponent).toHaveTextContent("Mocked Itens List");
  });
});
