"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import { type PedidoDTO } from "@/features/pedidos/api/types";

export function usePedidoDetalhes(pedidoId: string) {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!pedidoId) return;

    async function fetchPedido() {
      try {
        setLoading(true);
        const data = await pedidoService.buscarPorId(pedidoId);
        setPedido(data);
      } catch (error) {
        setErro("Erro ao carregar detalhes do pedido");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPedido();
  }, [pedidoId]);

  const handleVoltar = () => router.push("/pedidos");
  const handlePrint = () => window.print();

  return {
    pedido,
    loading,
    erro,
    handleVoltar,
    handlePrint,
  };
}
