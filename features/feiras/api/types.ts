export type FeiraStatus =
  | "RASCUNHO"
  | "ABERTA"
  | "ENCERRADA"
  | "FINALIZADA"
  | "CANCELADA";

export interface FeiraDTO {
  id: string;
  dataHora: string;
  status: FeiraStatus;
  ativa: boolean;
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
  dataHora: string;
  status?: FeiraStatus;
  comercianteIds: string[];
  produtoIds: string[];
}

export interface FeiraDetalhesDTO {
  id: string;
  dataHora: string;
  status: string;
  totalPedidos: number;
  totalComerciantes: number;
  totalProdutos: number;
  valorTotalPedidos: number;
  valorTotalProdutos: number;
  totalTaxasEntrega: number;
  pedidosPorStatus: Record<string, number>;
  totalRateado: number;
}

export interface RateioResultadoDTO {
  id: string;
  produto: {
    id: string;
    nome: string;
    categoria: string;
    unidadeMedida: string;
    precoBase: number;
  };
  quantidadeSequestrada: number;
  valorBrutoVenda: number;
  statusProcessamento: string;
}

export interface ComercianteRateioDTO {
  comerciante: {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    descricao: string | null;
    perfis: string[];
  };
  produtos: RateioResultadoDTO[];
  totalSequestrado: number;
  totalBrutoVenda: number;
}

export interface FeiraRateioDTO {
  feiraId: string;
  totalRateado: number;
  totalComerciantes: number;
  comerciantes: ComercianteRateioDTO[];
}
