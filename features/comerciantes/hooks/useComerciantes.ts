import { useState, useEffect, useMemo, useCallback } from "react";
import { comercianteService } from "../api/comerciantes.service";
import { ComercianteDTO } from "../api/types";

export function useComerciantes() {
  const [comerciantes, setComerciantes] = useState<ComercianteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchComerciantes = useCallback(async () => {
    try {
      const data = await comercianteService.getAll();
      setComerciantes(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar comerciantes",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchComerciantes();
    };
    init();
  }, [fetchComerciantes]);

  const filteredComerciantes = useMemo(() => {
    return comerciantes.filter((c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, comerciantes]);

  return {
    comerciantes,
    filteredComerciantes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh: fetchComerciantes,
  };
}
