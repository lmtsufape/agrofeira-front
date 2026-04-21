import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthLayout } from "../AuthLayout";

// Mocks simples para componentes internos
vi.mock("../LoginSidePanel", () => ({
  LoginSidePanel: () => <div data-testid="side-panel" />,
}));
vi.mock("../LoginLogo", () => ({
  LoginLogo: () => <div data-testid="login-logo" />,
}));

describe("AuthLayout", () => {
  it("deve renderizar o logo, o painel lateral e os filhos", () => {
    render(
      <AuthLayout>
        <div data-testid="test-child">Child Content</div>
      </AuthLayout>,
    );

    expect(screen.getByTestId("side-panel")).toBeInTheDocument();
    expect(screen.getByTestId("login-logo")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("deve exibir o copyright com o ano atual", () => {
    render(<AuthLayout>content</AuthLayout>);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
