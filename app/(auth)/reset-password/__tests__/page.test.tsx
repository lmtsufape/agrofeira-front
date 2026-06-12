import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResetPasswordPage from "../page";

vi.mock("@/features/auth/components/ResetPasswordForm", () => ({
  ResetPasswordForm: () => <div data-testid="reset-password-form" />,
}));

describe("ResetPasswordPage", () => {
  it("deve renderizar o formulário de resetar senha dentro do Suspense", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
    expect(
      screen.getByText(/Agro Feira · Plataforma Agroecológica/i),
    ).toBeInTheDocument();
  });
});
