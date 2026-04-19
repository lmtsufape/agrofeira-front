"use client";

import { useState, useEffect } from "react";
import {
  fetchItensComComerciantes,
  type ItemAgrupado,
} from "@/features/feiras/services/feiras.service";

export function useDetalhamentoItem(
  token: string | null,
  feiraId: string | null,
) {
  const [itens, setItens] = useState<ItemAgrupado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<ItemAgrupado | null>(null);

  useEffect(() => {
    if (!token || !feiraId) return;

    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchItensComComerciantes(token!, feiraId!);
        setItens(data);
        setErro(null);
      } catch {
        setErro("Erro ao carregar os dados dos itens. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, feiraId]);

  return {
    itens,
    selected,
    setSelected,
    loading,
    erro,
  };
}
