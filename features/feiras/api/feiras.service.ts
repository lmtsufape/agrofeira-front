import { apiClient } from "@/lib/api-client";
import { createBaseService } from "@/lib/base-service";
import {
  FeiraDTO,
  CreateFeiraDTO,
  ResumoFeiraDTO,
  EstoqueBancaDTO,
  ItemAgrupado,
  FeiraDetalhesDTO,
  FeiraRateioDTO,
} from "./types";

const baseService = createBaseService<FeiraDTO, CreateFeiraDTO>(
  "/api/v1/feiras",
);

export const feiraService = {
  ...baseService,

  getResumo: (id: string) => {
    return apiClient<ResumoFeiraDTO>(`/api/v1/feiras/${id}/resumo`);
  },

  getDetalhes: (id: string) => {
    return apiClient<FeiraDetalhesDTO>(`/api/v1/feiras/${id}/detalhes`);
  },

  getRateio: (id: string) => {
    return apiClient<FeiraRateioDTO>(`/api/v1/feiras/${id}/rateio`);
  },

  atualizarStatus: (id: string, novoStatus: string) => {
    return apiClient<FeiraDTO>(
      `/api/v1/feiras/${id}/status?novoStatus=${novoStatus}`,
      { method: "PATCH" },
    );
  },

  getEstoques: async (id: string): Promise<EstoqueBancaDTO[]> => {
    interface OfertaEstoqueDTO {
      id: string;
      feira: { id: string; dataHora: string; status: string; ativa: boolean };
      comerciante: { id: string; nome: string };
      produto: {
        id: string;
        nome: string;
        unidadeMedida: string;
        precoBase: number;
      };
      quantidadeDisponivel: number;
    }

    const data = await apiClient<OfertaEstoqueDTO[]>(
      `/api/v1/estoque-bancas/feira/${id}`,
    );

    const map = new Map<string, EstoqueBancaDTO>();

    for (const oferta of data) {
      if (!map.has(oferta.comerciante.id)) {
        map.set(oferta.comerciante.id, {
          id: oferta.comerciante.id,
          comercianteId: oferta.comerciante.id,
          comercianteNome: oferta.comerciante.nome,
          feiraData: oferta.feira.dataHora,
          itens: [],
        });
      }

      map.get(oferta.comerciante.id)!.itens.push({
        id: oferta.produto.id,
        itemNome: oferta.produto.nome,
        quantidadeDisponivel: oferta.quantidadeDisponivel,
        precoBase: oferta.produto.precoBase,
      });
    }

    return Array.from(map.values());
  },

  getItensAgrupados: async (id: string): Promise<ItemAgrupado[]> => {
    interface OfertaEstoqueDTO {
      id: string;
      comerciante: { id: string; nome: string };
      produto: { id: string; nome: string; precoBase: number };
      quantidadeDisponivel: number;
    }

    const data = await apiClient<OfertaEstoqueDTO[]>(
      `/api/v1/estoque-bancas/feira/${id}`,
    );

    const map = new Map<string, ItemAgrupado>();

    for (const oferta of data) {
      if (!map.has(oferta.produto.id)) {
        map.set(oferta.produto.id, {
          id: oferta.produto.id,
          nome: oferta.produto.nome,
          comerciantes: [],
        });
      }

      map.get(oferta.produto.id)!.comerciantes.push({
        id: oferta.comerciante.id,
        nome: oferta.comerciante.nome,
        quantidade: oferta.quantidadeDisponivel,
        valorUnitario: oferta.produto.precoBase,
      });
    }

    return Array.from(map.values());
  },
};
