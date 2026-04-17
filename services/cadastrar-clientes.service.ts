const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
  const token = localStorage.getItem("ecofeira_token");
  if (!token) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login.",
    );
  }

  const response = await fetch(`${API_URL}/api/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nome: data.name,
      telefone: data.phone,
      descricao: data.description,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao cadastrar cliente: ${error}`);
  }

  return response.json();
};
