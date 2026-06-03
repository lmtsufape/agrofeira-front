export interface ComercianteResumoDTO {
  id: string;
  nome: string;
  email: string;
}

export interface RepasseDTO {
  id: string;
  rateioResultadoId: string;
  comerciante: ComercianteResumoDTO;
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

export interface RepasseTotaisDTO {
  comerciante: ComercianteResumoDTO;
  totalBruto: number;
  totalLiquido: number;
  quantidadeRepasses: number;
}
