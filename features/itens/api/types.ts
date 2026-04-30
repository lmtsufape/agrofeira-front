export interface ItemOpcaoDTO {
  value: string;
  label: string;
}

export interface ItensOpcoesResponseDTO {
  categorias: ItemOpcaoDTO[];
  unidadesMedida: ItemOpcaoDTO[];
}

export interface ItemDTO {
  id: string;
  nome: string;
  precoBase: number;
  unidadeMedida: string;
  categoria: string;
  dataCadastro?: string;
}

export type CreateItemDTO = Omit<ItemDTO, "id">;
