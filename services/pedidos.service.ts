const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

export async function listarPedidosPorFeira(
  token: string,
  feiraId: string
): Promise<PedidoDTO[]> {
  const response = await fetch(`${API_URL}/api/pedidos/feira/${feiraId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Erro ao buscar pedidos da feira");
  return response.json();
}