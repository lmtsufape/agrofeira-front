import { apiClient } from "@/lib/api-client";

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
  feiraData?: string;
  itens: ItemEstoqueDTO[];
}

export interface ResumoFeiraDTO {
  feiraId: string;
  dataFeira: string;
  localidade: string;
  items: { id: string; nome: string }[];
  comerciantes: { id: string; nome: string }[];
  clientes: { id: string; nome: string }[];
}

export async function buscarResumoFeira(
  _token: string,
  feiraId: string,
): Promise<ResumoFeiraDTO> {
  return apiClient<ResumoFeiraDTO>(`/api/feiras/${feiraId}/resumo`);
}

export async function listarFeiras(_token?: string): Promise<FeiraDTO[]> {
  // api-client will automatically inject token from localStorage if not passed in options
  return apiClient<FeiraDTO[]>("/api/feiras");
}

export async function listarEstoquePorFeira(
  _token: string, // Kept to match signature if it's strictly needed, but apiClient handles it
  feiraId: string,
): Promise<EstoqueBancaDTO[]> {
  return apiClient<EstoqueBancaDTO[]>(`/api/feiras/${feiraId}/estoques`);
}

export interface ComercianteDeItem {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

export interface ItemAgrupado {
  id: string;
  nome: string;
  comerciantes: ComercianteDeItem[];
}

export async function fetchItensComComerciantes(
  _token: string,
  feiraId: string,
): Promise<ItemAgrupado[]> {
  interface EstoqueBancaItem {
    itemId: string;
    itemNome: string;
    comercianteId: string;
    comercianteNome: string;
    quantidadeDisponivel: number;
    precoBase: number;
  }
  const data = await apiClient<EstoqueBancaItem[]>(
    `/api/estoque-banca?feiraId=${feiraId}`,
  );

  const map = new Map<string, ItemAgrupado>();
  for (const estoque of data) {
    if (!map.has(estoque.itemId)) {
      map.set(estoque.itemId, {
        id: estoque.itemId,
        nome: estoque.itemNome,
        comerciantes: [],
      });
    }
    map.get(estoque.itemId)!.comerciantes.push({
      id: estoque.comercianteId,
      nome: estoque.comercianteNome,
      quantidade: estoque.quantidadeDisponivel,
      valorUnitario: estoque.precoBase,
    });
  }

  return Array.from(map.values());
}
