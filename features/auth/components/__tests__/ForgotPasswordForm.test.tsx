import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ForgotPasswordForm } from "../ForgotPasswordForm";
import { useForgotPassword } from "../../hooks/useForgotPassword";

vi.mock("../../hooks/useForgotPassword");

describe("ForgotPasswordForm Component", () => {
  const mockHandleSubmit = vi.fn();
  const mockSetUsername = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useForgotPassword as Mock).mockReturnValue({
      username: "",
      setUsername: mockSetUsername,
      error: "",
      success: false,
      loading: false,
      handleSubmit: mockHandleSubmit,
    });
  });

  it("deve renderizar o formulário inicial", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText(/Recuperar Senha/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite seu usuário/i),
    ).toBeInTheDocument();
  });

  it("deve exibir mensagem de sucesso e esconder o formulário", () => {
    (useForgotPassword as Mock).mockReturnValue({
      username: "test_user",
      setUsername: mockSetUsername,
      error: "",
      success: true,
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<ForgotPasswordForm />);
    expect(screen.getByText("Solicitação Enviada!")).toBeInTheDocument();
    expect(screen.getByText(/test_user/i)).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/Digite seu usuário/i),
    ).not.toBeInTheDocument();
  });

  it("deve desabilitar botão durante carregamento", () => {
    (useForgotPassword as Mock).mockReturnValue({
      username: "",
      setUsername: mockSetUsername,
      error: "",
      success: false,
      loading: true,
      handleSubmit: mockHandleSubmit,
    });

    render(<ForgotPasswordForm />);
    expect(screen.getByText("Processando...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
