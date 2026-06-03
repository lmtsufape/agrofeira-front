"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";

export interface CartItem {
  id: string;
  nome: string;
  unidadeMedida: string;
  precoBase: number;
  quantidade: number;
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export function useResumoPedido(feiraId: string, participanteId: string) {
  const router = useRouter();

  const [itensCarrinho, setItensCarrinho] = useState<CartItem[]>(() => {
    try {
      const raw = sessionStorage.getItem("agrofeira_pedido_itens");
      if (raw) return JSON.parse(raw) as CartItem[];
    } catch {
      // sessionStorage unavailable or malformed data
    }
    return [];
  });
  const [opcaoRetirada, setOpcaoRetirada] = useState<"local" | "endereco">(
    "local",
  );
  const [enderecoModal, setEnderecoModal] = useState(false);
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<Endereco>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const handleQuantidadeChange = (id: string, delta: number) => {
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item,
      ),
    );
  };

  const handleRemover = (id: string) => {
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const valorTotal = itensCarrinho.reduce(
    (acc, item) => acc + item.precoBase * item.quantidade,
    0,
  );

  const finalizarPedido = async () => {
    if (itensCarrinho.length === 0) return;
    if (!feiraId) {
      setErro("Feira não identificada. Volte e selecione novamente.");
      return;
    }

    setErro(null);
    setSubmitting(true);
    try {
      await pedidoService.criar({
        feiraId,
        tipoRetirada: opcaoRetirada === "endereco" ? "ENTREGA" : "LOCAL",
        itens: itensCarrinho.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
        consumidorId: participanteId || undefined,
      });
      sessionStorage.removeItem("agrofeira_pedido_itens");
      setPedidoRealizado(true);
      setTimeout(() => {
        router.push("/pedidos");
      }, 2500);
    } catch {
      setErro(
        "Erro ao realizar pedido. Verifique o estoque e tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    itensCarrinho,
    opcaoRetirada,
    setOpcaoRetirada,
    enderecoModal,
    setEnderecoModal,
    pedidoRealizado,
    submitting,
    erro,
    endereco,
    setEndereco,
    valorTotal,
    handleQuantidadeChange,
    handleRemover,
    finalizarPedido,
  };
}
