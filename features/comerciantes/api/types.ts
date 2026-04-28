export interface ComercianteDTO {
  id: string;
  nome: string;
  email?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  telefone?: string | null;
  descricao?: string | null;
  categorias?: string[];
}

export interface CategoriaDTO {
  id: string;
  nome: string;
}

export interface ComercianteComCategoriasDTO extends ComercianteDTO {
  categorias: string[];
}

export interface CreateComercianteDTO extends Omit<ComercianteDTO, "id"> {
  senha?: string;
}
