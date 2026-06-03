"use client";

import { useState, useEffect } from "react";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { type FeiraRateioDTO } from "@/features/feiras/api/types";

export function useRateioFeira(feiraId: string | null) {
  const [rateio, setRateio] = useState<FeiraRateioDTO | null>(null);
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
        const data = await feiraService.getRateio(feiraId);
        if (isMounted) {
          setRateio(data);
          setErro(null);
        }
      } catch {
        if (isMounted) {
          setErro("Não foi possível carregar o rateio da feira.");
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

  return { rateio, loading, erro };
}
