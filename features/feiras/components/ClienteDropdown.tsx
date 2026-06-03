"use client";

import { User } from "lucide-react";
import { type ClienteAgrupado } from "../hooks/useDetalhamentoCliente";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

interface ClienteDropdownProps {
  clientes: ClienteAgrupado[];
  selected: ClienteAgrupado | null;
  onSelect: (c: ClienteAgrupado) => void;
  loading: boolean;
}

export function ClienteDropdown({
  clientes,
  selected,
  onSelect,
  loading,
}: Readonly<ClienteDropdownProps>) {
  return (
    <SearchableDropdown
      items={clientes}
      selected={selected}
      onSelect={onSelect}
      loading={loading}
      icon={User}
      loadingText="Carregando clientes..."
      placeholderText="Selecione o Cliente"
      searchPlaceholder="Buscar cliente…"
      emptyText="Nenhum resultado"
      getSearchableString={(c) => c.clienteNome}
      getId={(c) => c.clienteNome}
      renderSelected={(c) => c.clienteNome}
      renderItem={(c, isSel) => (
        <>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${isSel ? "bg-gradient-to-br from-[#003d04] to-[#1b6112]" : "bg-[rgba(91,196,139,0.12)] group-hover:bg-[rgba(91,196,139,0.2)]"}`}
          >
            <User
              size={13}
              className={isSel ? "text-white" : "text-[#5bc48b]"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-[0.9rem] truncate ${isSel ? "font-bold text-[#003d04]" : "font-medium text-[#1a3d1f]"}`}
            >
              {c.clienteNome}
            </p>
            <p className="text-[0.7rem] text-[#9db89f]">
              {c.itens.length}{" "}
              {c.itens.length === 1 ? "item pedido" : "itens pedidos"}
            </p>
          </div>
        </>
      )}
    />
  );
}
