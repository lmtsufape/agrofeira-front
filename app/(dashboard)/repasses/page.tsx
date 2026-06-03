"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Plus, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { useRepasses } from "@/features/repasses/hooks/useRepasses";
import { RepassesTable } from "@/features/repasses/components/RepassesTable";
import { CadastrarRepasseForm } from "@/features/repasses/components/CadastrarRepasseForm";
import { SearchInput } from "@/features/pedidos/components/SearchInput";
import { Pagination } from "@/features/pedidos/components/Pagination";

export default function RepassesPage() {
  const [showForm, setShowForm] = useState(false);

  const {
    repasses,
    totalCount,
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    loading,
    erro,
    refresh,
  } = useRepasses(10);

  const handleRepasseRegistrado = () => {
    refresh();
  };

  let content = null;

  if (loading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B6112]" />
      </div>
    );
  } else if (erro) {
    content = (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <p className="text-red-700 font-medium">{erro}</p>
      </div>
    );
  } else if (repasses.length === 0) {
    content = (
      <div className="text-center py-20 bg-[#F9FAFB] rounded-2xl border-2 border-dashed border-[#EEF5EE]">
        <p className="text-[#9DB89F] font-medium">
          {searchTerm
            ? "Nenhum repasse encontrado para esta busca"
            : "Nenhum repasse registrado no momento"}
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <RepassesTable repasses={repasses} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          itemsPerPage={10}
          totalCount={totalCount}
          itemLabel="repasses"
        />
      </>
    );
  }

  return (
    <div className="flex-1 px-4 md:px-16 py-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        {/* Card principal */}
        <div className="p-6 md:p-8 bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,61,4,0.06)] border border-[#EEF5EE]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-8 border-b border-[#F0F5F0]">
            <PageHeader
              title="Repasses"
              subtitle="Registro de repasses financeiros aos comerciantes"
              backHref="/dashboard"
            />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchInput
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar por comerciante..."
              />
              <Button
                onClick={() => setShowForm((v) => !v)}
                variant={showForm ? "secondary" : "primary"}
              >
                {showForm ? (
                  <>
                    <X size={15} className="mr-1.5" />
                    Fechar
                  </>
                ) : (
                  <>
                    <Plus size={15} className="mr-1.5" />
                    Cadastrar Repasse
                  </>
                )}
              </Button>
            </div>
          </div>
          {content}
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <CadastrarRepasseForm onSuccess={handleRepasseRegistrado} />
        )}
      </div>
    </div>
  );
}
