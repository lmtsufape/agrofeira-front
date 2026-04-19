"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  buscarPedidoPorId,
  type PedidoDTO,
} from "@/features/pedidos/services/pedidos.service";

export function usePedidoDetalhes(pedidoId: string) {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !pedidoId) return;

    const fetchPedido = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ecofeira_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const data = await buscarPedidoPorId(token, pedidoId);
        setPedido(data);
        setErro(null);
      } catch (error) {
        void error;
        setErro("Erro ao carregar detalhes do pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [isMounted, pedidoId, router]);

  const handlePrint = () => {
    globalThis.window.print();
  };

  return { pedido, loading, erro, handlePrint };
}
