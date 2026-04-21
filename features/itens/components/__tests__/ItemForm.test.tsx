import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ItemForm } from "../ItemForm";
import { useCadastrarItem } from "../../hooks/useCadastrarItem";

vi.mock("../../hooks/useCadastrarItem");

describe("ItemForm Component", () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockHandleCancel = vi.fn();

  const baseHookValue = {
    formData: {
      name: "",
      unit: "",
      price: "",
      categoriaId: "",
    },
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    handleCancel: mockHandleCancel,
    submitting: false,
    erro: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCadastrarItem as Mock).mockReturnValue(baseHookValue);
  });

  it("deve renderizar todos os campos e a seção de detalhes do produto", () => {
    render(<ItemForm />);

    expect(screen.getByText("Detalhes do Produto")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome do Item \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unidade de Medida \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preço Base \*/i)).toBeInTheDocument();
  });

  it("deve chamar handleInputChange ao alterar valores dos campos", () => {
    render(<ItemForm />);

    const nameInput = screen.getByLabelText(/Nome do Item \*/i);
    fireEvent.change(nameInput, {
      target: { value: "Melancia", name: "name" },
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("deve exibir as opções de unidade de medida corretamente", () => {
    render(<ItemForm />);

    expect(
      screen.getByRole("option", { name: /Quilograma \(kg\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Unidade \(un\)/i }),
    ).toBeInTheDocument();
  });

  it("deve exibir alerta de erro com animação quando houver falha", () => {
    (useCadastrarItem as Mock).mockReturnValue({
      ...baseHookValue,
      erro: "Preencha todos os campos obrigatórios",
    });

    render(<ItemForm />);

    const errorAlert = screen.getByText(
      "Preencha todos os campos obrigatórios",
    );
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert.closest(".animate-shake")).toBeInTheDocument();
  });

  it("deve desabilitar o botão e mostrar feedback de carregamento durante a submissão", () => {
    (useCadastrarItem as Mock).mockReturnValue({
      ...baseHookValue,
      submitting: true,
    });

    render(<ItemForm />);

    const submitBtn = screen.getByRole("button", { name: /Salvando.../i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("deve disparar handleCancel ao clicar no botão cancelar", () => {
    render(<ItemForm />);

    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);

    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it("deve disparar handleSubmit ao submeter o formulário", () => {
    render(<ItemForm />);

    const form = screen
      .getByRole("button", { name: /Confirmar/i })
      .closest("form");
    if (!form) throw new Error("Form não encontrado");

    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });
});
