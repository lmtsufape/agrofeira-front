import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useComerciante } from "../useComerciante";
import { comercianteService } from "../../api/comerciantes.service";

vi.mock("../../api/comerciantes.service", () => ({
  comercianteService: {
    getById: vi.fn(),
    listarCategorias: vi.fn(),
    buscarCategoriasComerciante: vi.fn(),
    update: vi.fn(),
    atualizarCategoriasComerciante: vi.fn(),
  },
}));

describe("useComerciante", () => {
  const mockId = "merchant-123";
  const mockComerciante = {
    id: mockId,
    nome: "João",
    telefone: "123",
    descricao: "Desc",
  };
  const mockAllCategories = [
    { id: "c1", nome: "Cat 1" },
    { id: "c2", nome: "Cat 2" },
  ];
  const mockActiveCategories = ["c1"];

  beforeEach(() => {
    vi.clearAllMocks();
    (comercianteService.getById as Mock).mockResolvedValue(mockComerciante);
    (comercianteService.listarCategorias as Mock).mockResolvedValue(
      mockAllCategories,
    );
    (comercianteService.buscarCategoriasComerciante as Mock).mockResolvedValue(
      mockActiveCategories,
    );
  });

  it("deve carregar dados completos ao montar", async () => {
    const { result } = renderHook(() => useComerciante(mockId));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.comerciante).toEqual(mockComerciante);
    expect(result.current.allCategories).toEqual(mockAllCategories);
    expect(result.current.activeCategories).toEqual(mockActiveCategories);
  });

  it("deve atualizar formData", async () => {
    const { result } = renderHook(() => useComerciante(mockId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleFormChange("nome", "Novo Nome");
    });

    expect(result.current.formData.nome).toBe("Novo Nome");
  });

  it("deve chamar service.update e service.atualizarCategoriasComerciante ao salvar", async () => {
    (comercianteService.update as Mock).mockResolvedValue({});
    (
      comercianteService.atualizarCategoriasComerciante as Mock
    ).mockResolvedValue({});

    const { result } = renderHook(() => useComerciante(mockId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.saveChanges(["c1", "c2"]);
    });

    expect(comercianteService.update).toHaveBeenCalledWith(
      mockId,
      result.current.formData,
    );
    expect(
      comercianteService.atualizarCategoriasComerciante,
    ).toHaveBeenCalledWith(mockId, ["c1", "c2"]);
  });

  it("deve permitir atualizar apenas categorias", async () => {
    (
      comercianteService.atualizarCategoriasComerciante as Mock
    ).mockResolvedValue({});

    const { result } = renderHook(() => useComerciante(mockId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateCategories(["c2"]);
    });

    expect(result.current.activeCategories).toEqual(["c2"]);
  });

  it("deve lidar com falha no carregamento", async () => {
    (comercianteService.getById as Mock).mockRejectedValue(new Error("Falha"));

    const { result } = renderHook(() => useComerciante(mockId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Falha");
  });
});
