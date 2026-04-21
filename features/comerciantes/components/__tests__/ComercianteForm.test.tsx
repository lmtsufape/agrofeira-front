import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ComercianteForm } from "../ComercianteForm";
import { useCadastrarComerciante } from "../../hooks/useCadastrarComerciante";

vi.mock("../../hooks/useCadastrarComerciante");

describe("ComercianteForm Component", () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockHandleCancel = vi.fn();

  const baseHookValue = {
    formData: {
      name: "",
      phone: "",
      email: "",
      description: "",
    },
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    handleCancel: mockHandleCancel,
    submitting: false,
    erro: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCadastrarComerciante as Mock).mockReturnValue(baseHookValue);
  });

  it("deve renderizar todos os campos e a seção do formulário", () => {
    render(<ComercianteForm />);

    expect(screen.getByText("Dados do Comerciante")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone \*/i)).toBeInTheDocument();
  });

  it("deve chamar handleInputChange ao alterar valores dos campos", () => {
    render(<ComercianteForm />);

    const nameInput = screen.getByLabelText(/Nome \*/i);
    fireEvent.change(nameInput, {
      target: { value: "João da Silva", name: "name" },
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("deve exibir alerta de erro quando houver erro no hook", () => {
    (useCadastrarComerciante as Mock).mockReturnValue({
      ...baseHookValue,
      erro: "Falha ao cadastrar",
    });

    render(<ComercianteForm />);

    const errorAlert = screen.getByText("Falha ao cadastrar");
    expect(errorAlert).toBeInTheDocument();
    // Busca o elemento com a animação de erro de forma flexível
    expect(errorAlert.closest(".animate-shake")).toBeInTheDocument();
  });

  it("deve desabilitar o botão e mostrar texto de carregamento durante submissão", () => {
    (useCadastrarComerciante as Mock).mockReturnValue({
      ...baseHookValue,
      submitting: true,
    });

    render(<ComercianteForm />);

    const submitBtn = screen.getByRole("button", { name: /Salvando.../i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("deve disparar handleCancel ao clicar no botão cancelar", () => {
    render(<ComercianteForm />);

    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);

    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it("deve disparar handleSubmit ao submeter o formulário", () => {
    render(<ComercianteForm />);

    const form = screen
      .getByRole("button", { name: /Confirmar/i })
      .closest("form");
    if (!form) throw new Error("Form não encontrado");

    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });
});
