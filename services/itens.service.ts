const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ItemDTO {
  id: string;
  nome: string;
  valor: string;
  unidadeMedida: string;
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

export async function listarItens(): Promise<ItemDTO[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/itens`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar itens");
  }

  return response.json();
}

export async function buscarItensPorId(itemId: string): Promise<ItemDTO> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/itens/${itemId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar item");
  }

  return response.json();
}

export async function atualizarItem(
  itemId: string,
  dados: Partial<ItemDTO>,
): Promise<ItemDTO> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/itens/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar item");
  }

  return response.json();
}

export async function deletarItem(itemId: string): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/itens/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar item");
  }
}
