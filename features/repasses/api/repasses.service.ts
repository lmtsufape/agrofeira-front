import { apiClient } from "@/lib/api-client";
import { type Page } from "@/types/api";
import { type RepasseDTO, type RepasseTotaisDTO } from "./types";

export const repasseService = {
  listar: (page: number = 0, size: number = 10) => {
    return apiClient<Page<RepasseDTO>>(
      `/api/v1/repasses?page=${page}&size=${size}`,
    );
  },

  listarPorFeira: (feiraId: string) => {
    return apiClient<RepasseDTO[]>(`/api/v1/repasses/feira/${feiraId}`);
  },

  totaisPorFeira: (feiraId: string) => {
    return apiClient<RepasseTotaisDTO[]>(
      `/api/v1/repasses/feira/${feiraId}/totais`,
    );
  },

  listarPorComerciante: (comercianteId: string) => {
    return apiClient<RepasseDTO[]>(
      `/api/v1/repasses/comerciante/${comercianteId}`,
    );
  },

  registrar: (rateioResultadoId: string) => {
    return apiClient<RepasseDTO>("/api/v1/repasses", {
      method: "POST",
      body: JSON.stringify({ rateioResultadoId }),
    });
  },
};
