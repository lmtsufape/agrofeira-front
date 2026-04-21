import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "../page";

vi.mock("@/features/auth/components/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));

vi.mock("@/features/auth/components/AuthLayout", () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

describe("LoginPage", () => {
  it("deve renderizar o layout de autenticação com o formulário de login", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
