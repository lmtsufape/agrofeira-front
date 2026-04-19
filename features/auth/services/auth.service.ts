export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}
// USA MOCK DE LOGIN PARA FACILITAR OS TESTES
// TODO: Implementar integração real com backend usando o endpoint de login da API RESTful.
const MOCK_USERS = [
  { username: "admin", password: "123456" },
  { username: "gerenciador", password: "123456" },
];

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  // Simula delay de rede
  await new Promise((res) => setTimeout(res, 600));

  const user = MOCK_USERS.find(
    (u) => u.username === data.username && u.password === data.password,
  );

  if (!user) throw new Error("Usuário ou senha inválidos");

  return {
    token: "mock-token-dev",
    username: user.username,
  };
}

export async function forgotPassword(username: string): Promise<void> {
  // Simula delay de rede
  await new Promise((res) => setTimeout(res, 800));

  const user = MOCK_USERS.find((u) => u.username === username);

  if (!user) {
    throw new Error("Usuário não encontrado em nossa base de dados");
  }
  // TODO: Implementar lógica real de recuperação de senha, como envio de email com link de redefinição.
  return;
}
