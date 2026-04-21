"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import { type PedidoDTO } from "@/features/pedidos/api/types";

export function usePedidosListagem(itemsPerPage: number = 5) {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        setLoading(true);
        const data = await pedidoService.listar();
        setPedidos(data);
      } catch (error) {
        setErro("Erro ao carregar lista de pedidos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, []);

  const filteredPedidos = useMemo(() => {
    return pedidos.filter(
      (p) =>
        p.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [pedidos, searchTerm]);

  const totalCount = filteredPedidos.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentPedidos = useMemo(() => {
    return filteredPedidos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPedidos, startIndex, itemsPerPage]);

  const handleRowClick = (id: string) => {
    router.push(`/pedidos/${id}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    pedidos: currentPedidos,
    loading,
    erro,
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    startIndex,
    handleRowClick,
  };
}
