"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { clienteService } from "@/features/clientes/api/clientes.service";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";

interface Participante {
  id: string;
  nome: string;
  tipo: "cliente" | "comerciante";
  telefone?: string | null;
}

export function useSelecionarParticipante() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipante, setSelectedParticipante] =
    useState<Participante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipantes = useCallback(async () => {
    try {
      setError(null);
      const [clientesPage, comerciantesPage] = await Promise.all([
        clienteService.getAll(),
        comercianteService.getAll(),
      ]);

      const participantesData: Participante[] = [
        ...clientesPage.content.map((c) => ({
          id: c.id,
          nome: c.nome,
          tipo: "cliente" as const,
          telefone: c.telefone,
        })),
        ...comerciantesPage.content.map((com) => ({
          id: com.id,
          nome: com.nome,
          tipo: "comerciante" as const,
          telefone: com.telefone,
        })),
      ];

      setParticipantes(participantesData);
    } catch {
      setError("Não foi possível carregar os participantes. Tente novamente.");
      setParticipantes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchParticipantes();
  }, [fetchParticipantes]);

  const filteredParticipantes = useMemo(() => {
    return participantes.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, participantes]);

  return {
    participantes,
    filteredParticipantes,
    searchTerm,
    setSearchTerm,
    selectedParticipante,
    setSelectedParticipante,
    loading,
    error,
    retry: fetchParticipantes,
  };
}
