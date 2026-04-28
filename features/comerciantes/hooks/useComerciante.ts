"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { comercianteService } from "../api/comerciantes.service";
import { ComercianteDTO, CategoriaDTO } from "../api/types";

export function useComerciante(comercianteId: string) {
  // Queries individuais via SWR
  const {
    data: comerciante,
    error: comercianteError,
    isLoading: isLoadingComerciante,
    mutate: mutateComerciante,
  } = useSWR<ComercianteDTO>(
    `/api/v1/comerciantes/${comercianteId}`,
    swrFetcher,
  );

  const { data: allCategories, isLoading: isLoadingCategories } = useSWR<
    CategoriaDTO[]
  >("/api/v1/categorias", swrFetcher);

  const {
    data: activeCategories,
    mutate: mutateActiveCategories,
    isLoading: isLoadingActiveCategories,
  } = useSWR<string[]>(
    `/api/v1/comerciantes/${comercianteId}/categorias`,
    async () => {
      return comercianteService.buscarCategoriasComerciante(comercianteId);
    },
  );

  const [savingChanges, setSavingChanges] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    descricao: "",
  });

  // Sincroniza o formData quando o comerciante termina de carregar
  useEffect(() => {
    if (comerciante && !formData.nome && !formData.telefone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nome: comerciante.nome,
        telefone: comerciante.telefone || "",
        email: comerciante.email || "",
        descricao: comerciante.descricao || "",
      });
    }
  }, [comerciante, formData.nome, formData.telefone]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async (newActiveCategories?: string[]) => {
    try {
      setSavingChanges(true);
      await Promise.all([
        comercianteService.update(comercianteId, formData),
        comercianteService.atualizarCategoriasComerciante(
          comercianteId,
          newActiveCategories || activeCategories || [],
        ),
      ]);
      // Revalida os dados no SWR
      await Promise.all([mutateComerciante(), mutateActiveCategories()]);
    } finally {
      setSavingChanges(false);
    }
  };

  const updateCategories = async (categoryIds: string[]) => {
    try {
      setSavingChanges(true);
      await comercianteService.atualizarCategoriasComerciante(
        comercianteId,
        categoryIds,
      );
      await mutateActiveCategories(categoryIds, false);
    } finally {
      setSavingChanges(false);
    }
  };

  const isLoading =
    isLoadingComerciante || isLoadingCategories || isLoadingActiveCategories;
  const error = comercianteError
    ? comercianteError instanceof Error
      ? comercianteError.message
      : "Erro ao carregar"
    : null;

  return {
    comerciante,
    allCategories: allCategories || [],
    activeCategories: activeCategories || [],
    formData,
    loading: isLoading,
    error,
    savingChanges,
    handleFormChange,
    saveChanges,
    updateCategories,
    refresh: () => {
      mutateComerciante();
      mutateActiveCategories();
    },
  };
}
