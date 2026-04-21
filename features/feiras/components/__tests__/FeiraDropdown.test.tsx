import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FeiraDropdown from "../FeiraDropdown";

describe("FeiraDropdown", () => {
  const mockFeiras = [
    {
      id: "1",
      dataHora: "2024-01-01T10:00:00Z",
      status: "ABERTA_PEDIDOS",
      comerciantes: [],
      itens: [],
    },
    {
      id: "2",
      dataHora: "2024-02-01T10:00:00Z",
      status: "FINALIZADA",
      comerciantes: [],
      itens: [],
    },
  ];
  const mockOnSelect = vi.fn();

  it("deve renderizar o placeholder inicial", () => {
    render(
      <FeiraDropdown
        feiras={[]}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
        error={null}
      />,
    );
    expect(screen.getByText("Selecione a Feira")).toBeInTheDocument();
  });

  it("deve abrir a lista ao clicar e mostrar as feiras", async () => {
    render(
      <FeiraDropdown
        feiras={mockFeiras}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
        error={null}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    // Verificando a renderização das datas formatadas (usando regex flexível por causa da formatação do pt-BR)
    expect(screen.getAllByText(/01\/01\/2024/)).toHaveLength(1);
    expect(screen.getAllByText(/01\/02\/2024/)).toHaveLength(1);
  });

  it("deve disparar onSelect ao escolher uma feira", () => {
    render(
      <FeiraDropdown
        feiras={mockFeiras}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
        error={null}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText(/01\/01\/2024/));

    expect(mockOnSelect).toHaveBeenCalledWith(mockFeiras[0]);
  });

  it("deve exibir estado de erro", () => {
    render(
      <FeiraDropdown
        feiras={[]}
        selected={null}
        onSelect={mockOnSelect}
        loading={false}
        error="Erro crítico"
      />,
    );
    expect(screen.getByText("Erro ao carregar feiras")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
