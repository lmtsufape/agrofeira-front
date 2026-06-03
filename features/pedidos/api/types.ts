export type TipoRetirada = "LOCAL" | "ENTREGA";

export interface ItemPedidoRequest {
  produtoId: string;
  quantidade: number;
}

export interface CreatePedidoDTO {
  feiraId: string;
  tipoRetirada: TipoRetirada;
  itens: ItemPedidoRequest[];
  consumidorId?: string;
}

export interface ItemPedidoDTO {
  produtoId: string;
  nomeItem: string;
  unidadeMedida: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PedidoDTO {
  id: string;
  feiraId: string;
  consumidorNome: string;
  status:
    | "PENDENTE"
    | "AGUARDANDO_SEPARACAO"
    | "PRONTO_RETIRADA"
    | "SAIU_ENTREGA"
    | "ENTREGUE"
    | "CANCELADO";
  tipoRetirada: "ENTREGA" | "RETIRADA";
  taxaEntrega: number;
  valorProdutos: number;
  valorTotal: number;
  itens: ItemPedidoDTO[];
  criadoEm: string;
}
