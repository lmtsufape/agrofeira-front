"use client";

import { useState, useEffect, useMemo } from "react";
import { repasseService } from "@/features/repasses/api/repasses.service";
import { type RepasseDTO } from "@/features/repasses/api/types";

export function useRepasses(itemsPerPage: number = 10) {
  const [allRepasses, setAllRepasses] = useState<RepasseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    let isMounted = true;

    async function fetchRepasses() {
      try {
        setLoading(true);
        const page = await repasseService.listar(currentPage - 1, itemsPerPage);
        if (isMounted) {
          setAllRepasses(page.content);
          setTotalCount(page.totalElements);
          setTotalPages(page.totalPages);
        }
      } catch {
        if (isMounted) {
          setErro("Erro ao carregar lista de repasses");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRepasses();

    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, refreshKey]);

  const repasses = useMemo(() => {
    if (!searchTerm) return allRepasses;
    return allRepasses.filter((r) =>
      r.comerciante.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allRepasses, searchTerm]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    repasses,
    loading,
    erro,
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    startIndex,
    refresh,
  };
}
