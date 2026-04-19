import { apiClient } from "@/lib/api-client";
import { createBaseService } from "@/lib/base-service";
import {
  FeiraDTO,
  CreateFeiraDTO,
  ResumoFeiraDTO,
  EstoqueBancaDTO,
  ItemAgrupado,
} from "./types";

const baseService = createBaseService<FeiraDTO, CreateFeiraDTO>("/api/feiras");

export const feiraService = {
  ...baseService,

  /**
   * Busca resumo detalhado da feira
   */
  getResumo: (id: string) => {
    return apiClient<ResumoFeiraDTO>(`/api/feiras/${id}/resumo`);
  },

  /**
   * Lista estoques vinculados a uma feira específica
   */
  getEstoques: (id: string) => {
    return apiClient<EstoqueBancaDTO[]>(`/api/feiras/${id}/estoques`);
  },

  /**
   * Busca itens agrupados por comerciantes para uma feira
   */
  getItensAgrupados: async (id: string): Promise<ItemAgrupado[]> => {
    interface RawEstoqueItem {
      itemId: string;
      itemNome: string;
      comercianteId: string;
      comercianteNome: string;
      quantidadeDisponivel: number;
      precoBase: number;
    }

    const data = await apiClient<RawEstoqueItem[]>(
      `/api/estoque-banca?feiraId=${id}`,
    );

    const map = new Map<string, ItemAgrupado>();

    for (const item of data) {
      if (!map.has(item.itemId)) {
        map.set(item.itemId, {
          id: item.itemId,
          nome: item.itemNome,
          comerciantes: [],
        });
      }

      map.get(item.itemId)!.comerciantes.push({
        id: item.comercianteId,
        nome: item.comercianteNome,
        quantidade: item.quantidadeDisponivel,
        valorUnitario: item.precoBase,
      });
    }

    return Array.from(map.values());
  },
};
