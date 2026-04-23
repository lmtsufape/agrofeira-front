import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClienteEdit } from "../ClienteEdit";
import { useCliente } from "../../hooks/useCliente";
import { useRouter } from "next/navigation";

// Mock do hook useCliente
vi.mock("../../hooks/useCliente", () => ({
  useCliente: vi.fn(),
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ClienteEdit Component", () => {
  const mockId = "client-123";
  const mockBack = vi.fn();
  const mockHandleFormChange = vi.fn();
  const mockSaveChanges = vi.fn();

  const defaultHookReturn = {
    cliente: null,
    formData: {
      nome: "",
      telefone: "",
      descricao: "",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    loading: false,
    error: null,
    savingChanges: false,
    handleFormChange: mockHandleFormChange,
    saveChanges: mockSaveChanges,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ back: mockBack, push: vi.fn() });
  });

  it("deve exibir estado de carregamento inicial", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    render(<ClienteEdit clienteId={mockId} />);
    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro se o cliente não for encontrado", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      error: "Cliente não encontrado",
    });

    render(<ClienteEdit clienteId={mockId} />);
    expect(screen.getByText("Cliente não encontrado")).toBeInTheDocument();
  });

  it("deve renderizar o formulário com dados do cliente", () => {
    const mockCliente = { id: mockId, nome: "João Silva" };
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: mockCliente,
      formData: { ...defaultHookReturn.formData, nome: "João Silva" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    expect(screen.getByText("Gerenciar Cliente")).toBeInTheDocument();
    const nomeInput = screen.getByDisplayValue("João Silva");
    expect(nomeInput).toBeInTheDocument();
  });

  it("deve chamar handleFormChange quando um campo é editado", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
      formData: { ...defaultHookReturn.formData, nome: "João" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    const nomeInput = screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(nomeInput, { target: { value: "João Silva" } });

    expect(mockHandleFormChange).toHaveBeenCalledWith("nome", "João Silva");
  });

  it("deve chamar saveChanges ao clicar no botão confirmar", async () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    expect(mockSaveChanges).toHaveBeenCalled();
  });

  it("deve exibir 'Salvando...' e desabilitar botões durante a submissão", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
      savingChanges: true,
    });

    render(<ClienteEdit clienteId={mockId} />);

    expect(screen.getByText("Salvando...")).toBeInTheDocument();
    expect(screen.getByText("Salvando...")).toBeDisabled();
    expect(screen.getByText("Cancelar")).toBeDisabled();
  });

  it("deve voltar ao clicar no botão de voltar", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    // O primeiro botão costuma ser o de voltar no layout (ArrowLeft)
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // O primeiro botão é o voltar (ArrowLeft)

    expect(mockBack).toHaveBeenCalled();
  });

  it("deve disparar alert se houver erro ao salvar", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    mockSaveChanges.mockRejectedValue(new Error("Erro ao salvar"));

    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
      saveChanges: mockSaveChanges,
    });

    render(<ClienteEdit clienteId={mockId} />);

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Erro ao salvar");
    });

    alertMock.mockRestore();
  });
});
