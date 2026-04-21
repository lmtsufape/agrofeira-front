import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Page from "../page";

vi.mock("@/features/pagamentos/components/RepassesComerciantes", () => ({
  RepassesComerciantes: () => (
    <div data-testid="repasses-comerciantes">Repasses Comerciantes</div>
  ),
}));

describe("Repasses Comerciantes Page", () => {
  it("deve renderizar o componente RepassesComerciantes", () => {
    render(<Page />);
    expect(screen.getByTestId("repasses-comerciantes")).toBeInTheDocument();
  });
});
