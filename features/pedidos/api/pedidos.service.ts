import { apiClient } from "@/lib/api-client";
import { type PedidoDTO } from "./types";

/**
 * Serviço de pedidos
 */
export const pedidoService = {
  listar: () => {
    return apiClient<PedidoDTO[]>("/api/pedidos");
  },

  buscarPorId: (id: string) => {
    return apiClient<PedidoDTO>(`/api/pedidos/${id}`);
  },

  listarPorFeira: (feiraId: string) => {
    return apiClient<PedidoDTO[]>(`/api/pedidos?feiraId=${feiraId}`);
  },
};
