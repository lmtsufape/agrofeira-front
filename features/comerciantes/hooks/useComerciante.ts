import { useState, useEffect, useCallback } from "react";
import { comercianteService } from "../api/comerciantes.service";
import { ComercianteDTO, CategoriaDTO } from "../api/types";

export function useComerciante(comercianteId: string) {
  const [comerciante, setComerciante] = useState<ComercianteDTO | null>(null);
  const [allCategories, setAllCategories] = useState<CategoriaDTO[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    descricao: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [comercianteData, categoriesData, comercianteCategorias] =
        await Promise.all([
          comercianteService.getById(comercianteId),
          comercianteService.listarCategorias(),
          comercianteService.buscarCategoriasComerciante(comercianteId),
        ]);

      setComerciante(comercianteData);
      setAllCategories(categoriesData);
      setActiveCategories(comercianteCategorias);
      setFormData({
        nome: comercianteData.nome,
        telefone: comercianteData.telefone,
        descricao: comercianteData.descricao || "",
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }, [comercianteId]);

  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();
  }, [fetchData]);

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
          newActiveCategories || activeCategories,
        ),
      ]);
      await fetchData();
    } catch (err) {
      throw err;
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
      setActiveCategories(categoryIds);
    } catch (err) {
      throw err;
    } finally {
      setSavingChanges(false);
    }
  };

  return {
    comerciante,
    allCategories,
    activeCategories,
    setActiveCategories,
    formData,
    loading,
    error,
    savingChanges,
    handleFormChange,
    saveChanges,
    updateCategories,
    refresh: fetchData,
  };
}
