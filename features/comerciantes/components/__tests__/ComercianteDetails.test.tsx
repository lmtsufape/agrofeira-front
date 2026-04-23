import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ComercianteDetails } from "../ComercianteDetails";
import { useComerciante } from "../../hooks/useComerciante";
import { useRouter } from "next/navigation";

// Mock do hook useComerciante
vi.mock("../../hooks/useComerciante", () => ({
  useComerciante: vi.fn(),
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ComercianteDetails Component", () => {
  const mockId = "merchant-123";
  const mockBack = vi.fn();
  const mockHandleFormChange = vi.fn();
  const mockSaveChanges = vi.fn();
  const mockSetActiveCategories = vi.fn();

  const defaultHookReturn = {
    comerciante: null,
    allCategories: [],
    activeCategories: [],
    setActiveCategories: mockSetActiveCategories,
    formData: { nome: "", telefone: "", descricao: "" },
    loading: false,
    error: null,
    savingChanges: false,
    handleFormChange: mockHandleFormChange,
    saveChanges: mockSaveChanges,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ back: mockBack, push: vi.fn() });
  });

  it("deve exibir carregamento", () => {
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });
    render(<ComercianteDetails comercianteId={mockId} />);
    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
  });

  it("deve exibir erro se não encontrar comerciante", () => {
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      error: "Não encontrado",
    });
    render(<ComercianteDetails comercianteId={mockId} />);
    expect(screen.getByText("Não encontrado")).toBeInTheDocument();
  });

  it("deve renderizar dados do comerciante corretamente", () => {
    const mockComerciante = {
      id: mockId,
      nome: "João Frutas",
      telefone: "1234",
      descricao: "Frutas frescas",
    };
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: mockComerciante,
    });

    render(<ComercianteDetails comercianteId={mockId} />);

    expect(screen.getByText("João Frutas")).toBeInTheDocument();
    expect(screen.getByText("Frutas frescas")).toBeInTheDocument();
  });

  it("deve abrir modal de edição ao clicar no botão Editar Dados", () => {
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
    });

    render(<ComercianteDetails comercianteId={mockId} />);

    fireEvent.click(screen.getByText("Editar Dados"));
    expect(screen.getByText("Editar Comerciante")).toBeInTheDocument();
  });

  it("deve gerenciar autorização de categorias (adicionar selecionados)", () => {
    const mockAllCategories = [
      { id: "cat-1", nome: "Hortaliças" },
      { id: "cat-2", nome: "Frutas" },
    ];
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
      allCategories: mockAllCategories,
      activeCategories: ["cat-1"],
    });

    render(<ComercianteDetails comercianteId={mockId} />);

    expect(screen.getByText("Frutas")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const addButton = screen.getByTitle("Adicionar selecionados");
    fireEvent.click(addButton);

    expect(mockSetActiveCategories).toHaveBeenCalledWith(["cat-1", "cat-2"]);
  });

  it("deve gerenciar autorização de categorias (remover selecionados)", () => {
    const mockAllCategories = [{ id: "cat-1", nome: "Hortaliças" }];
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
      allCategories: mockAllCategories,
      activeCategories: ["cat-1"],
    });

    render(<ComercianteDetails comercianteId={mockId} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const removeButton = screen.getByTitle("Remover selecionados");
    fireEvent.click(removeButton);

    expect(mockSetActiveCategories).toHaveBeenCalledWith([]);
  });

  it("deve atualizar campos no modal de edição", () => {
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
    });

    render(<ComercianteDetails comercianteId={mockId} />);

    fireEvent.click(screen.getByText("Editar Dados"));

    const nomeInput = screen.getByLabelText(/Nome/i);
    fireEvent.change(nomeInput, { target: { value: "João Silva" } });

    expect(mockHandleFormChange).toHaveBeenCalledWith("nome", "João Silva");
  });

  it("deve exibir mensagem amigável quando não houver categorias inativas", () => {
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
      allCategories: [{ id: "c1", nome: "Hortaliças" }],
      activeCategories: ["c1"],
    });

    render(<ComercianteDetails comercianteId={mockId} />);
    expect(screen.getByText("Nenhum item removido.")).toBeInTheDocument();
  });

  it("deve disparar alert em caso de falha no salvamento", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    mockSaveChanges.mockRejectedValue(new Error("Erro interno"));

    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
      saveChanges: mockSaveChanges,
    });

    render(<ComercianteDetails comercianteId={mockId} />);

    const confirmButton = screen.getByText("Confirmar Alterações");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Erro interno");
    });
    alertMock.mockRestore();
  });

  it("deve navegar de volta ao clicar no botão de cancelar", () => {
    (useComerciante as Mock).mockReturnValue({
      ...defaultHookReturn,
      comerciante: { id: mockId, nome: "João" },
    });

    render(<ComercianteDetails comercianteId={mockId} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockBack).toHaveBeenCalled();
  });
});
