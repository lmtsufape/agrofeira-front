import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CadastrarComerciantePage from "../page";

vi.mock("@/components/ui/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/features/comerciantes/components/ComercianteForm", () => ({
  ComercianteForm: () => <div data-testid="comerciante-form" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CadastrarComerciantePage", () => {
  it("deve renderizar o cabeçalho e o formulário", () => {
    render(<CadastrarComerciantePage />);
    expect(screen.getByText("Cadastrar Comerciante")).toBeInTheDocument();
    expect(screen.getByTestId("comerciante-form")).toBeInTheDocument();
  });
});
