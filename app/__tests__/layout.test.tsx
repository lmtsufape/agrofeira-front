import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout from "../layout";

// Mock do AuthProvider e Server Actions
vi.mock("@/features/auth/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock("@/features/auth/actions/auth.actions", () => ({
  getAuthData: vi
    .fn()
    .mockResolvedValue({ token: null, refreshToken: null, username: null }),
}));

describe("RootLayout", () => {
  it("deve envolver os filhos com o AuthProvider", async () => {
    // Para Server Components assíncronos no Vitest, precisamos aguardar a resolução
    const layoutElement = await RootLayout({
      children: <div data-testid="children">App Content</div>,
    });

    await act(async () => {
      render(layoutElement);
    });

    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("children")).toBeInTheDocument();
  });
});
