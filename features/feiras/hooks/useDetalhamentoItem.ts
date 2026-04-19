"use client";

import { useCallback } from "react";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type ItemAgrupado } from "@/features/feiras/api/types";
import { useFetchFeiraData } from "./useFetchFeiraData";

export function useDetalhamentoItem(
  token: string | null,
  feiraId: string | null,
) {
  const fetchFn = useCallback(
    (id: string) => feiraService.getItensAgrupados(id),
    [],
  );

  const { data, selected, setSelected, loading, erro } =
    useFetchFeiraData<ItemAgrupado>(
      token,
      feiraId,
      fetchFn,
      "Erro ao carregar os dados dos itens. Tente novamente.",
    );

  return {
    itens: data,
    selected,
    setSelected,
    loading,
    erro,
  };
}
