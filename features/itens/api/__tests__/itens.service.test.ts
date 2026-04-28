import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { itemService } from "../itens.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("itemService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock do localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
      };
    })();

    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", {});
  });

  it("deve chamar o endpoint correto para listar todos", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await itemService.getAll();
    expect(apiClient).toHaveBeenCalledWith("/api/v1/itens", {});
  });

  it("deve chamar o endpoint correto para buscar por ID", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await itemService.getById("item-1");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/itens/item-1", {});
  });

  it("deve chamar o endpoint correto para buscar opções e salvar no cache", async () => {
    const mockData = { categorias: [], unidadesMedida: [] };
    (apiClient as Mock).mockResolvedValue(mockData);

    await itemService.getOpcoes();

    expect(apiClient).toHaveBeenCalledWith("/api/v1/itens/opcoes", {});
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "agrofeira_itens_opcoes",
      JSON.stringify(mockData),
    );
  });

  it("deve retornar do cache se os dados já existirem no localStorage", async () => {
    const cachedData = {
      categorias: [{ value: "CAT1", label: "Cat 1" }],
      unidadesMedida: [],
    };
    (localStorage.getItem as Mock).mockReturnValue(JSON.stringify(cachedData));

    const result = await itemService.getOpcoes();

    expect(result).toEqual(cachedData);
    expect(apiClient).not.toHaveBeenCalled();
  });

  it("deve chamar a API se o cache for inválido e limpar o cache corrompido", async () => {
    (localStorage.getItem as Mock).mockReturnValue("invalid-json");
    (apiClient as Mock).mockResolvedValue({
      categorias: [],
      unidadesMedida: [],
    });

    await itemService.getOpcoes();

    expect(localStorage.removeItem).toHaveBeenCalledWith(
      "agrofeira_itens_opcoes",
    );
    expect(apiClient).toHaveBeenCalled();
  });

  it("deve chamar o endpoint correto para criar um item", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const newItem = {
      nome: "Tomate",
      precoBase: 5.5,
      unidadeMedida: "KG",
      categoria: "HORTIFRUTI",
    };
    await itemService.create(newItem);
    expect(apiClient).toHaveBeenCalledWith("/api/v1/itens", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
  });

  it("deve chamar o endpoint correto para atualizar um item", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const updateData = { precoBase: 6.0 };
    await itemService.update("item-1", updateData);
    expect(apiClient).toHaveBeenCalledWith("/api/v1/itens/item-1", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  });

  it("deve chamar o endpoint correto para deletar um item", async () => {
    (apiClient as Mock).mockResolvedValue(undefined);
    await itemService.delete("item-1");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/itens/item-1", {
      method: "DELETE",
    });
  });
});
