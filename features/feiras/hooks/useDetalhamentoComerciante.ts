"use client";

import { useCallback } from "react";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type EstoqueBancaDTO } from "@/features/feiras/api/types";
import { useFetchFeiraData } from "./useFetchFeiraData";

export function useDetalhamentoComerciante(
  token: string | null,
  feiraId: string | null,
) {
  // useCallback is needed because we pass this function as a dependency to useEffect inside the generic hook
  const fetchFn = useCallback((id: string) => feiraService.getEstoques(id), []);

  const { data, selected, setSelected, loading, erro } =
    useFetchFeiraData<EstoqueBancaDTO>(
      token,
      feiraId,
      fetchFn,
      "Erro ao carregar os dados das bancas. Tente novamente.",
    );

  return {
    bancas: data,
    selected,
    setSelected,
    loading,
    erro,
  };
}
