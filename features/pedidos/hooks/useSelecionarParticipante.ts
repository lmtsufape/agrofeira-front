import { useState, useEffect, useMemo, useCallback } from "react";
import { clienteService } from "@/features/clientes/api/clientes.service";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";

interface Participante {
  id: string;
  nome: string;
  tipo: "cliente" | "comerciante";
  telefone?: string;
}

const MOCK_PARTICIPANTES: Participante[] = [
  {
    id: "cliente-1",
    nome: "João da Silva",
    tipo: "cliente",
    telefone: "(11) 98765-4321",
  },
  {
    id: "cliente-2",
    nome: "Maria José Jacinto",
    tipo: "cliente",
    telefone: "(11) 98765-4322",
  },
  {
    id: "cliente-3",
    nome: "Zé Maria da Silva",
    tipo: "cliente",
    telefone: "(11) 98765-4323",
  },
  {
    id: "comerciante-1",
    nome: "Alisson Manoel",
    tipo: "comerciante",
    telefone: "(11) 98765-4324",
  },
  {
    id: "comerciante-2",
    nome: "Pedro Paulo Santos",
    tipo: "comerciante",
    telefone: "(11) 98765-4325",
  },
  {
    id: "comerciante-3",
    nome: "Ana Carolina Ribeiro",
    tipo: "comerciante",
    telefone: "(11) 98765-4326",
  },
];

export function useSelecionarParticipante() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipante, setSelectedParticipante] =
    useState<Participante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipantes = useCallback(async () => {
    try {
      const [clientes, comerciantes] = await Promise.all([
        clienteService.getAll(),
        comercianteService.getAll(),
      ]);

      const participantesData: Participante[] = [
        ...clientes.map((c) => ({
          id: c.id,
          nome: c.nome,
          tipo: "cliente" as const,
          telefone: c.telefone,
        })),
        ...comerciantes.map((com) => ({
          id: com.id,
          nome: com.nome,
          tipo: "comerciante" as const,
          telefone: com.telefone,
        })),
      ];

      setParticipantes(participantesData);
      setError(null);
    } catch {
      setParticipantes(MOCK_PARTICIPANTES);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchParticipantes();
    };
    init();
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
  };
}
