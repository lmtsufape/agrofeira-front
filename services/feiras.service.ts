const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface FeiraDTO {
  id: string;
  dataHora: string;
  status:
    | "RASCUNHO"
    | "ABERTA_OFERTAS"
    | "ABERTA_PEDIDOS"
    | "FINALIZADA"
    | "CANCELADA";
  comerciantes: unknown[];
  itens: unknown[];
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
  itens: ItemEstoqueDTO[];
}

export async function listarFeiras(token: string): Promise<FeiraDTO[]> {
  const response = await fetch(`${API_URL}/api/feiras`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar feiras");
  return response.json();
}

export async function listarEstoquePorFeira(
  token: string,
  feiraId: string
): Promise<EstoqueBancaDTO[]> {
  const response = await fetch(`${API_URL}/api/feiras/${feiraId}/estoques`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar estoques da feira");
  return response.json();
}
