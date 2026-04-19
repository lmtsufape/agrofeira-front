"use client";

import { useState, useEffect } from "react";
import {
  listarEstoquePorFeira,
  type EstoqueBancaDTO,
} from "@/features/feiras/services/feiras.service";

export function useDetalhamentoComerciante(
  token: string | null,
  feiraId: string | null,
) {
  const [bancas, setBancas] = useState<EstoqueBancaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<EstoqueBancaDTO | null>(null);

  useEffect(() => {
    if (!token || !feiraId) return;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await listarEstoquePorFeira(token!, feiraId!);
        setBancas(data);
        setErro(null);
      } catch {
        setErro("Erro ao carregar os dados das bancas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, feiraId]);

  return {
    bancas,
    selected,
    setSelected,
    loading,
    erro,
  };
}
