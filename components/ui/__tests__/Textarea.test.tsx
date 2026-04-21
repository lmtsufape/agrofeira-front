import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "../Textarea";
import { vi } from "vitest";

describe("Textarea", () => {
  it("deve renderizar com label", () => {
    render(<Textarea label="Descrição" />);
    expect(screen.getByText("Descrição")).toBeInTheDocument();
  });

  it("deve permitir digitação", () => {
    const handleChange = vi.fn();
    render(<Textarea placeholder="Digite algo" onChange={handleChange} />);
    const textarea = screen.getByPlaceholderText("Digite algo");
    fireEvent.change(textarea, { target: { value: "Texto longo de teste" } });
    expect(handleChange).toHaveBeenCalled();
    expect((textarea as HTMLTextAreaElement).value).toBe(
      "Texto longo de teste",
    );
  });

  it("deve exibir mensagem de erro", () => {
    render(<Textarea error="Erro detectado" />);
    expect(screen.getByText("Erro detectado")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-red-500");
  });

  it("deve estar desabilitado se a prop disabled for passada", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
