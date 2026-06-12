import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoginSidePanel } from "../LoginSidePanel";

describe("LoginSidePanel", () => {
  it("deve renderizar os textos e a citação corretamente", () => {
    render(<LoginSidePanel />);

    expect(screen.getByText("BEM-VINDO À")).toBeInTheDocument();
    expect(screen.getByText("Plataforma")).toBeInTheDocument();
    expect(screen.getByText("Agro Feira")).toBeInTheDocument();
    expect(
      screen.getByText(
        /"Fortalecendo os processos de comercialização e geração de renda a partir de produtos agroecológicos."/i,
      ),
    ).toBeInTheDocument();
  });
});
