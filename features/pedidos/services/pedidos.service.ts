import { apiClient } from "@/lib/api-client";

export interface ItemPedidoDTO {
  id: string;
  itemId: string;
  itemNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PedidoDTO {
  id: string;
  feiraId: string;
  feiraData: string;
  clienteId: string;
  clienteNome: string;
  comercianteVendedorId: string;
  comercianteVendedorNome: string;
  status: string;
  tipoRetirada: string;
  taxaEntrega: number;
  valorProdutos: number;
  valorTotal: number;
  itens: ItemPedidoDTO[];
}

export async function listarTodosPedidos(
  _token?: string,
): Promise<PedidoDTO[]> {
  return apiClient<PedidoDTO[]>("/api/pedidos");
}

export async function listarPedidosPorFeira(
  _token: string | undefined,
  feiraId: string,
): Promise<PedidoDTO[]> {
  return apiClient<PedidoDTO[]>(`/api/pedidos/feira/${feiraId}`);
}

export async function buscarPedidoPorId(
  _token: string | undefined,
  pedidoId: string,
): Promise<PedidoDTO> {
  return apiClient<PedidoDTO>(`/api/pedidos/${pedidoId}`);
}
