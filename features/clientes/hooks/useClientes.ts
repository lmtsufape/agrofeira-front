import { useState, useEffect, useMemo, useCallback } from "react";
import { clienteService } from "../api/clientes.service";
import { ClienteDTO } from "../api/types";

export function useClientes() {
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClientes = useCallback(async () => {
    try {
      const data = await clienteService.getAll();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchClientes();
    };
    init();
  }, [fetchClientes]);

  const filteredClientes = useMemo(() => {
    return clientes.filter((c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, clientes]);

  return {
    clientes,
    filteredClientes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh: fetchClientes,
  };
}
