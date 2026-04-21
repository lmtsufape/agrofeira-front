import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../Input";
import { vi } from "vitest";

describe("Input", () => {
  it("deve renderizar com label", () => {
    render(<Input label="Nome" />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
  });

  it("deve permitir digitação", () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Digite seu nome" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Digite seu nome");
    fireEvent.change(input, { target: { value: "João" } });
    expect(handleChange).toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("João");
  });

  it("deve exibir mensagem de erro", () => {
    render(<Input error="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-red-500");
  });

  it("deve renderizar ícone e elemento à direita", () => {
    render(
      <Input
        icon={<span data-testid="left-icon" />}
        rightElement={<button data-testid="right-btn">Ver</button>}
      />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-btn")).toBeInTheDocument();
  });

  it("deve estar desabilitado se a prop disabled for passada", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
