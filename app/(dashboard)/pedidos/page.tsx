"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePedidosListagem } from "@/features/pedidos/hooks/usePedidosListagem";
import { PedidosTable } from "@/features/pedidos/components/PedidosTable";
import { SearchInput } from "@/features/pedidos/components/SearchInput";
import { Pagination } from "@/features/pedidos/components/Pagination";

export default function PedidosPage() {
  const {
    pedidos,
    totalCount,
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    loading,
    erro,
  } = usePedidosListagem(6);

  let content = null;

  if (loading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B6112]" />
      </div>
    );
  } else if (erro) {
    content = (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <p className="text-red-700 font-medium">{erro}</p>
      </div>
    );
  } else if (pedidos.length === 0) {
    content = (
      <div className="text-center py-20 bg-[#F9FAFB] rounded-2xl border-2 border-dashed border-[#EEF5EE]">
        <p className="text-[#9DB89F] font-medium">
          {searchTerm
            ? "Nenhum pedido encontrado para esta busca"
            : "Nenhum pedido disponível no momento"}
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <PedidosTable pedidos={pedidos} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          itemsPerPage={6}
          totalCount={totalCount}
        />
      </>
    );
  }

  return (
    <div className="flex-1 px-4 md:px-16 py-8">
      <div className="w-full max-w-6xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,61,4,0.06)] border border-[#EEF5EE]">
        {/* Header com título e busca */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-8 border-b border-[#F0F5F0]">
          <PageHeader
            title="Histórico de Pedidos"
            subtitle="Acompanhe as vendas recentes e detalhes das transações"
            backHref="/dashboard"
          />

          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar por cliente ou ID..."
          />
        </div>

        {/* Conteúdo */}
        {content}
      </div>
    </div>
  );
}
