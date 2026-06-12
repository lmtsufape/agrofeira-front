import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClienteEdit } from "../ClienteEdit";
import { useCliente } from "../../hooks/useCliente";
import { useRouter } from "next/navigation";
import { useZonasEntrega } from "../../hooks/useZonasEntrega";

// Mock do hook useCliente
vi.mock("../../hooks/useCliente", () => ({
  useCliente: vi.fn(),
}));

// Mock do useZonasEntrega
vi.mock("../../hooks/useZonasEntrega", () => ({
  useZonasEntrega: vi.fn(),
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
  const mockSetFormData = vi.fn();

  const defaultHookReturn = {
    cliente: null,
    formData: {
      nome: "",
      telefone: "",
      email: "",
      descricao: "",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "Garanhuns",
      estado: "PE",
      zonaEntregaId: "z1",
    },
    setFormData: mockSetFormData,
    loading: false,
    error: null,
    savingChanges: false,
    handleFormChange: mockHandleFormChange,
    saveChanges: mockSaveChanges,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("alert", vi.fn());
    (useRouter as Mock).mockReturnValue({ back: mockBack, push: vi.fn() });
    (useZonasEntrega as Mock).mockReturnValue({
      zonas: [{ id: "z1", nome: "Centro", taxa: 5.0 }],
      isLoading: false,
    });
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

  it("deve renderizar o campo email e permitir edição", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João", email: "joao@email.com" },
      formData: {
        ...defaultHookReturn.formData,
        nome: "João",
        email: "joao@email.com",
      },
    });

    render(<ClienteEdit clienteId={mockId} />);

    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toHaveValue("joao@email.com");

    fireEvent.change(emailInput, { target: { value: "novo@email.com" } });
    expect(mockHandleFormChange).toHaveBeenCalledWith(
      "email",
      "novo@email.com",
    );
  });

  it("deve carregar a zona de entrega salva do cliente", () => {
    const mockCliente = {
      id: mockId,
      nome: "João Silva",
      endereco: { zonaEntregaId: "z1" },
    };
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: mockCliente,
      formData: {
        ...defaultHookReturn.formData,
        nome: "João Silva",
        zonaEntregaId: "z1",
      },
    });

    render(<ClienteEdit clienteId={mockId} />);

    const zonaSelect = screen.getByLabelText(/Zona de Entrega/i);
    expect(zonaSelect).toHaveValue("z1");
    expect(
      screen.getByText(/Centro \(R\$ 5,00\) — \(Valor Atual\)/i),
    ).toBeInTheDocument();
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

  it("deve validar cidade como Garanhuns ao salvar", async () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
      formData: { ...defaultHookReturn.formData, cidade: "Recife" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    fireEvent.click(screen.getByText("Confirmar"));

    expect(window.alert).toHaveBeenCalledWith(
      "Apenas clientes de Garanhuns podem ser cadastrados no sistema.",
    );
    expect(mockSaveChanges).not.toHaveBeenCalled();
  });

  it("deve exigir zona de entrega ao salvar", async () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
      formData: { ...defaultHookReturn.formData, zonaEntregaId: "" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    fireEvent.click(screen.getByText("Confirmar"));

    expect(window.alert).toHaveBeenCalledWith(
      "A zona de entrega é obrigatória!",
    );
    expect(mockSaveChanges).not.toHaveBeenCalled();
  });

  it("deve aplicar máscara no CEP ao digitar", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    const cepInput = screen.getByLabelText(/CEP/i);
    fireEvent.change(cepInput, { target: { value: "55290000" } });

    expect(mockHandleFormChange).toHaveBeenCalledWith("cep", "55290-000");
  });

  it("deve buscar endereço ao sair do campo CEP se completo", async () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
    });

    (global.fetch as Mock).mockResolvedValue({
      json: async () => ({
        logradouro: "Rua Teste",
        bairro: "Centro",
        localidade: "Garanhuns",
        uf: "PE",
        erro: false,
      }),
    });

    render(<ClienteEdit clienteId={mockId} />);

    const cepInput = screen.getByLabelText(/CEP/i);
    fireEvent.blur(cepInput, { target: { value: "55290-000" } });

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalled();
    });
  });

  it("deve abrir modal de busca de CEP al clicar na lupa", () => {
    (useCliente as Mock).mockReturnValue({
      ...defaultHookReturn,
      cliente: { id: mockId, nome: "João" },
    });

    render(<ClienteEdit clienteId={mockId} />);

    // O botão com a lupa é o segundo ou terceiro dependendo do layout
    // No código: <button ... title="Não sei meu CEP">
    const searchButton = screen.getByTitle("Não sei meu CEP");
    fireEvent.click(searchButton);

    expect(screen.getByText(/Buscar CEP em Garanhuns/i)).toBeInTheDocument();
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
