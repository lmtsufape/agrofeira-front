const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ClienteDTO {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  descricao?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  dataCadastro?: string;
}

function getToken(): string {
  const token = localStorage.getItem("ecofeira_token");
  if (!token) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login.",
    );
  }
  return token;
}

export async function listarClientes(): Promise<ClienteDTO[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/clientes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar clientes");
  }

  return response.json();
}

export async function buscarClientePorId(
  clienteId: string,
): Promise<ClienteDTO> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/clientes/${clienteId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar cliente");
  }

  return response.json();
}

export async function atualizarCliente(
  clienteId: string,
  dados: Partial<ClienteDTO>,
): Promise<ClienteDTO> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/clientes/${clienteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar cliente");
  }

  return response.json();
}

export async function deletarCliente(clienteId: string): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/clientes/${clienteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar cliente");
  }
}
