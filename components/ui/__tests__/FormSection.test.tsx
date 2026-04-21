import { render, screen } from "@testing-library/react";
import { FormSection } from "../FormSection";

describe("FormSection", () => {
  it("deve renderizar título, ícone e filhos", () => {
    render(
      <FormSection icon={<span data-testid="icon" />} title="Dados do Usuário">
        <input data-testid="child-input" />
      </FormSection>,
    );

    expect(screen.getByText("Dados do Usuário")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });

  it("deve renderizar subtítulo se fornecido", () => {
    render(
      <FormSection icon={null} title="Título" subtitle="Informações básicas">
        <div />
      </FormSection>,
    );

    expect(screen.getByText("Informações básicas")).toBeInTheDocument();
  });
});
