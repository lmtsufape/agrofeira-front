"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, CalendarDays, Star } from "lucide-react";
import { type FeiraDTO } from "@/features/feiras/api/types";
import { formatarData } from "@/utils/formatters";

interface FeiraDropdownProps {
  feiras: FeiraDTO[];
  selected: FeiraDTO | null;
  onSelect: (f: FeiraDTO) => void;
  loading: boolean;
  error: string | null;
}

function isFeirasAtiva(status: FeiraDTO["status"]): boolean {
  return status === "ABERTA_PEDIDOS" || status === "ABERTA_OFERTAS";
}

export default function FeiraDropdown({
  feiras,
  selected,
  onSelect,
  loading,
  error,
}: Readonly<FeiraDropdownProps>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isError = error ? "Erro ao carregar feiras" : "Selecione a Feira";

  const placeholderText = loading ? "Carregando feiras..." : isError;

  const renderContent = selected ? (
    <span className="text-[#1a3d1f] font-semibold text-[0.95rem]">
      {formatarData(selected.dataHora)}
    </span>
  ) : (
    <span className="text-[#9db89f] text-[0.95rem]">{placeholderText}</span>
  );

  const buttonClass = open
    ? "border-[#5bc48b] shadow-[0_0_0_3px_rgba(91,196,139,0.15)]"
    : "border-[#d4e8d6] shadow-[0_1px_3px_rgba(0,61,4,0.06)]";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !loading && !error && setOpen((o) => !o)}
        disabled={loading || !!error}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b]/15 ${buttonClass}`}
      >
        <div className="flex items-center gap-3">
          <CalendarDays size={17} className="text-[#5bc48b]" />
          {renderContent}
        </div>
        <ChevronDown
          size={18}
          className={`text-[#5bc48b] transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open && feiras.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 bg-white shadow-[0_8px_32px_rgba(0,61,4,0.15),0_0_0_1px_rgba(0,61,4,0.08)]">
          {feiras.map((feira, i) => {
            const isSelected = selected?.id === feira.id;
            const ativa = isFeirasAtiva(feira.status);
            const isEven = i % 2 === 0 ? "bg-[#fafcf9]" : "bg-white";
            const bgClass = isSelected
              ? "bg-gradient-to-br from-[rgba(0,61,4,0.07)] to-[rgba(91,196,139,0.1)]"
              : isEven;

            const iconBgClass = isSelected
              ? "bg-gradient-to-br from-[#003d04] to-[#1b6112]"
              : "bg-[rgba(91,196,139,0.12)]";

            return (
              <button
                key={feira.id}
                onClick={() => {
                  onSelect(feira);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${bgClass} ${i < feiras.length - 1 ? "border-b border-[#eef5ee]" : ""} hover:bg-[rgba(91,196,139,0.08)]`}
              >
                {" "}
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${iconBgClass}`}
                >
                  {ativa ? (
                    <Star
                      size={12}
                      className={
                        isSelected
                          ? "text-white fill-white"
                          : "text-[#5bc48b] fill-[#5bc48b]"
                      }
                    />
                  ) : (
                    <CalendarDays
                      size={12}
                      className={isSelected ? "text-white" : "text-[#5bc48b]"}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[0.9rem] ${
                      isSelected
                        ? "font-bold text-[#003d04]"
                        : "font-medium text-[#1a3d1f]"
                    }`}
                  >
                    {formatarData(feira.dataHora)}
                  </span>
                  {ativa && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[0.63rem] font-semibold tracking-wide uppercase bg-[rgba(91,196,139,0.18)] text-[#2d7a1f]">
                      Ativa
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full shrink-0 bg-[#5bc48b]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {open && feiras.length === 0 && !loading && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl px-4 py-6 text-center z-50 bg-white shadow-[0_8px_32px_rgba(0,61,4,0.15)]">
          <p className="text-[#8aaa8d] text-sm">Nenhuma feira cadastrada</p>
        </div>
      )}
    </div>
  );
}
