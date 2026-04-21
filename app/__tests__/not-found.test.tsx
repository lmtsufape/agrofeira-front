import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "../not-found";

describe("NotFound Page", () => {
  it("deve renderizar a mensagem de erro 404 corretamente", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Página não encontrada/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ops! O endereço que você tentou acessar não existe/i),
    ).toBeInTheDocument();
  });

  it("deve conter um link para voltar para o início", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", { name: /Voltar para o Início/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
