import { apiClient } from "@/lib/api-client";

export interface ClienteData {
  name: string;
  phone: string;
  description: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface ClienteResponse {
  id: string;
  nome: string;
  telefone: string;
  descricao: string;
}

export const cadastrarClienteService = async (
  data: ClienteData,
): Promise<ClienteResponse> => {
  return apiClient<ClienteResponse>("/api/clientes", {
    method: "POST",
    body: JSON.stringify({
      nome: data.name,
      telefone: data.phone,
      descricao: data.description,
    }),
  });
};
