export interface ClienteDTO {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  descricao?: string | null;
  cep?: string | null;
  rua?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  dataCadastro?: string | null;
}

export interface CreateClienteDTO extends Omit<ClienteDTO, "id"> {
  senha?: string;
}
