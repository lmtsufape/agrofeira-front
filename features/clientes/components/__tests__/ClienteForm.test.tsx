import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClienteForm } from "../ClienteForm";
import { clienteService } from "../../api/clientes.service";
import { useRouter } from "next/navigation";
import { useZonasEntrega } from "../../hooks/useZonasEntrega";

// Mock do service
vi.mock("../../api/clientes.service", () => ({
  clienteService: {
    create: vi.fn(),
  },
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock do useZonasEntrega
vi.mock("../../hooks/useZonasEntrega", () => ({
  useZonasEntrega: vi.fn(),
}));

describe("ClienteForm Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();
  const mockZonas = [
    { id: "z1", nome: "Centro", taxa: 5.0 },
    { id: "z2", nome: "Boa Vista", taxa: 7.0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
    (useZonasEntrega as Mock).mockReturnValue({
      zonas: mockZonas,
      isLoading: false,
    });
  });

  it("deve renderizar os campos corretamente", () => {
    render(<ClienteForm />);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zona de Entrega/i)).toBeInTheDocument();
  });

  it("deve validar que o nome e zona são obrigatórios", async () => {
    const { container } = render(<ClienteForm />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("O nome é obrigatório!")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Teste" },
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("A zona de entrega é obrigatória!"),
      ).toBeInTheDocument();
    });

    expect(clienteService.create).not.toHaveBeenCalled();
  });

  it("deve enviar o formulário com dados mínimos e gerar senha aleatória", async () => {
    const mockCreate = clienteService.create as Mock;
    mockCreate.mockResolvedValue({});

    render(<ClienteForm />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Cliente de Teste" },
    });

    fireEvent.change(screen.getByLabelText(/Zona de Entrega/i), {
      target: { value: "z1" },
    });

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Cliente de Teste",
          endereco: expect.objectContaining({
            zonaEntregaId: "z1",
          }),
        }),
      );
    });
  });

  it("deve enviar todos os campos preenchidos corretamente", async () => {
    const mockCreate = clienteService.create as Mock;
    mockCreate.mockResolvedValue({});

    render(<ClienteForm />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Maria Silva" },
    });
    fireEvent.change(screen.getByLabelText(/Telefone/i), {
      target: { value: "87988887777" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "maria@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/CEP/i), {
      target: { value: "55290-000" },
    });
    fireEvent.change(screen.getByLabelText(/Rua/i), {
      target: { value: "Rua Teste" },
    });
    fireEvent.change(screen.getByLabelText(/Número/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/Bairro/i), {
      target: { value: "Centro" },
    });
    fireEvent.change(screen.getByLabelText(/Cidade/i), {
      target: { value: "Garanhuns" },
    });
    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "PE" },
    });
    fireEvent.change(screen.getByLabelText(/Zona de Entrega/i), {
      target: { value: "z2" },
    });

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Maria Silva",
          endereco: expect.objectContaining({
            cep: "55290000",
            zonaEntregaId: "z2",
          }),
        }),
      );
    });
  });

  it("deve validar que a cidade deve ser Garanhuns", async () => {
    render(<ClienteForm />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Maria Silva" },
    });
    fireEvent.change(screen.getByLabelText(/Zona de Entrega/i), {
      target: { value: "z1" },
    });
    fireEvent.change(screen.getByLabelText(/Cidade/i), {
      target: { value: "Recife" },
    });

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Apenas clientes de Garanhuns podem ser cadastrados no sistema.",
        ),
      ).toBeInTheDocument();
    });

    expect(clienteService.create).not.toHaveBeenCalled();
  });

  it("deve navegar para dashboard ao clicar em cancelar", () => {
    render(<ClienteForm />);

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("deve aplicar máscara de telefone e enviar apenas números ao backend", async () => {
    (clienteService.create as Mock).mockResolvedValue({});
    render(<ClienteForm />);

    const phoneInput = screen.getByLabelText(/Telefone/i);

    // Tenta digitar letras e números
    fireEvent.change(phoneInput, { target: { value: "87abc988887777" } });

    // Verifica se a máscara foi aplicada e as letras removidas
    expect(phoneInput).toHaveValue("(87) 98888-7777");

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Teste Máscara" },
    });

    fireEvent.change(screen.getByLabelText(/Zona de Entrega/i), {
      target: { value: "z1" },
    });

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(clienteService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          telefone: "87988887777",
        }),
      );
    });
  });

  it("deve buscar endereço ao sair do campo CEP se completo", async () => {
    (global.fetch as Mock).mockResolvedValue({
      json: async () => ({
        logradouro: "Rua Automática",
        bairro: "Bairro Automático",
        localidade: "Garanhuns",
        uf: "PE",
        erro: false,
      }),
    });

    render(<ClienteForm />);

    const cepInput = screen.getByLabelText(/CEP/i);
    fireEvent.change(cepInput, { target: { value: "55290-000" } });
    fireEvent.blur(cepInput);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Rua Automática")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Bairro Automático")).toBeInTheDocument();
    });
  });

  it("deve abrir modal de busca de CEP e atualizar campos ao selecionar", async () => {
    (global.fetch as Mock).mockResolvedValue({
      json: async () => [
        {
          cep: "55290-111",
          logradouro: "Rua do Modal",
          bairro: "Bairro do Modal",
          localidade: "Garanhuns",
          uf: "PE",
        },
      ],
    });

    render(<ClienteForm />);

    fireEvent.click(screen.getByTitle("Não sei meu CEP"));

    const modalInput = screen.getByPlaceholderText(/Ex: Alipio Medeiros/i);
    fireEvent.change(modalInput, { target: { value: "Rua do Modal" } });
    fireEvent.click(screen.getByRole("button", { name: "" })); // Botão lupa no modal

    await waitFor(() => {
      const result = screen.getByText("55290-111");
      fireEvent.click(result);
    });

    expect(screen.getByDisplayValue("55290-111")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rua do Modal")).toBeInTheDocument();
  });
});
