const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface RepasseComercianteDTO {
  id: string;
  comercianteId: string;
  commercianteName: string;
  valor: number;
  mes: number;
  ano: number;
  status: "PENDENTE" | "PAGO";
}

export interface ComercianteDTO {
  id: string;
  nome: string;
  telefone: string;
  descricao: string;
}

export interface RepasseDTO {
  id: string;
  comercianteId: string;
  valor: number;
  mes: number;
  ano: number;
  status: "PENDENTE" | "PAGO";
}

export interface PagamentoDetalhesDTO {
  comerciante: ComercianteDTO;
  repasse: RepasseDTO;
}

export async function listarRepasses(
  token: string,
  mes?: number,
  ano?: number,
): Promise<RepasseComercianteDTO[]> {
  try {
    let url = `${API_URL}/api/repasses`;
    const params = new URLSearchParams();

    if (mes) params.append("mes", mes.toString());
    if (ano) params.append("ano", ano.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar repasses");
    }

    const data = await response.json();
    // Se a resposta for um array simples, retorna direto
    // Se for um objeto com propriedade 'content' ou 'data', extrai o array
    return Array.isArray(data) ? data : data.content || data.data || [];
  } catch (error) {
    console.error("Erro ao listar repasses:", error);
    throw error;
  }
}

export async function confirmarPagamento(
  token: string,
  comercianteId: string,
): Promise<RepasseDTO> {
  const url = `${API_URL}/api/repasses/comerciantes/${comercianteId}/confirmar`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro na resposta:", response.status, errorData);
      throw new Error(
        errorData?.message ||
          `Erro ao confirmar pagamento: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao chamar API:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro de conexão com o servidor");
  }
}

export async function obterDetalhesRepasse(
  token: string,
  comercianteId: string,
): Promise<RepasseDTO> {
  const response = await fetch(
    `${API_URL}/api/repasses/comerciantes/${comercianteId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do repasse");
  }

  return response.json();
}

export async function obterComercianteDetalhes(
  token: string,
  comercianteId: string,
): Promise<ComercianteDTO> {
  try {
    const response = await fetch(
      `${API_URL}/api/comerciantes/${comercianteId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar comerciante");
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar comerciante:", error);
    throw error;
  }
}

export async function obterPagamentoDetalhes(
  token: string,
  comercianteId: string,
): Promise<PagamentoDetalhesDTO> {
  try {
    const [comercianteData, repasseData] = await Promise.all([
      obterComercianteDetalhes(token, comercianteId),
      obterDetalhesRepasse(token, comercianteId),
    ]);

    return {
      comerciante: comercianteData,
      repasse: repasseData,
    };
  } catch (error) {
    console.error("Erro ao obter detalhes do pagamento:", error);
    throw error;
  }
}
