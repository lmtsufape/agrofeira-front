"use client";

import { useState } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";
import { itemService } from "@/features/itens/api/itens.service";
import { feiraService } from "@/features/feiras/api/feiras.service";

export interface OfertaCadastrada {
  id: string;
  comerciante: { id: string; nome: string };
  produto: {
    id: string;
    nome: string;
    unidadeMedida: string;
    precoBase: number;
  };
  quantidadeOfertada: number;
  quantidadeReservada: number;
  quantidadeDisponivel: number;
}

export function useEstoqueFeira(feiraId: string) {
  const { data: feira } = useSWR(
    feiraId ? `/api/v1/feiras/${feiraId}` : null,
    () => feiraService.getById(feiraId),
    { revalidateOnFocus: false },
  );

  const {
    data: ofertas,
    mutate: mutateOfertas,
    isLoading: loadingOfertas,
  } = useSWR(
    feiraId ? `/api/v1/estoque-bancas/feira/${feiraId}` : null,
    () =>
      apiClient<OfertaCadastrada[]>(`/api/v1/estoque-bancas/feira/${feiraId}`),
    { revalidateOnFocus: false },
  );

  const { data: comerciantesPage } = useSWR(
    "/api/v1/comerciantes?size=100",
    () => comercianteService.getAll({ size: 100 }),
    { dedupingInterval: 15 * 60 * 1000, revalidateOnFocus: false },
  );

  const { data: itensPage } = useSWR(
    "/api/v1/itens?size=100",
    () => itemService.getAll({ size: 100 }),
    { dedupingInterval: 15 * 60 * 1000, revalidateOnFocus: false },
  );

  const [comercianteId, setComercianteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novaQtd, setNovaQtd] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const handleAdicionar = async () => {
    if (
      !comercianteId ||
      !produtoId ||
      !quantidade ||
      Number(quantidade) <= 0
    ) {
      setErro("Preencha todos os campos corretamente.");
      return;
    }
    setErro(null);
    setSucesso(null);
    setSubmitting(true);
    try {
      await apiClient("/api/v1/estoque-bancas", {
        method: "POST",
        body: JSON.stringify({
          feiraId,
          comercianteId,
          produtoId,
          quantidadeOfertada: Number(quantidade),
        }),
      });
      setSucesso("Oferta cadastrada com sucesso!");
      setComercianteId("");
      setProdutoId("");
      setQuantidade("");
      await mutateOfertas();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErro(
        e?.message ??
          "Erro ao cadastrar oferta. Verifique se já existe uma oferta desse comerciante para esse produto.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const iniciarEdicao = (oferta: OfertaCadastrada) => {
    setEditandoId(oferta.id);
    setNovaQtd(String(oferta.quantidadeOfertada));
    setErro(null);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovaQtd("");
  };

  const handleAtualizar = async (ofertaId: string) => {
    if (!novaQtd || Number(novaQtd) <= 0) {
      setErro("Quantidade inválida.");
      return;
    }
    setEditSubmitting(true);
    setErro(null);
    try {
      await apiClient(`/api/v1/estoque-bancas/${ofertaId}`, {
        method: "PUT",
        body: JSON.stringify({ quantidadeOfertada: Number(novaQtd) }),
      });
      setEditandoId(null);
      setNovaQtd("");
      await mutateOfertas();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErro(e?.message ?? "Erro ao atualizar oferta.");
    } finally {
      setEditSubmitting(false);
    }
  };

  return {
    feira,
    ofertas: ofertas ?? [],
    comerciantes: comerciantesPage?.content ?? [],
    itens: itensPage?.content ?? [],
    loadingOfertas,
    comercianteId,
    setComercianteId,
    produtoId,
    setProdutoId,
    quantidade,
    setQuantidade,
    submitting,
    erro,
    sucesso,
    setSucesso,
    handleAdicionar,
    editandoId,
    novaQtd,
    setNovaQtd,
    editSubmitting,
    iniciarEdicao,
    cancelarEdicao,
    handleAtualizar,
  };
}
