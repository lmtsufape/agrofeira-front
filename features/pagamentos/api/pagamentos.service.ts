import { apiClient } from "@/lib/api-client";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";
import {
  RelatorioDTO,
  RepasseComercianteDTO,
  RepasseDTO,
  PagamentoDetalhesDTO,
} from "./types";

export const pagamentosService = {
  /**
   * Relatórios
   */
  listarRelatoriosPorMes: (ano: number) => {
    return apiClient<RelatorioDTO[]>(`/api/relatorios/por-mes?ano=${ano}`);
  },

  listarRelatoriosPorComercianteMes: (
    comercianteId: string,
    ano: number,
    mes: number,
  ) => {
    return apiClient<RelatorioDTO[]>(
      `/api/relatorios/por-comerciante/mes?comercianteId=${comercianteId}&ano=${ano}&mes=${mes}`,
    );
  },

  listarRelatoriosPorComercianteAno: (comercianteId: string, ano: number) => {
    return apiClient<RelatorioDTO[]>(
      `/api/relatorios/por-comerciante/ano?comercianteId=${comercianteId}&ano=${ano}`,
    );
  },

  /**
   * Repasses
   */
  listarRepasses: (mes?: number, ano?: number) => {
    const params = new URLSearchParams();
    if (mes) params.append("mes", mes.toString());
    if (ano) params.append("ano", ano.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/repasses?${queryString}` : "/api/repasses";

    return apiClient<RepasseComercianteDTO[]>(url);
  },

  confirmarPagamento: (comercianteId: string) => {
    return apiClient<RepasseDTO>(
      `/api/repasses/comerciantes/${comercianteId}/confirmar`,
      {
        method: "PUT",
      },
    );
  },

  obterDetalhesRepasse: (comercianteId: string) => {
    return apiClient<RepasseDTO>(`/api/repasses/comerciantes/${comercianteId}`);
  },

  /**
   * Composição
   */
  obterPagamentoDetalhes: async (
    comercianteId: string,
  ): Promise<PagamentoDetalhesDTO> => {
    const [comerciante, repasse] = await Promise.all([
      comercianteService.getById(comercianteId),
      pagamentosService.obterDetalhesRepasse(comercianteId),
    ]);

    return {
      comerciante,
      repasse,
    };
  },
};
