import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DashboardLayout from "../layout";

vi.mock("@/components/layout/Header", () => ({
  default: () => <header data-testid="header" />,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

describe("DashboardLayout", () => {
  it("deve renderizar o header, o conteúdo e o footer", () => {
    render(
      <DashboardLayout>
        <div data-testid="content">Dashboard Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
