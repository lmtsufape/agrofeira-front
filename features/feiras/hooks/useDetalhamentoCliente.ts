"use client";

import { useState, useEffect, useMemo } from "react";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import {
  type PedidoDTO,
  type ItemPedidoDTO,
} from "@/features/pedidos/api/types";

export interface ClienteAgrupado {
  clienteNome: string;
  pedidos: PedidoDTO[];
  itens: ItemPedidoDTO[];
  totalGeral: number;
}

function agruparPorCliente(pedidos: PedidoDTO[]): ClienteAgrupado[] {
  const map = new Map<string, ClienteAgrupado>();
  for (const pedido of pedidos) {
    const key = pedido.consumidorNome;
    if (!map.has(key)) {
      map.set(key, {
        clienteNome: pedido.consumidorNome,
        pedidos: [],
        itens: [],
        totalGeral: 0,
      });
    }
    const entry = map.get(key)!;
    entry.pedidos.push(pedido);
    entry.itens.push(...pedido.itens);
    entry.totalGeral += Number(pedido.valorTotal);
  }
  return Array.from(map.values());
}

export function useDetalhamentoCliente(feiraId: string | null) {
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(!!feiraId);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<ClienteAgrupado | null>(null);

  const clientesAgrupados = useMemo(
    () => agruparPorCliente(pedidos),
    [pedidos],
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchPedidos() {
      if (!feiraId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await pedidoService.listarPorFeira(feiraId);
        if (isMounted) setPedidos(data);
      } catch {
        if (isMounted)
          setErro("Não foi possível carregar os pedidos desta feira.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPedidos();

    return () => {
      isMounted = false;
    };
  }, [feiraId]);

  return {
    clientes: clientesAgrupados,
    selected,
    setSelected,
    loading,
    erro,
  };
}
