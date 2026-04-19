"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  listarComerciantes,
  listarItens,
  criarFeira,
  type ComercianteDTO,
  type ItemDTO,
} from "../services/cadastrar-feira.service";

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
  const { token } = useAuth();

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

  useEffect(() => {
    if (!token) return;
    Promise.all([listarComerciantes(token), listarItens(token)])
      .then(([coms, itens]) => {
        setCmRight(coms);
        setItRight(itens);
      })
      .catch(() => setErro("Erro ao carregar dados do servidor"))
      .finally(() => setLoadingData(false));
  }, [token]);

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
    if (!token) return;
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
      await criarFeira(token, {
        feira: {
          dataHora: new Date(dataFeira).toISOString().replace("Z", ""),
          status: "AGENDADA",
        },
        comercianteIds: cmRight.map((c) => c.id),
        itemIds: itRight.map((i) => i.id),
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
