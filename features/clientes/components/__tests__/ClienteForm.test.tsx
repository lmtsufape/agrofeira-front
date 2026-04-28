import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ClienteForm } from "../ClienteForm";
import { clienteService } from "../../api/clientes.service";
import { useRouter } from "next/navigation";

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

describe("ClienteForm Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
  });

  it("deve renderizar os campos corretamente", () => {
    render(<ClienteForm />);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it("deve validar que o nome é obrigatório", async () => {
    const { container } = render(<ClienteForm />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("O nome é obrigatório!")).toBeInTheDocument();
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

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Cliente de Teste",
          telefone: null,
          email: null,
          senha: expect.any(String),
        }),
      );
    });

    const calls = mockCreate.mock.calls;
    const submittedData = calls[0][0];
    expect(submittedData.senha.length).toBeGreaterThan(10);
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

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Maria Silva",
          telefone: "87988887777",
          email: "maria@email.com",
          cep: "55290-000",
          rua: "Rua Teste",
          numero: "123",
          bairro: "Centro",
          cidade: "Garanhuns",
          estado: "PE",
          senha: expect.any(String),
        }),
      );
    });
  });

  it("deve navegar para dashboard ao clicar em cancelar", () => {
    render(<ClienteForm />);

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
