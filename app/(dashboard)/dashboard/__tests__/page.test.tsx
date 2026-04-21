import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DashboardPage from "../page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe("DashboardPage", () => {
  it("deve renderizar as seções de cadastrar e gerenciar", () => {
    render(<DashboardPage />);

    // Busca pelo h2 para evitar colisão com o texto dos cards
    expect(
      screen.getByRole("heading", { name: "Cadastrar", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Adicione novos registros ao sistema"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Gerenciar", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Edite e administre os dados existentes"),
    ).toBeInTheDocument();
  });
});
