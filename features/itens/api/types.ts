export interface ItemDTO {
  id: string;
  nome: string;
  valor: string;
  unidadeMedida: string;
  categoriaId?: string;
  dataCadastro?: string;
}

export type CreateItemDTO = Omit<ItemDTO, "id">;
