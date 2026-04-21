import { render } from "@testing-library/react";
import { DecorativeCircle } from "../DecorativeCircle";

describe("DecorativeCircle", () => {
  it("deve renderizar com classes de tamanho padrão", () => {
    const { container } = render(<DecorativeCircle />);
    expect(container.firstChild).toHaveClass("w-40 h-40");
  });

  it("deve mapear o tamanho 48 corretamente", () => {
    const { container } = render(<DecorativeCircle size={48} />);
    expect(container.firstChild).toHaveClass("w-12 h-12");
  });

  it("deve mapear a cor corretamente", () => {
    const { container } = render(<DecorativeCircle color="#003d04" />);
    expect(container.firstChild).toHaveClass("bg-[#003d04]");
  });

  it("deve mapear a opacidade corretamente", () => {
    const { container } = render(<DecorativeCircle opacity={0.08} />);
    expect(container.firstChild).toHaveClass("opacity-[0.08]");
  });

  it("deve aceitar classes customizadas", () => {
    const { container } = render(<DecorativeCircle className="top-0" />);
    expect(container.firstChild).toHaveClass("top-0");
  });
});
