"use client";

import { useState, useEffect, useMemo } from "react";
import { pedidoService } from "@/features/pedidos/api/pedidos.service";
import { type PedidoDTO } from "@/features/pedidos/api/types";

export function usePedidosListagem(itemsPerPage: number = 5) {
  const [allPedidos, setAllPedidos] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchPedidos() {
      try {
        setLoading(true);
        const page = await pedidoService.listar(currentPage - 1, itemsPerPage);
        if (isMounted) {
          setAllPedidos(page.content);
          setTotalCount(page.totalElements);
          setTotalPages(page.totalPages);
        }
      } catch (error) {
        if (isMounted) {
          setErro("Erro ao carregar lista de pedidos");
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPedidos();

    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage]);

  const pedidos = useMemo(() => {
    if (!searchTerm) return allPedidos;
    return allPedidos.filter(
      (p) =>
        p.consumidorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allPedidos, searchTerm]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    pedidos,
    loading,
    erro,
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    startIndex,
  };
}
