"use client";

import { useState, useEffect, useMemo } from "react";
import {
  listarPedidosPorFeira,
  type PedidoDTO,
  type ItemPedidoDTO,
} from "@/features/pedidos/services/pedidos.service";

export interface ClienteAgrupado {
  clienteId: string;
  clienteNome: string;
  pedidos: PedidoDTO[];
  itens: ItemPedidoDTO[];
  totalGeral: number;
}

const MOCK_PEDIDOS: PedidoDTO[] = [
  {
    id: "p-1",
    feiraId: "mock-1",
    feiraData: new Date().toISOString(),
    clienteId: "c-1",
    clienteNome: "João Silva",
    comercianteVendedorId: "com-1",
    comercianteVendedorNome: "Sítio Primavera",
    status: "CONFIRMADO",
    tipoRetirada: "ENTREGA",
    taxaEntrega: 5,
    valorProdutos: 25,
    valorTotal: 30,
    itens: [
      {
        id: "it-1",
        itemId: "i-1",
        itemNome: "Alface Crespa (un)",
        quantidade: 2,
        valorUnitario: 3.5,
        valorTotal: 7,
      },
      {
        id: "it-2",
        itemId: "i-2",
        itemNome: "Tomate Cereja (500g)",
        quantidade: 1,
        valorUnitario: 8.5,
        valorTotal: 8.5,
      },
      {
        id: "it-3",
        itemId: "i-3",
        itemNome: "Cenoura Orgânica (kg)",
        quantidade: 1.5,
        valorUnitario: 6.33,
        valorTotal: 9.5,
      },
    ],
  },
  {
    id: "p-2",
    feiraId: "mock-1",
    feiraData: new Date().toISOString(),
    clienteId: "c-2",
    clienteNome: "Maria Oliveira",
    comercianteVendedorId: "com-2",
    comercianteVendedorNome: "Horta do Vale",
    status: "CONFIRMADO",
    tipoRetirada: "RETIRADA",
    taxaEntrega: 0,
    valorProdutos: 15.5,
    valorTotal: 15.5,
    itens: [
      {
        id: "it-4",
        itemId: "i-4",
        itemNome: "Mel Orgânico (250g)",
        quantidade: 1,
        valorUnitario: 15.5,
        valorTotal: 15.5,
      },
    ],
  },
];

function agruparPorCliente(pedidos: PedidoDTO[]): ClienteAgrupado[] {
  const map = new Map<string, ClienteAgrupado>();
  for (const pedido of pedidos) {
    if (!map.has(pedido.clienteId)) {
      map.set(pedido.clienteId, {
        clienteId: pedido.clienteId,
        clienteNome: pedido.clienteNome,
        pedidos: [],
        itens: [],
        totalGeral: 0,
      });
    }
    const entry = map.get(pedido.clienteId)!;
    entry.pedidos.push(pedido);
    entry.itens.push(...pedido.itens);
    entry.totalGeral += Number(pedido.valorTotal);
  }
  return Array.from(map.values());
}

export function useDetalhamentoCliente(
  token: string | null,
  feiraId: string | null,
) {
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<ClienteAgrupado | null>(null);

  const clientesAgrupados = useMemo(
    () => agruparPorCliente(pedidos),
    [pedidos],
  );

  const feiraData = useMemo(
    () => (pedidos.length > 0 ? pedidos[0].feiraData : null),
    [pedidos],
  );

  useEffect(() => {
    if (!token || !feiraId) return;

    async function fetchPedidos() {
      if (token === "mock-token-dev") {
        setPedidos(MOCK_PEDIDOS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await listarPedidosPorFeira(token!, feiraId!);
        if (data.length > 0) {
          setPedidos(data);
        } else {
          setPedidos([]);
        }
      } catch {
        setErro(
          "Não foi possível carregar pedidos da API, usando dados locais.",
        );
        setPedidos(MOCK_PEDIDOS);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, [token, feiraId]);

  return {
    clientes: clientesAgrupados,
    selected,
    setSelected,
    feiraData,
    loading,
    erro,
  };
}
