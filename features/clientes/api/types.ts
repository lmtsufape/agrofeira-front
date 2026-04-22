export interface ClienteDTO {
  id: string;
  nome: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  descricao?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  dataCadastro?: string;
}

export interface CreateClienteDTO extends Omit<ClienteDTO, "id"> {
  password?: string;
}
