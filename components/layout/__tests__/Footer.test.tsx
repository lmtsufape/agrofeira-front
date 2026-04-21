import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("deve renderizar o ano atual corretamente", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(currentYear.toString())),
    ).toBeInTheDocument();
  });

  it("deve conter o texto da associação", () => {
    render(<Footer />);
    expect(
      screen.getByText(/EcoFeira · Associação Agroecológica/i),
    ).toBeInTheDocument();
  });

  it("deve conter o texto de direitos reservados", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Todos os direitos reservados/i),
    ).toBeInTheDocument();
  });
});
