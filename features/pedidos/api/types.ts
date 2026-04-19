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
  status: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "ENTREGUE";
  tipoRetirada: "ENTREGA" | "RETIRADA";
  taxaEntrega: number;
  valorProdutos: number;
  valorTotal: number;
  itens: ItemPedidoDTO[];
}
