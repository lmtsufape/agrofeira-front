import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoginLogo } from "../LoginLogo";

describe("LoginLogo", () => {
  it("deve renderizar o título e o subtítulo corretamente", () => {
    render(<LoginLogo />);

    expect(screen.getByText("Agro Feira")).toBeInTheDocument();
    expect(
      screen.getByText("Acesse sua conta para continuar"),
    ).toBeInTheDocument();
  });

  it("deve renderizar o svg com a logo", () => {
    const { container } = render(<LoginLogo />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
