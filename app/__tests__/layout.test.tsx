import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout from "../layout";

// Mock do AuthProvider
vi.mock("@/features/auth/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("deve envolver os filhos com o AuthProvider", () => {
    render(
      <RootLayout>
        <div data-testid="children">App Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("children")).toBeInTheDocument();
  });
});
