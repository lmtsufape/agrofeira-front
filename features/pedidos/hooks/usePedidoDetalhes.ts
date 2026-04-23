"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import { type PedidoDTO } from "@/features/pedidos/api/types";

export function usePedidoDetalhes(pedidoId: string) {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [loading, setLoading] = useState(!!pedidoId);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPedido() {
      if (!pedidoId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await pedidoService.buscarPorId(pedidoId);
        if (isMounted) {
          setPedido(data);
        }
      } catch (error) {
        if (isMounted) {
          setErro("Erro ao carregar detalhes do pedido");
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPedido();

    return () => {
      isMounted = false;
    };
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
