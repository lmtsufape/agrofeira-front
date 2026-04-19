"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type FeiraDTO } from "@/features/feiras/api/types";

const MOCK_FEIRAS: FeiraDTO[] = [
  {
    id: "mock-1",
    dataHora: new Date().toISOString(),
    status: "ABERTA_PEDIDOS",
    comerciantes: [],
    itens: [],
  },
  {
    id: "mock-2",
    dataHora: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: "ABERTA_OFERTAS",
    comerciantes: [],
    itens: [],
  },
  {
    id: "mock-3",
    dataHora: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: "FINALIZADA",
    comerciantes: [],
    itens: [],
  },
];

export function useFeiras() {
  const { token } = useAuth();
  const [feiras, setFeiras] = useState<FeiraDTO[]>([]);
  const [selected, setSelected] = useState<FeiraDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeiras() {
      if (!token || token === "mock-token-dev") {
        setFeiras(MOCK_FEIRAS);
        setLoading(false);
        return;
      }
      try {
        const data = await feiraService.getAll();
        setFeiras(data);
      } catch {
        setFeiras(MOCK_FEIRAS);
        setError(
          "Não foi possível carregar as feiras da API, usando dados locais.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchFeiras();
  }, [token]);

  return {
    feiras,
    selected,
    setSelected,
    loading,
    error,
    isFeiraSelected: selected !== null,
  };
}
