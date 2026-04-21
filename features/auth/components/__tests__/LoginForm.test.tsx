import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { LoginForm } from "../LoginForm";
import { useLoginForm } from "../../hooks/useLoginForm";

vi.mock("../../hooks/useLoginForm");

describe("LoginForm Component", () => {
  const mockHandleSubmit = vi.fn();
  const mockSetUsername = vi.fn();
  const mockSetPassword = vi.fn();
  const mockToggleVisibility = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoginForm as Mock).mockReturnValue({
      username: "",
      setUsername: mockSetUsername,
      password: "",
      setPassword: mockSetPassword,
      showPassword: false,
      togglePasswordVisibility: mockToggleVisibility,
      error: "",
      loading: false,
      handleSubmit: mockHandleSubmit,
    });
  });

  it("deve renderizar campos de entrada e botão", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("deve chamar setUsername e setPassword ao digitar", () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "123" },
    });

    expect(mockSetUsername).toHaveBeenCalled();
    expect(mockSetPassword).toHaveBeenCalled();
  });

  it("deve exibir mensagem de erro quando presente", () => {
    (useLoginForm as Mock).mockReturnValue({
      username: "",
      setUsername: mockSetUsername,
      password: "",
      setPassword: mockSetPassword,
      showPassword: false,
      togglePasswordVisibility: mockToggleVisibility,
      error: "Erro de autenticação",
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginForm />);
    expect(screen.getByText("Erro de autenticação")).toBeInTheDocument();
  });

  it("deve mostrar estado de carregamento no botão", () => {
    (useLoginForm as Mock).mockReturnValue({
      username: "",
      setUsername: mockSetUsername,
      password: "",
      setPassword: mockSetPassword,
      showPassword: false,
      togglePasswordVisibility: mockToggleVisibility,
      error: "",
      loading: true,
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginForm />);
    expect(screen.getByText("Entrando...")).toBeInTheDocument();
    // Busca específica pelo botão de submit
    expect(screen.getByRole("button", { name: /Entrando.../i })).toBeDisabled();
  });

  it("deve alternar tipo do input de senha ao clicar no olho", () => {
    (useLoginForm as Mock).mockReturnValue({
      username: "",
      setUsername: mockSetUsername,
      password: "",
      setPassword: mockSetPassword,
      showPassword: true,
      togglePasswordVisibility: mockToggleVisibility,
      error: "",
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/Senha/i);
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
