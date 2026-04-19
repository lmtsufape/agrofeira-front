"use client";

import { useState, useEffect } from "react";

export function useFetchFeiraData<T>(
  token: string | null,
  feiraId: string | null,
  fetchFn: (feiraId: string) => Promise<T[]>,
  errorMessage: string = "Erro ao carregar os dados. Tente novamente.",
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<T | null>(null);

  useEffect(() => {
    if (!token || !feiraId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const fetchedData = await fetchFn(feiraId!);
        if (isMounted) {
          setData(fetchedData);
          setErro(null);
        }
      } catch {
        if (isMounted) {
          setErro(errorMessage);
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
  }, [token, feiraId, fetchFn, errorMessage]);

  return {
    data,
    selected,
    setSelected,
    loading,
    erro,
  };
}
