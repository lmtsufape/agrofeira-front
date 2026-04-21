import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "../Select";
import { vi } from "vitest";

describe("Select", () => {
  const options = [
    { value: "1", label: "Opção 1" },
    { value: "2", label: "Opção 2" },
  ];

  it("deve renderizar com label e opções", () => {
    render(<Select label="Selecione" options={options} />);
    expect(screen.getByText("Selecione")).toBeInTheDocument();
    expect(screen.getByText("Opção 1")).toBeInTheDocument();
    expect(screen.getByText("Opção 2")).toBeInTheDocument();
  });

  it("deve permitir alteração de valor", () => {
    const handleChange = vi.fn();
    render(<Select options={options} onChange={handleChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });
    expect(handleChange).toHaveBeenCalled();
    expect((select as HTMLSelectElement).value).toBe("2");
  });

  it("deve exibir mensagem de erro", () => {
    render(<Select options={options} error="Erro no campo" />);
    expect(screen.getByText("Erro no campo")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveClass("border-red-500");
  });

  it("deve estar desabilitado se a prop disabled for passada", () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
