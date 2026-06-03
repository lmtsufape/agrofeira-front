"use client";

import { CalendarDays, RefreshCw } from "lucide-react";
import { formatarData } from "@/utils/formatters";
import { useFeiras } from "@/features/feiras/hooks/useFeiras";
import { FEIRA_GERENCIAR_OPTIONS } from "@/features/feiras/constants/gerenciar-options";
import { type FeiraStatus } from "@/features/feiras/api/types";
import FeiraDropdown from "@/features/feiras/components/FeiraDropdown";
import { ActionCard } from "@/components/ui/ActionCard";
import { PageHeader } from "@/components/ui/PageHeader";

const STATUS_OPTIONS: { value: FeiraStatus; label: string }[] = [
  { value: "RASCUNHO", label: "Rascunho" },
  { value: "ABERTA", label: "Aberta" },
  { value: "ENCERRADA", label: "Encerrada" },
  { value: "FINALIZADA", label: "Finalizada" },
  { value: "CANCELADA", label: "Cancelada" },
];

const STATUS_COLORS: Record<FeiraStatus, string> = {
  RASCUNHO: "bg-[#f3f3f3] text-[#666] border-[#ddd]",
  ABERTA: "bg-[#E8F5EC] text-[#1B6112] border-[#C2E5CC]",
  ENCERRADA: "bg-[#FFF8E6] text-[#B38600] border-[#FFE082]",
  FINALIZADA: "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
  CANCELADA: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
};

export default function GerenciarFeiraPage() {
  const {
    feiras,
    selected,
    setSelected,
    loading,
    error,
    isFeiraSelected,
    atualizandoStatus,
    erroStatus,
    handleAtualizarStatus,
  } = useFeiras();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl w-full mx-auto flex flex-col gap-6">
        <PageHeader
          title="Gerenciar Feira"
          subtitle="Selecione uma feira para acessar as opções de gestão"
          backHref="/dashboard"
        />

        {/* Card seletor de feira */}
        <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <CalendarDays size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
                Feira
              </h3>
              <p className="text-[#8aaa8d] text-xs">
                Escolha a data da feira que deseja gerenciar
              </p>
            </div>
            {isFeiraSelected && selected && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 bg-gradient-to-br from-[rgba(0,61,4,0.07)] to-[rgba(91,196,139,0.12)] border border-[rgba(91,196,139,0.3)] shadow-sm animate-in fade-in zoom-in duration-300">
                <div className="w-2 h-2 rounded-full bg-[#5bc48b]" />
                <span className="text-[#2d7a1f] text-xs font-semibold">
                  {formatarData(selected.dataHora)}
                </span>
              </div>
            )}
          </div>

          <FeiraDropdown
            feiras={feiras}
            selected={selected}
            onSelect={setSelected}
            loading={loading}
            error={error}
          />

          {/* Status da feira */}
          {isFeiraSelected && selected && (
            <div className="mt-5 pt-5 border-t border-[#eef5ee]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[#1a3d1f] text-xs font-semibold tracking-wider uppercase">
                    Status atual:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase border ${STATUS_COLORS[selected.status as FeiraStatus] ?? "bg-[#f3f3f3] text-[#666] border-[#ddd]"}`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === selected.status)
                      ?.label ?? selected.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    defaultValue=""
                    key={selected.id}
                    onChange={(e) => {
                      if (e.target.value)
                        handleAtualizarStatus(e.target.value as FeiraStatus);
                      e.target.value = "";
                    }}
                    disabled={atualizandoStatus}
                    className="px-3 py-2 rounded-xl border border-[#d4e8d6] outline-none bg-white text-[#1a3d1f] shadow-sm focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b1a] text-[0.85rem] transition-all duration-200 disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Alterar status...
                    </option>
                    {STATUS_OPTIONS.filter(
                      (s) => s.value !== selected.status,
                    ).map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  {atualizandoStatus && (
                    <RefreshCw
                      size={15}
                      className="animate-spin text-[#5bc48b]"
                    />
                  )}
                </div>
              </div>

              {erroStatus && (
                <p className="mt-2 text-red-600 text-xs">{erroStatus}</p>
              )}
            </div>
          )}
        </div>

        {/* Grid de opções */}
        <section>
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-[#c8deca] to-transparent" />
            <p className="text-[#8aaa8d] px-3 text-[0.72rem] font-semibold tracking-widest uppercase text-center">
              {isFeiraSelected
                ? "O que deseja fazer?"
                : "Selecione uma feira para continuar"}
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-[#c8deca] to-transparent" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {FEIRA_GERENCIAR_OPTIONS.map((opt) => (
              <ActionCard
                key={opt.label + (opt.sublabel ?? "")}
                card={opt}
                disabled={!isFeiraSelected}
                queryString={selected?.id ? `?feiraId=${selected.id}` : ""}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
