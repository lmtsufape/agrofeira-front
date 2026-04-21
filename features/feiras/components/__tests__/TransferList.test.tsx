import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TransferList } from "../TransferList";
import { Users } from "lucide-react";

describe("TransferList", () => {
  const leftItems = [{ id: "l1", label: "Left 1" }];
  const rightItems = [{ id: "r1", label: "Right 1" }];
  const mockFns = {
    onLeftSelect: vi.fn(),
    onRightSelect: vi.fn(),
    onMoveToLeft: vi.fn(),
    onMoveToRight: vi.fn(),
    onMoveAllToLeft: vi.fn(),
    onMoveAllToRight: vi.fn(),
  };

  it("deve renderizar o título e os painéis com as labels corretas", () => {
    render(
      <TransferList
        icon={Users}
        title="Título Teste"
        leftLabel="Removidos"
        rightLabel="Adicionados"
        leftItems={leftItems}
        rightItems={rightItems}
        leftSelected={[]}
        rightSelected={[]}
        {...mockFns}
      />,
    );

    expect(screen.getByText("Título Teste")).toBeInTheDocument();
    expect(screen.getByText("Removidos")).toBeInTheDocument();
    expect(screen.getByText("Adicionados")).toBeInTheDocument();
    expect(screen.getByText("Left 1")).toBeInTheDocument();
    expect(screen.getByText("Right 1")).toBeInTheDocument();
  });

  it("deve disparar ações de movimento ao clicar nos botões centrais", () => {
    render(
      <TransferList
        icon={Users}
        title="Teste"
        leftLabel="L"
        rightLabel="R"
        leftItems={leftItems}
        rightItems={rightItems}
        leftSelected={[]}
        rightSelected={[]}
        {...mockFns}
      />,
    );

    fireEvent.click(screen.getByTitle("Adicionar selecionados"));
    expect(mockFns.onMoveToRight).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle("Remover selecionados"));
    expect(mockFns.onMoveToLeft).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle("Adicionar todos"));
    expect(mockFns.onMoveAllToRight).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle("Remover todos"));
    expect(mockFns.onMoveAllToLeft).toHaveBeenCalled();
  });
});
