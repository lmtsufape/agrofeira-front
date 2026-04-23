import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ComerciantesPage from "../page";

// Mock do componente ComerciantesList
vi.mock("@/features/comerciantes/components/ComerciantesList", () => ({
  ComerciantesList: () => (
    <div data-testid="comerciantes-list">Mocked Comerciantes List</div>
  ),
}));

describe("ComerciantesPage", () => {
  it("deve renderizar o componente ComerciantesList corretamente", () => {
    render(<ComerciantesPage />);

    const listComponent = screen.getByTestId("comerciantes-list");
    expect(listComponent).toBeInTheDocument();
    expect(listComponent).toHaveTextContent("Mocked Comerciantes List");
  });
});
