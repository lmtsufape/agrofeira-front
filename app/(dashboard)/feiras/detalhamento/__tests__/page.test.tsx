import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DetalheFeiraPage from "../page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ feiraId: "123" }),
  useRouter: vi.fn(),
}));

describe("DetalheFeiraPage", () => {
  it("deve renderizar as opções de detalhamento", () => {
    render(<DetalheFeiraPage />);

    expect(screen.getByText("Detalhamento Feira")).toBeInTheDocument();
    expect(
      screen.getByText(/Selecione o tipo de detalhamento/i),
    ).toBeInTheDocument();

    // Verifica se os cards de opções estão presentes (Ex: Visão Geral)
    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
  });
});
