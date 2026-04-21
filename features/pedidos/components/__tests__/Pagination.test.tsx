import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "../Pagination";

describe("Pagination", () => {
  const onPageChange = vi.fn();

  it("deve renderizar informações de contagem corretamente", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChange}
        startIndex={0}
        itemsPerPage={5}
        totalCount={12}
      />,
    );

    expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();

    // Como o texto é quebrado em vários spans, verificamos a presença dos números de forma isolada ou via função
    expect(screen.getByText("12")).toBeInTheDocument();

    // Verifica se os botões de página existem via aria-label
    expect(screen.getByLabelText(/Ir para a página 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ir para a página 3/i)).toBeInTheDocument();
  });

  it("deve desabilitar botão anterior na primeira página", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        onPageChange={onPageChange}
        startIndex={0}
        itemsPerPage={5}
        totalCount={8}
      />,
    );
    expect(screen.getByLabelText(/Página Anterior/i)).toBeDisabled();
  });

  it("deve disparar onPageChange ao clicar nos números das páginas", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        onPageChange={onPageChange}
        startIndex={0}
        itemsPerPage={5}
        totalCount={8}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Ir para a página 2/i));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
