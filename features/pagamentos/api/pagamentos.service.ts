import { apiClient } from "@/lib/api-client";
import {
  RelatorioDTO,
  RepasseDTO,
  PagamentoDetalhesDTO,
  FaturamentoMensalDTO,
  FeiraDTO,
  FeiraDetalhesDTO,
  RepasseTotaisDTO,
} from "./types";

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const pagamentosService = {
  listarRelatorios: async (): Promise<RelatorioDTO[]> => {
    const page =
      await apiClient<SpringPage<RelatorioDTO>>("/api/v1/relatorios");
    return page.content;
  },

  listarRepasses: async (): Promise<RepasseDTO[]> => {
    const page = await apiClient<SpringPage<RepasseDTO>>("/api/v1/repasses");
    return page.content;
  },

  listarRepassesPorComerciante: (
    comercianteId: string,
  ): Promise<RepasseDTO[]> =>
    apiClient<RepasseDTO[]>(`/api/v1/repasses/comerciante/${comercianteId}`),

  obterPagamentoDetalhes: async (
    comercianteId: string,
  ): Promise<PagamentoDetalhesDTO> => {
    const repasses =
      await pagamentosService.listarRepassesPorComerciante(comercianteId);
    if (repasses.length === 0) {
      throw new Error("Nenhum repasse encontrado para este comerciante");
    }
    return { repasse: repasses[0] };
  },

  relatorioMensal: (ano?: number): Promise<FaturamentoMensalDTO[]> =>
    apiClient<FaturamentoMensalDTO[]>(
      `/api/v1/relatorios/por-mes${ano ? `?ano=${ano}` : ""}`,
    ),

  relatorioGeralPorComerciante: (): Promise<RepasseTotaisDTO[]> =>
    apiClient<RepasseTotaisDTO[]>("/api/v1/relatorios/por-comerciante"),

  listarFeiras: async (): Promise<FeiraDTO[]> => {
    const page = await apiClient<SpringPage<FeiraDTO>>(
      "/api/v1/feiras?size=100",
    );
    return page.content;
  },

  detalhesFeira: (id: string): Promise<FeiraDetalhesDTO> =>
    apiClient<FeiraDetalhesDTO>(`/api/v1/feiras/${id}/detalhes`),

  totaisRepassesPorFeira: (feiraId: string): Promise<RepasseTotaisDTO[]> =>
    apiClient<RepasseTotaisDTO[]>(`/api/v1/repasses/feira/${feiraId}/totais`),
};
