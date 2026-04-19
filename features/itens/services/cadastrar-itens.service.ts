import { apiClient } from "@/lib/api-client";

export interface ItemData {
  name: string;
  unit: string;
  price: string;
}

export interface ItemResponse {
  id: string;
  nome: string;
  unidadeMedida: string;
  precoBase: number;
}

export const cadastrarItemService = async (
  data: ItemData,
): Promise<ItemResponse> => {
  return apiClient<ItemResponse>("/api/itens", {
    method: "POST",
    body: JSON.stringify({
      nome: data.name,
      unidadeMedida: data.unit,
      precoBase: Number.parseFloat(data.price),
    }),
  });
};
