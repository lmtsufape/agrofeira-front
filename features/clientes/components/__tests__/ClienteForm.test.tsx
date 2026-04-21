import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClienteForm } from "../ClienteForm";
import { useCadastrarCliente } from "../../hooks/useCadastrarCliente";

vi.mock("../../hooks/useCadastrarCliente");

describe("ClienteForm Component", () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockHandleCancel = vi.fn();

  const baseHookValue = {
    formData: {
      name: "",
      phone: "",
      email: "",
      cpf: "",
      description: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    handleCancel: mockHandleCancel,
    submitting: false,
    erro: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCadastrarCliente as Mock).mockReturnValue(baseHookValue);
  });

  it("deve renderizar todas as seções e campos obrigatórios", () => {
    render(<ClienteForm />);

    expect(screen.getByText("Dados Pessoais")).toBeInTheDocument();
    expect(screen.getByText("Endereço")).toBeInTheDocument();

    expect(screen.getByLabelText(/Nome \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone \*/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("00000-000")).toBeInTheDocument();
  });

  it("deve chamar handleInputChange ao digitar nos campos", () => {
    render(<ClienteForm />);

    const nameInput = screen.getByLabelText(/Nome \*/i);
    fireEvent.change(nameInput, {
      target: { value: "Maria Oliveira", name: "name" },
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("deve exibir mensagem de erro com animação quando presente no hook", () => {
    (useCadastrarCliente as Mock).mockReturnValue({
      ...baseHookValue,
      erro: "Erro ao salvar cliente",
    });

    render(<ClienteForm />);

    const errorAlert = screen.getByText("Erro ao salvar cliente");
    expect(errorAlert).toBeInTheDocument();
    // O erro é renderizado dentro de uma div que possui a classe animate-shake
    expect(errorAlert.closest(".animate-shake")).toBeInTheDocument();
  });

  it("deve mostrar estado de carregamento no botão de confirmação", () => {
    (useCadastrarCliente as Mock).mockReturnValue({
      ...baseHookValue,
      submitting: true,
    });

    render(<ClienteForm />);

    const submitBtn = screen.getByRole("button", { name: /Salvando.../i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("deve disparar handleCancel ao clicar no botão cancelar", () => {
    render(<ClienteForm />);

    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);

    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it("deve disparar handleSubmit ao submeter o formulário", () => {
    render(<ClienteForm />);

    const form = screen
      .getByRole("button", { name: /Confirmar/i })
      .closest("form");
    if (!form) throw new Error("Form não encontrado");

    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar o select de estados com as opções corretas", () => {
    render(<ClienteForm />);

    const stateSelect = screen.getByLabelText(/Estado/i);
    expect(stateSelect).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PE" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "SP" })).toBeInTheDocument();
  });
});
