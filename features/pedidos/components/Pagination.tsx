"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  itemsPerPage: number;
  totalCount: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  itemsPerPage,
  totalCount,
}: Readonly<PaginationProps>) {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-[#EEF5EE] gap-4">
      <p className="text-[0.7rem] text-[#8AAA8D] font-medium uppercase tracking-wider">
        Mostrando <span className="text-[#1A3D1F]">{startIndex + 1}</span> a{" "}
        <span className="text-[#1A3D1F]">
          {Math.min(startIndex + itemsPerPage, totalCount)}
        </span>{" "}
        de <span className="text-[#1A3D1F]">{totalCount}</span> pedidos
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title="Página Anterior"
          aria-label="Página Anterior"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5BC48B12] text-[#9DB89F] hover:bg-[#5BC48B26] hover:text-[#1B6112] disabled:opacity-30 disabled:hover:bg-[#5BC48B12] disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isSelected = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              title={`Ir para a página ${page}`}
              aria-label={`Ir para a página ${page}`}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                ${isSelected ? "bg-[#1B6112] text-white shadow-md shadow-[#1B611233]" : "bg-[#EEF5EE] text-[#9DB89F] hover:bg-[#5BC48B1a]"}`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          title="Próxima Página"
          aria-label="Próxima Página"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5BC48B12] text-[#9DB89F] hover:bg-[#5BC48B26] hover:text-[#1B6112] disabled:opacity-30 disabled:hover:bg-[#5BC48B12] disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
