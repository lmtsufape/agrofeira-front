import { apiClient } from "@/lib/api-client";

export interface ComercianteData {
  name: string;
  phone: string;
  description: string;
}

export interface ComercianteResponse {
  id: string;
  nome: string;
  telefone: string;
  descricao: string;
  itens?: Array<{
    id: string;
    nome: string;
    unidadeMedida: string;
    precoBase: number;
  }>;
}

export const cadastrarComercianteService = async (
  data: ComercianteData,
): Promise<ComercianteResponse> => {
  return apiClient<ComercianteResponse>("/api/comerciantes", {
    method: "POST",
    body: JSON.stringify({
      nome: data.name,
      telefone: data.phone,
      descricao: data.description,
    }),
  });
};
