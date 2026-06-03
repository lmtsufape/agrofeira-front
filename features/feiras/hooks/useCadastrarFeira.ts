"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";
import { itemService } from "@/features/itens/api/itens.service";
import { type ComercianteDTO } from "@/features/comerciantes/api/types";
import { type ItemDTO } from "@/features/itens/api/types";
import { useAuth } from "@/features/auth/contexts/AuthContext";

/* ── Helpers ─────────────────────────────────────────────── */
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function defaultDateTime() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function useCadastrarFeira() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [dataFeira, setDataFeira] = useState(defaultDateTime());
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /* Comerciantes */
  const [cmLeft, setCmLeft] = useState<ComercianteDTO[]>([]);
  const [cmRight, setCmRight] = useState<ComercianteDTO[]>([]);
  const [cmLeftSel, setCmLeftSel] = useState<string[]>([]);
  const [cmRightSel, setCmRightSel] = useState<string[]>([]);

  /* Itens */
  const [itLeft, setItLeft] = useState<ItemDTO[]>([]);
  const [itRight, setItRight] = useState<ItemDTO[]>([]);
  const [itLeftSel, setItLeftSel] = useState<string[]>([]);
  const [itRightSel, setItRightSel] = useState<string[]>([]);

  const [comsSize, setComsSize] = useState(1000);
  const [itensSize, setItensSize] = useState(1000);

  // Fetch com SWR para cache de 15 minutos e tamanho dinâmico
  const { data: comsData, error: comsError } = useSWR(
    isAuthenticated ? `/api/v1/comerciantes?size=${comsSize}` : null,
    () => comercianteService.getAll({ size: comsSize }),
    {
      dedupingInterval: 15 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  const { data: itensData, error: itensError } = useSWR(
    isAuthenticated ? `/api/v1/itens?size=${itensSize}` : null,
    () => itemService.getAll({ size: itensSize }),
    {
      dedupingInterval: 15 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  // Verifica se precisa de retry (a base excedeu o tamanho inicial de 1000)
  useEffect(() => {
    if (comsData && comsData.totalElements > comsSize) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComsSize(comsData.totalElements);
    }
  }, [comsData, comsSize]);

  useEffect(() => {
    if (itensData && itensData.totalElements > itensSize) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItensSize(itensData.totalElements);
    }
  }, [itensData, itensSize]);

  useEffect(() => {
    // Só prossegue se os dados já vieram e se a quantidade retornada cobre o total de elementos do banco
    const comsProntos = comsData && comsData.totalElements <= comsSize;
    const itensProntos = itensData && itensData.totalElements <= itensSize;

    if (comsProntos && itensProntos && loadingData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCmRight(comsData.content);
      setItRight(itensData.content);
      setLoadingData(false);
    }
  }, [comsData, comsSize, itensData, itensSize, loadingData]);

  useEffect(() => {
    if (comsError || itensError) {
      console.error(
        "Falha ao carregar dados iniciais:",
        comsError || itensError,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErro("Erro ao carregar dados do servidor");
      setLoadingData(false);
    }
  }, [comsError, itensError]);

  const toggleSel = (
    id: string,
    sel: string[],
    setSel: (v: string[]) => void,
  ) => {
    setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  };

  /* Transferência comerciantes */
  const cmToLeft = () => {
    setCmLeft((p) => [
      ...p,
      ...cmRight.filter((x) => cmRightSel.includes(x.id)),
    ]);
    setCmRight((p) => p.filter((x) => !cmRightSel.includes(x.id)));
    setCmRightSel([]);
  };
  const cmToRight = () => {
    setCmRight((p) => [
      ...p,
      ...cmLeft.filter((x) => cmLeftSel.includes(x.id)),
    ]);
    setCmLeft((p) => p.filter((x) => !cmLeftSel.includes(x.id)));
    setCmLeftSel([]);
  };
  const cmAllToLeft = () => {
    setCmLeft((p) => [...p, ...cmRight]);
    setCmRight([]);
    setCmRightSel([]);
  };
  const cmAllToRight = () => {
    setCmRight((p) => [...p, ...cmLeft]);
    setCmLeft([]);
    setCmLeftSel([]);
  };

  /* Transferência itens */
  const itToLeft = () => {
    setItLeft((p) => [
      ...p,
      ...itRight.filter((x) => itRightSel.includes(x.id)),
    ]);
    setItRight((p) => p.filter((x) => !itRightSel.includes(x.id)));
    setItRightSel([]);
  };
  const itToRight = () => {
    setItRight((p) => [
      ...p,
      ...itLeft.filter((x) => itLeftSel.includes(x.id)),
    ]);
    setItLeft((p) => p.filter((x) => !itLeftSel.includes(x.id)));
    setItLeftSel([]);
  };
  const itAllToLeft = () => {
    setItLeft((p) => [...p, ...itRight]);
    setItRight([]);
    setItRightSel([]);
  };
  const itAllToRight = () => {
    setItRight((p) => [...p, ...itLeft]);
    setItLeft([]);
    setItLeftSel([]);
  };

  async function handleConfirmar() {
    if (cmRight.length === 0) {
      setErro("Adicione ao menos um comerciante");
      return;
    }
    if (itRight.length === 0) {
      setErro("Adicione ao menos um item");
      return;
    }

    setErro(null);
    setSubmitting(true);
    try {
      await feiraService.create({
        dataHora: new Date(dataFeira).toISOString().replace("Z", ""),
        status: "RASCUNHO",
        comercianteIds: cmRight.map((c) => c.id),
        produtoIds: itRight.map((i) => i.id),
      });
      router.push("/feiras");
    } catch {
      setErro("Erro ao cadastrar feira. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    dataFeira,
    setDataFeira,
    comerciantes: {
      left: cmLeft,
      right: cmRight,
      leftSel: cmLeftSel,
      rightSel: cmRightSel,
      setLeftSel: setCmLeftSel,
      setRightSel: setCmRightSel,
      toLeft: cmToLeft,
      toRight: cmToRight,
      allToLeft: cmAllToLeft,
      allToRight: cmAllToRight,
    },
    itens: {
      left: itLeft,
      right: itRight,
      leftSel: itLeftSel,
      rightSel: itRightSel,
      setLeftSel: setItLeftSel,
      setRightSel: setItRightSel,
      toLeft: itToLeft,
      toRight: itToRight,
      allToLeft: itAllToLeft,
      allToRight: itAllToRight,
    },
    toggleSel,
    loadingData,
    submitting,
    erro,
    handleConfirmar,
  };
}
