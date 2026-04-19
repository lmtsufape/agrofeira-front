import { apiClient } from "@/lib/api-client";

export interface ComercianteDTO {
  id: string;
  nome: string;
  telefone: string | null;
  descricao: string | null;
  itens: ItemDTO[];
}

export interface ItemDTO {
  id: string;
  nome: string;
  unidadeMedida: string;
  precoBase: number;
}

export interface CriarFeiraRequest {
  feira: {
    dataHora: string;
    status: "AGENDADA";
  };
  comercianteIds: string[];
  itemIds: string[];
}

export function listarComerciantes(_token?: string): Promise<ComercianteDTO[]> {
  return apiClient<ComercianteDTO[]>("/api/comerciantes");
}

export function listarItens(_token?: string): Promise<ItemDTO[]> {
  return apiClient<ItemDTO[]>("/api/itens");
}

export function criarFeira(
  _token: string | undefined,
  data: CriarFeiraRequest,
) {
  return apiClient<unknown>("/api/feiras", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
