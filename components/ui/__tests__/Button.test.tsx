import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";
import { vi } from "vitest";

describe("Button", () => {
  it("deve renderizar o texto corretamente", () => {
    render(<Button>Clique Aqui</Button>);
    expect(screen.getByText("Clique Aqui")).toBeInTheDocument();
  });

  it("deve chamar onClick ao ser clicado", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    fireEvent.click(screen.getByText("Clique Aqui"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve mostrar loader e estar desabilitado quando isLoading for true", () => {
    render(<Button isLoading>Clique Aqui</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("não deve chamar onClick quando desabilitado", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Clique Aqui
      </Button>,
    );
    fireEvent.click(screen.getByText("Clique Aqui"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("deve renderizar ícones se fornecidos", () => {
    const LeftIcon = () => <span data-testid="left-icon" />;
    const RightIcon = () => <span data-testid="right-icon" />;
    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        Texto
      </Button>,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });
});
