import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ResetPasswordForm } from "../ResetPasswordForm";
import { useResetPassword } from "../../hooks/useResetPassword";

vi.mock("../../hooks/useResetPassword");

describe("ResetPasswordForm Component", () => {
  const mockHandleSubmit = vi.fn();
  const mockSetToken = vi.fn();
  const mockSetNovaSenha = vi.fn();
  const mockSetConfirmarSenha = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useResetPassword as Mock).mockReturnValue({
      token: "",
      setToken: mockSetToken,
      novaSenha: "",
      setNovaSenha: mockSetNovaSenha,
      confirmarSenha: "",
      setConfirmarSenha: mockSetConfirmarSenha,
      error: "",
      success: false,
      loading: false,
      hasTokenFromUrl: false,
      handleSubmit: mockHandleSubmit,
    });
  });

  it("deve renderizar o formulário inicial corretamente", () => {
    render(<ResetPasswordForm />);
    expect(
      screen.getByRole("heading", { name: /Nova Senha/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Token de Verificação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sua Nova Senha/i)).toBeInTheDocument();
  });

  it("deve tornar o campo token readOnly se vier da URL", () => {
    (useResetPassword as Mock).mockReturnValue({
      token: "url-token",
      setToken: mockSetToken,
      novaSenha: "",
      setNovaSenha: mockSetNovaSenha,
      confirmarSenha: "",
      setConfirmarSenha: mockSetConfirmarSenha,
      error: "",
      success: false,
      loading: false,
      hasTokenFromUrl: true,
      handleSubmit: mockHandleSubmit,
    });

    render(<ResetPasswordForm />);
    const tokenInput = screen.getByLabelText(/Token de Verificação/i);
    expect(tokenInput).toHaveAttribute("readOnly");
    expect(tokenInput).toHaveValue("url-token");
  });

  it("deve alternar a visibilidade da senha ao clicar no olho", () => {
    render(<ResetPasswordForm />);
    const passwordInput = screen.getByLabelText(/Sua Nova Senha/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getAllByRole("button")[0]; // Primeiro olho
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("deve exibir mensagem de sucesso", () => {
    (useResetPassword as Mock).mockReturnValue({
      token: "any",
      setToken: mockSetToken,
      novaSenha: "",
      setNovaSenha: mockSetNovaSenha,
      confirmarSenha: "",
      setConfirmarSenha: mockSetConfirmarSenha,
      error: "",
      success: true,
      loading: false,
      hasTokenFromUrl: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<ResetPasswordForm />);
    expect(screen.getByText("Senha Redefinida!")).toBeInTheDocument();
    expect(screen.getByText(/Ir para o Login/i)).toBeInTheDocument();
  });
});
