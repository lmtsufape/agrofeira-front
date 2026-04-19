"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  listarTodosPedidos,
  type PedidoDTO,
} from "@/features/pedidos/services/pedidos.service";

export function usePedidosListagem(itemsPerPage: number = 5) {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ecofeira_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const data = await listarTodosPedidos(token);
        setPedidos(data);
        setErro(null);
      } catch (error) {
        void error;
        setErro("Erro ao carregar pedidos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isMounted, router]);

  const pedidosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return pedidos;
    const term = searchTerm.toLowerCase();
    return pedidos.filter(
      (p) =>
        p.clienteNome.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term),
    );
  }, [pedidos, searchTerm]);

  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPedidos = pedidosFiltrados.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    pedidos: paginatedPedidos,
    totalCount: pedidosFiltrados.length,
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    loading,
    erro,
  };
}
