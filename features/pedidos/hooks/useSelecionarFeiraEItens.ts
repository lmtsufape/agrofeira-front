"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import { type Page } from "@/types/api";

export interface Feira {
  id: string;
  dataHora: string;
  status: string;
}

export interface ItemDisponivel {
  id: string;
  nome: string;
  unidadeMedida: string;
  precoBase: number;
  quantidadeDisponivel: number;
  quantidade: number;
}

interface RawFeira {
  id: string;
  dataHora: string;
  status: string;
  ativa: boolean;
}

interface RawOferta {
  id: string;
  produto: {
    id: string;
    nome: string;
    unidadeMedida: string;
    precoBase: number;
  };
  quantidadeDisponivel: number;
}

export function useSelecionarFeiraEItens() {
  const [selectedFeira, setSelectedFeira] = useState<Feira | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantidades, setQuantidades] = useState<Record<string, number>>({});

  const { data: feirasPage, isLoading: loadingFeiras } = useSWR(
    "/api/v1/feiras?size=100",
    () => apiClient<Page<RawFeira>>("/api/v1/feiras?size=100"),
    { revalidateOnFocus: false },
  );

  const { data: ofertasData } = useSWR(
    selectedFeira ? `/api/v1/estoque-bancas/feira/${selectedFeira.id}` : null,
    () =>
      apiClient<RawOferta[]>(
        `/api/v1/estoque-bancas/feira/${selectedFeira!.id}`,
      ),
    { revalidateOnFocus: false },
  );

  const feiras: Feira[] = useMemo(
    () =>
      (feirasPage?.content ?? []).map((f) => ({
        id: String(f.id),
        dataHora: String(f.dataHora),
        status: f.status,
      })),
    [feirasPage],
  );

  const itens: ItemDisponivel[] = useMemo(() => {
    if (!ofertasData) return [];
    const map = new Map<string, ItemDisponivel>();
    for (const oferta of ofertasData) {
      const { id, nome, unidadeMedida, precoBase } = oferta.produto;
      if (!map.has(id)) {
        map.set(id, {
          id,
          nome,
          unidadeMedida,
          precoBase: Number(precoBase),
          quantidadeDisponivel: Number(oferta.quantidadeDisponivel),
          quantidade: quantidades[id] ?? 0,
        });
      } else {
        map.get(id)!.quantidadeDisponivel += Number(
          oferta.quantidadeDisponivel,
        );
      }
    }
    return Array.from(map.values());
  }, [ofertasData, quantidades]);

  const feirasFiltradasPorPesquisa = feiras.filter((feira) =>
    new Date(feira.dataHora).toLocaleDateString("pt-BR").includes(searchTerm),
  );

  const itensSelecionados = itens.filter((item) => item.quantidade > 0);

  const handleQuantidadeChange = (id: string, delta: number) => {
    setQuantidades((prev) => {
      const current = prev[id] ?? 0;
      const item = itens.find((i) => i.id === id);
      const max = item?.quantidadeDisponivel ?? Infinity;
      return { ...prev, [id]: Math.min(max, Math.max(0, current + delta)) };
    });
  };

  return {
    feiras,
    feirasFiltradasPorPesquisa,
    selectedFeira,
    setSelectedFeira,
    searchTerm,
    setSearchTerm,
    itens,
    itensSelecionados,
    handleQuantidadeChange,
    loading: loadingFeiras,
  };
}
