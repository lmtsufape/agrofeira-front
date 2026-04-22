import { createBaseService } from "@/lib/base-service";
import {
  ComercianteDTO,
  CreateComercianteDTO,
  CategoriaDTO,
  ComercianteComCategoriasDTO,
} from "./types";
import { apiClient } from "@/lib/api-client";

const baseService = createBaseService<ComercianteDTO, CreateComercianteDTO>(
  "/api/comerciantes",
);

export const comercianteService = {
  ...baseService,

  async listarCategorias(): Promise<CategoriaDTO[]> {
    return apiClient("/api/categorias");
  },

  async buscarCategoriasComerciante(comercianteId: string): Promise<string[]> {
    const data = await apiClient<{ categorias: string[] }>(
      `/api/comerciantes/${comercianteId}/categorias`,
    );
    return data.categorias || [];
  },

  async atualizarCategoriasComerciante(
    comercianteId: string,
    categoriaIds: string[],
  ): Promise<ComercianteComCategoriasDTO> {
    return apiClient(`/api/comerciantes/${comercianteId}/categorias`, {
      method: "PUT",
      body: JSON.stringify({ categorias: categoriaIds }),
    });
  },
};
