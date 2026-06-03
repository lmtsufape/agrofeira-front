import { apiClient } from "@/lib/api-client";
import { type Page } from "@/types/api";
import { type PedidoDTO, type CreatePedidoDTO } from "./types";

export const pedidoService = {
  listar: (page: number = 0, size: number = 10) => {
    return apiClient<Page<PedidoDTO>>(
      `/api/v1/pedidos?page=${page}&size=${size}&sort=criadoEm,desc`,
    );
  },

  buscarPorId: (id: string) => {
    return apiClient<PedidoDTO>(`/api/v1/pedidos/${id}`);
  },

  listarPorFeira: (feiraId: string) => {
    return apiClient<PedidoDTO[]>(`/api/v1/pedidos/feira/${feiraId}`);
  },

  atualizarStatus: (id: string, novoStatus: string) => {
    return apiClient<PedidoDTO>(
      `/api/v1/pedidos/${id}/status?novoStatus=${novoStatus}`,
      { method: "PATCH" },
    );
  },

  criar: (data: CreatePedidoDTO) => {
    return apiClient<PedidoDTO>("/api/v1/pedidos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
