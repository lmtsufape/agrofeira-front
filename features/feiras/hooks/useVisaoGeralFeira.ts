"use client";

import { useState, useEffect } from "react";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type ResumoFeiraDTO } from "@/features/feiras/api/types";

const MOCK_RESUMO: ResumoFeiraDTO = {
  feiraId: "f-1",
  dataFeira: "25/04/2025",
  localidade: "Garanhuns - PE",
  items: [
    { id: "i-1", nome: "Alface Crespa" },
    { id: "i-2", nome: "Tomate Caqui" },
    { id: "i-3", nome: "Cenoura Orgânica" },
  ],
  comerciantes: [
    { id: "com-1", nome: "Sítio Primavera" },
    { id: "com-2", nome: "Fazenda Monte Verde" },
  ],
  clientes: [
    { id: "c-1", nome: "João Silva" },
    { id: "c-2", nome: "Maria Santos" },
  ],
};

export function useVisaoGeralFeira(
  token: string | null,
  feiraId: string | null,
) {
  const [resumo, setResumo] = useState<ResumoFeiraDTO | null>(null);
  const [loading, setLoading] = useState(!!(token && feiraId));
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!token || !feiraId) {
        if (isMounted) setLoading(false);
        return;
      }

      if (token === "mock-token-dev") {
        if (isMounted) {
          setResumo(MOCK_RESUMO);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await feiraService.getResumo(feiraId);
        if (isMounted) {
          setResumo(data);
          setErro(null);
        }
      } catch {
        if (isMounted) {
          setErro(
            "Não foi possível carregar o resumo da feira. Usando dados locais.",
          );
          setResumo(MOCK_RESUMO);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token, feiraId]);

  return { resumo, loading, erro };
}
