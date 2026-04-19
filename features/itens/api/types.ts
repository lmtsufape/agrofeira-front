export interface ItemDTO {
  id: string;
  nome: string;
  descricao?: string;
  categoriaId: string;
  unidadeMedida: string;
}

export type CreateItemDTO = ItemDTO;
