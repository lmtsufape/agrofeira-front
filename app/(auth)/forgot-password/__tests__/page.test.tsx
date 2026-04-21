import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ForgotPasswordPage from "../page";

vi.mock("@/features/auth/components/ForgotPasswordForm", () => ({
  ForgotPasswordForm: () => <div data-testid="forgot-password-form" />,
}));

vi.mock("@/features/auth/components/AuthLayout", () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

describe("ForgotPasswordPage", () => {
  it("deve renderizar o layout de autenticação com o formulário de recuperação", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
  });
});
