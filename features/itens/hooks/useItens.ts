import { useState, useEffect, useMemo, useCallback } from "react";
import { itemService } from "../api/itens.service";
import { ItemDTO } from "../api/types";

export function useItens() {
  const [itens, setItens] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItens = useCallback(async () => {
    try {
      const data = await itemService.getAll();
      setItens(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar itens");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchItens();
    };
    init();
  }, [fetchItens]);

  const filteredItens = useMemo(() => {
    return itens.filter((item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, itens]);

  const updateItem = async (itemId: string, dados: Partial<ItemDTO>) => {
    try {
      await itemService.update(itemId, dados);
      await fetchItens();
    } catch (err) {
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await itemService.delete(itemId);
      await fetchItens();
    } catch (err) {
      throw err;
    }
  };

  return {
    itens,
    filteredItens,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    updateItem,
    deleteItem,
    refresh: fetchItens,
  };
}
