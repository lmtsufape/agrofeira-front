import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ItensList } from "../ItensList";
import { useItens } from "../../hooks/useItens";
import { itemService } from "../../api/itens.service";
import { useRouter } from "next/navigation";

vi.mock("../../hooks/useItens", () => ({
  useItens: vi.fn(),
}));

vi.mock("../../api/itens.service", () => ({
  itemService: {
    update: vi.fn(),
    delete: vi.fn(),
    getOpcoes: vi.fn().mockResolvedValue({
      categorias: [{ value: "FRUTAS", label: "Frutas" }],
      unidadesMedida: [{ value: "KG", label: "Quilo" }],
    }),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ItensList Component", () => {
  const mockMutate = vi.fn();

  const defaultHookReturn = {
    itens: [],
    pageData: { totalPages: 1, totalElements: 0 },
    isLoading: false,
    isError: null,
    mutate: mockMutate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ back: vi.fn() });
    window.confirm = vi.fn(() => true);
  });

  it("deve exibir estado de carregamento", () => {
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<ItensList />);
    expect(screen.getByText("Carregando itens...")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando falhar", () => {
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      isError: new Error("Erro"),
    });

    render(<ItensList />);
    expect(screen.getByText("Erro ao carregar itens")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição ao clicar em Editar", () => {
    const mockItens = [
      {
        id: "1",
        nome: "Tomate",
        precoBase: 5.0,
        categoria: "FRUTAS",
        unidadeMedida: "KG",
      },
    ];
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      itens: mockItens,
    });

    render(<ItensList />);

    fireEvent.click(screen.getByText("Editar"));
    expect(screen.getByText("Editar Item")).toBeInTheDocument();
  });

  it("deve chamar updateItem ao salvar alterações no modal", async () => {
    const mockItens = [
      {
        id: "1",
        nome: "Tomate",
        precoBase: 5.0,
        categoria: "FRUTAS",
        unidadeMedida: "KG",
      },
    ];
    (useItens as Mock).mockReturnValue({
      ...defaultHookReturn,
      itens: mockItens,
    });
    (itemService.update as Mock).mockResolvedValue({});

    render(<ItensList />);

    fireEvent.click(screen.getByText("Editar"));
    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(itemService.update).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
