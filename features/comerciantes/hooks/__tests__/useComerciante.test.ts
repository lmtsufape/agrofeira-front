import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useComerciante } from "../useComerciante";
import useSWR from "swr";
import { comercianteService } from "../../api/comerciantes.service";

vi.mock("swr");
vi.mock("../../api/comerciantes.service", () => ({
  comercianteService: {
    buscarCategoriasComerciante: vi.fn(),
    update: vi.fn(),
    atualizarCategoriasComerciante: vi.fn(),
  },
}));

describe("useComerciante", () => {
  const mockComerciante = {
    id: "1",
    nome: "Comerciante 1",
    telefone: "81999999999",
    email: "teste@teste.com",
    descricao: "Desc",
  };

  const mockCategories = [{ id: "c1", nome: "Categoria 1" }];
  const mockActiveCategories = ["c1"];

  beforeEach(() => {
    vi.clearAllMocks();

    (useSWR as Mock).mockImplementation((key: string) => {
      if (key.includes("/api/v1/comerciantes/1/categorias")) {
        return {
          data: mockActiveCategories,
          isLoading: false,
          mutate: vi.fn(),
        };
      }
      if (key.includes("/api/v1/comerciantes/1")) {
        return { data: mockComerciante, isLoading: false, mutate: vi.fn() };
      }
      if (key.includes("/api/v1/categorias")) {
        return { data: mockCategories, isLoading: false, mutate: vi.fn() };
      }
      return { data: null, isLoading: false, mutate: vi.fn() };
    });
  });

  it("deve inicializar formData com dados do comerciante", () => {
    const { result } = renderHook(() => useComerciante("1"));

    expect(result.current.formData.nome).toBe(mockComerciante.nome);
    expect(result.current.formData.email).toBe(mockComerciante.email);
    expect(result.current.comerciante).toEqual(mockComerciante);
  });

  it("deve atualizar formData ao chamar handleFormChange", () => {
    const { result } = renderHook(() => useComerciante("1"));

    act(() => {
      result.current.handleFormChange("nome", "Novo Nome");
    });

    expect(result.current.formData.nome).toBe("Novo Nome");
  });

  it("deve mascarar telefone no handleFormChange", () => {
    const { result } = renderHook(() => useComerciante("1"));

    act(() => {
      result.current.handleFormChange("telefone", "81988887777");
    });

    expect(result.current.formData.telefone).toBe("(81) 98888-7777");
  });

  it("deve chamar service.update ao salvar alterações", async () => {
    (comercianteService.update as Mock).mockResolvedValue({});
    (
      comercianteService.atualizarCategoriasComerciante as Mock
    ).mockResolvedValue({});

    const { result } = renderHook(() => useComerciante("1"));

    await act(async () => {
      await result.current.saveChanges();
    });

    expect(comercianteService.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        nome: mockComerciante.nome,
        telefone: "81999999999",
      }),
    );
  });

  it("deve atualizar categorias separadamente", async () => {
    (
      comercianteService.atualizarCategoriasComerciante as Mock
    ).mockResolvedValue({});

    const { result } = renderHook(() => useComerciante("1"));

    await act(async () => {
      await result.current.updateCategories(["c2"]);
    });

    expect(
      comercianteService.atualizarCategoriasComerciante,
    ).toHaveBeenCalledWith("1", ["c2"]);
  });
});
