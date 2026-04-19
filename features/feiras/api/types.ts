export type FeiraStatus =
  | "RASCUNHO"
  | "ABERTA_OFERTAS"
  | "ABERTA_PEDIDOS"
  | "FINALIZADA"
  | "CANCELADA";

export interface FeiraDTO {
  id: string;
  dataHora: string;
  status: FeiraStatus;
  comerciantes: unknown[];
  itens: unknown[];
}

export interface ItemEstoqueDTO {
  id: string;
  itemNome: string;
  quantidadeDisponivel: number;
  precoBase: number;
}

export interface EstoqueBancaDTO {
  id: string;
  comercianteId: string;
  comercianteNome: string;
  feiraData?: string;
  itens: ItemEstoqueDTO[];
}

export interface ResumoFeiraDTO {
  feiraId: string;
  dataFeira: string;
  localidade: string;
  items: { id: string; nome: string }[];
  comerciantes: { id: string; nome: string }[];
  clientes: { id: string; nome: string }[];
}

export interface ItemAgrupado {
  id: string;
  nome: string;
  comerciantes: {
    id: string;
    nome: string;
    quantidade: number;
    valorUnitario: number;
  }[];
}

export interface CreateFeiraDTO {
  feira: {
    dataHora: string;
    status: string;
  };
  comercianteIds: string[];
  itemIds: string[];
}
