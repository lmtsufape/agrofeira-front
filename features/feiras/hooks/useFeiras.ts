"use client";

import { useState } from "react";
import useSWR from "swr";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type FeiraDTO, type FeiraStatus } from "@/features/feiras/api/types";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export function useFeiras() {
  const { isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<FeiraDTO | null>(null);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [erroStatus, setErroStatus] = useState<string | null>(null);

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(
    isAuthenticated ? "/api/v1/feiras?size=100" : null,
    () => feiraService.getAll({ size: 100 }),
    { revalidateOnFocus: false },
  );

  const handleAtualizarStatus = async (novoStatus: FeiraStatus) => {
    if (!selected) return;
    setErroStatus(null);
    setAtualizandoStatus(true);
    try {
      const atualizada = await feiraService.atualizarStatus(
        selected.id,
        novoStatus,
      );
      setSelected(atualizada);
      await mutate();
    } catch {
      setErroStatus("Não foi possível atualizar o status da feira.");
    } finally {
      setAtualizandoStatus(false);
    }
  };

  return {
    feiras: data?.content ?? [],
    selected,
    setSelected,
    loading,
    error: error ? "Não foi possível carregar as feiras." : null,
    isFeiraSelected: selected !== null,
    atualizandoStatus,
    erroStatus,
    handleAtualizarStatus,
  };
}
