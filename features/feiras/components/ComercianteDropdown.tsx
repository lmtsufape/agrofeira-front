"use client";

import { Store } from "lucide-react";
import { type EstoqueBancaDTO } from "@/features/feiras/api/types";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

interface ComercianteDropdownProps {
  bancas: EstoqueBancaDTO[];
  selected: EstoqueBancaDTO | null;
  onSelect: (b: EstoqueBancaDTO) => void;
  loading: boolean;
}

export function ComercianteDropdown({
  bancas,
  selected,
  onSelect,
  loading,
}: Readonly<ComercianteDropdownProps>) {
  return (
    <SearchableDropdown
      items={bancas}
      selected={selected}
      onSelect={onSelect}
      loading={loading}
      icon={Store}
      loadingText="Carregando bancas..."
      placeholderText="Selecione o Comerciante / Banca"
      searchPlaceholder="Buscar comerciante…"
      emptyText="Nenhum resultado"
      getSearchableString={(b) => b.comercianteNome}
      getId={(b) => b.comercianteId}
      renderSelected={(b) => b.comercianteNome}
      renderItem={(b, isSel) => (
        <>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${isSel ? "bg-gradient-to-br from-[#003d04] to-[#1b6112]" : "bg-[rgba(91,196,139,0.12)] group-hover:bg-[rgba(91,196,139,0.2)]"}`}
          >
            <Store
              size={13}
              className={isSel ? "text-white" : "text-[#5bc48b]"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-[0.9rem] truncate ${isSel ? "font-bold text-[#003d04]" : "font-medium text-[#1a3d1f]"}`}
            >
              {b.comercianteNome}
            </p>
            <p className="text-[0.7rem] text-[#9db89f]">
              {b.itens.length}{" "}
              {b.itens.length === 1 ? "item cadastrado" : "itens cadastrados"}
            </p>
          </div>
        </>
      )}
    />
  );
}
