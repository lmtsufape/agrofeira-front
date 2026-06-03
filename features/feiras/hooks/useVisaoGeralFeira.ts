"use client";

import { useState, useEffect } from "react";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type FeiraDetalhesDTO } from "@/features/feiras/api/types";

export function useVisaoGeralFeira(feiraId: string | null) {
  const [detalhes, setDetalhes] = useState<FeiraDetalhesDTO | null>(null);
  const [loading, setLoading] = useState(!!feiraId);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!feiraId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await feiraService.getDetalhes(feiraId);
        if (isMounted) {
          setDetalhes(data);
          setErro(null);
        }
      } catch {
        if (isMounted) {
          setErro("Não foi possível carregar os detalhes da feira.");
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
  }, [feiraId]);

  return { detalhes, loading, erro };
}
