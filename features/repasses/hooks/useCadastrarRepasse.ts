"use client";

import { useState, useEffect, useCallback } from "react";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { repasseService } from "@/features/repasses/api/repasses.service";
import {
  type FeiraDTO,
  type FeiraRateioDTO,
  type ComercianteRateioDTO,
} from "@/features/feiras/api/types";

export function useCadastrarRepasse(onSuccess: () => void) {
  const [feirasEncerradas, setFeirasEncerradas] = useState<FeiraDTO[]>([]);
  const [feiraId, setFeiraIdState] = useState("");
  const [rateio, setRateio] = useState<FeiraRateioDTO | null>(null);
  const [repassesExistentes, setRepassesExistentes] = useState<Set<string>>(
    new Set(),
  );
  const [loadingFeiras, setLoadingFeiras] = useState(true);
  const [loadingRateio, setLoadingRateio] = useState(false);
  const [registrando, setRegistrando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    feiraService
      .getAll({ size: 100 })
      .then((page) =>
        setFeirasEncerradas(
          page.content.filter((f) => f.status === "ENCERRADA"),
        ),
      )
      .catch(() => setErro("Não foi possível carregar as feiras encerradas."))
      .finally(() => setLoadingFeiras(false));
  }, []);

  const handleSelecionarFeira = useCallback(async (id: string) => {
    setFeiraIdState(id);
    setRateio(null);
    setRepassesExistentes(new Set());
    setErro(null);
    if (!id) return;
    setLoadingRateio(true);
    try {
      const [rateioData, repassesData] = await Promise.all([
        feiraService.getRateio(id),
        repasseService.listarPorFeira(id),
      ]);
      setRateio(rateioData);
      setRepassesExistentes(
        new Set(repassesData.map((r) => r.rateioResultadoId)),
      );
    } catch {
      setErro("Não foi possível carregar os dados do rateio.");
    } finally {
      setLoadingRateio(false);
    }
  }, []);

  const isComercianteRegistrado = useCallback(
    (comerciante: ComercianteRateioDTO): boolean =>
      comerciante.produtos.length > 0 &&
      comerciante.produtos.every((p) => repassesExistentes.has(p.id)),
    [repassesExistentes],
  );

  const handleRegistrar = async (comerciante: ComercianteRateioDTO) => {
    setRegistrando(comerciante.comerciante.id);
    setErro(null);
    try {
      const pendentes = comerciante.produtos.filter(
        (p) => !repassesExistentes.has(p.id),
      );
      for (const produto of pendentes) {
        await repasseService.registrar(produto.id);
      }
      const repassesAtualizados = await repasseService.listarPorFeira(feiraId);
      setRepassesExistentes(
        new Set(repassesAtualizados.map((r) => r.rateioResultadoId)),
      );
      onSuccess();
    } catch (e: unknown) {
      const err = e as { message?: string };
      setErro(err?.message ?? "Erro ao registrar repasse.");
    } finally {
      setRegistrando(null);
    }
  };

  return {
    feirasEncerradas,
    feiraId,
    handleSelecionarFeira,
    rateio,
    loadingFeiras,
    loadingRateio,
    registrando,
    erro,
    isComercianteRegistrado,
    handleRegistrar,
  };
}
