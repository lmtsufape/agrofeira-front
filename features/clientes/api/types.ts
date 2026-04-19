export interface ClienteDTO {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento?: string;
}

export interface CreateClienteDTO extends Omit<ClienteDTO, "id"> {
  password?: string;
}
