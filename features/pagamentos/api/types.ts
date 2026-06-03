export interface RelatorioDTO {
  id: string;
  titulo: string;
  tipo: string;
  conteudo: string | null;
  criadoEm: string;
}

export interface UsuarioResumoDTO {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
}

export interface RepasseDTO {
  id: string;
  rateioResultadoId: string;
  comerciante: UsuarioResumoDTO;
  feiraId: string;
  produtoNome: string;
  produtoUnidade: string;
  quantidadeVendida: number;
  valorBruto: number;
  valorLiquido: number;
  status: string;
  repassadoEm: string | null;
  criadoEm: string;
}

export interface PagamentoDetalhesDTO {
  repasse: RepasseDTO;
}

export interface FaturamentoMensalDTO {
  ano: number;
  mes: number;
  mesLabel: string;
  totalBruto: number;
  totalLiquido: number;
  quantidadeRepasses: number;
}

export interface FeiraDTO {
  id: string;
  dataHora: string;
  status: string;
  ativa: boolean;
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

export interface RepasseTotaisDTO {
  comerciante: UsuarioResumoDTO;
  totalBruto: number;
  totalLiquido: number;
  quantidadeRepasses: number;
}
