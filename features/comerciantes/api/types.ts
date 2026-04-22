export interface ComercianteDTO {
  id: string;
  nome: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  telefone: string;
  descricao?: string;
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
  password?: string;
}
