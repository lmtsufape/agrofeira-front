import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CadastrarItemPage from "../page";

vi.mock("@/components/ui/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/features/itens/components/ItemForm", () => ({
  ItemForm: () => <div data-testid="item-form" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CadastrarItemPage", () => {
  it("deve renderizar o cabeçalho e o formulário", () => {
    render(<CadastrarItemPage />);
    expect(screen.getByText("Cadastrar Item")).toBeInTheDocument();
    expect(screen.getByTestId("item-form")).toBeInTheDocument();
  });
});
