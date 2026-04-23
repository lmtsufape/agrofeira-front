import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { comercianteService } from "../comerciantes.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("comercianteService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar o endpoint correto para listar todos", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await comercianteService.getAll();
    expect(apiClient).toHaveBeenCalledWith("/api/comerciantes");
  });

  it("deve chamar o endpoint correto para buscar por ID", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await comercianteService.getById("777");
    expect(apiClient).toHaveBeenCalledWith("/api/comerciantes/777");
  });

  it("deve listar categorias globais", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await comercianteService.listarCategorias();
    expect(apiClient).toHaveBeenCalledWith("/api/categorias");
  });

  it("deve buscar categorias de um comerciante específico", async () => {
    (apiClient as Mock).mockResolvedValue({ categorias: ["cat-1"] });
    const res = await comercianteService.buscarCategoriasComerciante("123");
    expect(apiClient).toHaveBeenCalledWith("/api/comerciantes/123/categorias");
    expect(res).toEqual(["cat-1"]);
  });

  it("deve atualizar categorias de um comerciante", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await comercianteService.atualizarCategoriasComerciante("123", [
      "c1",
      "c2",
    ]);
    expect(apiClient).toHaveBeenCalledWith(
      "/api/comerciantes/123/categorias",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ categorias: ["c1", "c2"] }),
      }),
    );
  });

  it("deve lidar com resposta vazia em buscarCategoriasComerciante", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const res = await comercianteService.buscarCategoriasComerciante("123");
    expect(res).toEqual([]);
  });
});
