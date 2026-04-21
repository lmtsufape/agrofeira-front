import { ComercianteDTO } from "@/features/comerciantes/api/types";

export interface RelatorioDTO {
  id: string;
  mes: string;
  ano: number;
  titulo: string;
  valor: number;
  status: string;
}

export interface RepasseComercianteDTO {
  id: string;
  comercianteId: string;
  commercianteName: string;
  valor: number;
  mes: number;
  ano: number;
  status: "PENDENTE" | "PAGO";
}

export interface RepasseDTO {
  id: string;
  comercianteId: string;
  valor: number;
  mes: number;
  ano: number;
  status: "PENDENTE" | "PAGO";
}

export interface PagamentoDetalhesDTO {
  comerciante: ComercianteDTO;
  repasse: RepasseDTO;
}
