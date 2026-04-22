const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ComercianteDTO {
  id: string;
  nome: string;
  telefone: string;
  descricao: string;
  categorias?: string[];
}

export interface CategoriaDTO {
  id: string;
  nome: string;
}

export interface ComercianteComCategoriasDTO extends ComercianteDTO {
  categorias: string[];
}

function getToken(): string {
  const token = localStorage.getItem("ecofeira_token");
  if (!token) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login.",
    );
  }
  return token;
}

export async function listarComerciantes(): Promise<ComercianteDTO[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/comerciantes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar comerciantes");
  }

  return response.json();
}

export async function buscarComerciantePorId(
  comercianteId: string,
): Promise<ComercianteDTO> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/comerciantes/${comercianteId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar comerciante");
  }

  return response.json();
}

export async function listarCategorias(): Promise<CategoriaDTO[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/categorias`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return response.json();
}

export async function buscarCategoriasComerciatne(
  comercianteId: string,
): Promise<string[]> {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/api/comerciantes/${comercianteId}/categorias`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias do comerciante");
  }

  const data = await response.json();
  return data.categorias || [];
}

export async function atualizarCategoriasComerciatne(
  comercianteId: string,
  categoriaIds: string[],
): Promise<ComercianteComCategoriasDTO> {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/api/comerciantes/${comercianteId}/categorias`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categorias: categoriaIds }),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar categorias do comerciante");
  }

  return response.json();
}

export async function atualizarComerciatne(
  comercianteId: string,
  dados: Partial<ComercianteDTO>,
): Promise<ComercianteDTO> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/comerciantes/${comercianteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar comerciante");
  }

  return response.json();
}
