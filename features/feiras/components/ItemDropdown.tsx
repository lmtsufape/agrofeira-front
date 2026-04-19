"use client";

import { Package } from "lucide-react";
import { type ItemAgrupado } from "@/features/feiras/api/types";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

interface ItemDropdownProps {
  itens: ItemAgrupado[];
  selected: ItemAgrupado | null;
  onSelect: (i: ItemAgrupado) => void;
  loading: boolean;
}

export function ItemDropdown({
  itens,
  selected,
  onSelect,
  loading,
}: Readonly<ItemDropdownProps>) {
  return (
    <SearchableDropdown
      items={itens}
      selected={selected}
      onSelect={onSelect}
      loading={loading}
      icon={Package}
      loadingText="Carregando..."
      placeholderText="Selecione o Item / Produto"
      searchPlaceholder="Buscar item…"
      emptyText="Nenhum resultado"
      getSearchableString={(it) => it.nome}
      getId={(it) => it.id}
      renderSelected={(it) => it.nome}
      renderItem={(it, isSel) => (
        <>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${isSel ? "bg-gradient-to-br from-[#003d04] to-[#1b6112]" : "bg-[rgba(91,196,139,0.12)] group-hover:bg-[rgba(91,196,139,0.2)]"}`}
          >
            <Package
              size={13}
              className={isSel ? "text-white" : "text-[#5bc48b]"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-[0.9rem] truncate ${isSel ? "font-bold text-[#003d04]" : "font-medium text-[#1a3d1f]"}`}
            >
              {it.nome}
            </p>
            <p className="text-[0.7rem] text-[#9db89f]">
              {it.comerciantes.length}{" "}
              {it.comerciantes.length === 1 ? "comerciante" : "comerciantes"}
            </p>
          </div>
        </>
      )}
    />
  );
}
