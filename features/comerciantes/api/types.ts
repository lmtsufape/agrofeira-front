export interface ComercianteDTO {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  telefone: string;
}

export interface CreateComercianteDTO extends Omit<ComercianteDTO, "id"> {
  password?: string;
}
