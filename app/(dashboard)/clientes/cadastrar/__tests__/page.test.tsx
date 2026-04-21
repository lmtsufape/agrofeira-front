import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CadastrarClientePage from "../page";

vi.mock("@/components/ui/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/features/clientes/components/ClienteForm", () => ({
  ClienteForm: () => <div data-testid="cliente-form" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CadastrarClientePage", () => {
  it("deve renderizar o cabeçalho e o formulário", () => {
    render(<CadastrarClientePage />);
    expect(screen.getByText("Cadastrar Cliente")).toBeInTheDocument();
    expect(screen.getByTestId("cliente-form")).toBeInTheDocument();
  });
});
