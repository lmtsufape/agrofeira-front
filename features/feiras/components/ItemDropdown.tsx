"use client";

import { useState, useRef, useEffect } from "react";
import { Package, Search, ChevronDown, Loader2 } from "lucide-react";
import { type ItemAgrupado } from "@/features/feiras/services/feiras.service";

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = itens.filter((it) =>
    it.nome.toLowerCase().includes(search.toLowerCase()),
  );

  const loadingText = loading ? "Carregando..." : "Selecione o Item / Produto";
  const placeholderText = selected ? (
    <span className="text-[#1a3d1f] font-semibold text-[0.95rem]">
      {selected.nome}
    </span>
  ) : (
    <span className="text-[#9db89f] text-[0.95rem]">{loadingText}</span>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !loading && setOpen((o) => !o)}
        disabled={loading}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed
          ${open ? "border-[#5bc48b] ring-2 ring-[#5bc48b]/15 shadow-[0_0_0_3px_rgba(91,196,139,0.15)]" : "border-[#d4e8d6] shadow-[0_1px_3px_rgba(0,61,4,0.06)]"}`}
      >
        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 size={17} className="text-[#5bc48b] animate-spin" />
          ) : (
            <Package size={17} className="text-[#5bc48b]" />
          )}
          {placeholderText}
        </div>
        <ChevronDown
          size={18}
          className={`text-[#5bc48b] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 bg-white shadow-[0_8px_32px_rgba(0,61,4,0.15),0_0_0_1px_rgba(0,61,4,0.08)]">
          <div className="p-2 border-b border-[#eef5ee]">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db89f]"
              />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar item…"
                className="w-full pl-8 pr-3 py-2 rounded-lg outline-none text-[#1a3d1f] bg-[#f6faf4] border border-[#daeeda] text-[0.85rem]"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-5 text-center text-[#aacaad] text-sm">
              Nenhum resultado
            </div>
          ) : (
            <div className="max-h-[240px] overflow-y-auto">
              {filtered.map((it, i) => {
                const isSel = selected?.id === it.id;
                const isEven = i % 2 === 0 ? "bg-[#fafcf9]" : "bg-white";
                const bgClass = isSel
                  ? "bg-gradient-to-br from-[rgba(0,61,4,0.07)] to-[rgba(91,196,139,0.1)]"
                  : isEven;

                const iconBgClass = isSel
                  ? "bg-gradient-to-br from-[#003d04] to-[#1b6112]"
                  : "bg-[rgba(91,196,139,0.12)] group-hover:bg-[rgba(91,196,139,0.2)]";

                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      onSelect(it);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group ${bgClass} ${i < filtered.length - 1 ? "border-b border-[#eef5ee]" : ""} hover:bg-[rgba(91,196,139,0.08)]`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${iconBgClass}`}
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
                        {it.comerciantes.length === 1
                          ? "comerciante"
                          : "comerciantes"}
                      </p>
                    </div>
                    {isSel && (
                      <div className="w-2 h-2 rounded-full shrink-0 bg-[#5bc48b]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
