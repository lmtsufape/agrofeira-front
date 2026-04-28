import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ComercianteForm } from "../ComercianteForm";
import { comercianteService } from "../../api/comerciantes.service";
import { useRouter } from "next/navigation";

// Mock do service
vi.mock("../../api/comerciantes.service", () => ({
  comercianteService: {
    create: vi.fn(),
  },
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ComercianteForm Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
  });

  it("deve renderizar os campos corretamente", () => {
    render(<ComercianteForm />);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
  });

  it("deve validar que o nome é obrigatório", async () => {
    const { container } = render(<ComercianteForm />);

    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("O nome é obrigatório!")).toBeInTheDocument();
    });

    expect(comercianteService.create).not.toHaveBeenCalled();
  });

  it("deve enviar o formulário com dados mínimos e gerar senha aleatória", async () => {
    const mockCreate = comercianteService.create as Mock;
    mockCreate.mockResolvedValue({});

    render(<ComercianteForm />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Comerciante Teste" },
    });

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Comerciante Teste",
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

  it("deve enviar todos os campos preenchidos", async () => {
    const mockCreate = comercianteService.create as Mock;
    mockCreate.mockResolvedValue({});

    render(<ComercianteForm />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "João das Frutas" },
    });
    fireEvent.change(screen.getByLabelText(/Telefone/i), {
      target: { value: "87988887777" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { value: "Frutas frescas" },
    });

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        nome: "João das Frutas",
        telefone: "87988887777",
        email: "joao@email.com",
        descricao: "Frutas frescas",
        senha: expect.any(String),
      });
    });
  });

  it("deve navegar para dashboard ao clicar em cancelar", () => {
    render(<ComercianteForm />);

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
