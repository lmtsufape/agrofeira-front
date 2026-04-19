"use client";

import { CalendarDays } from "lucide-react";
import { formatarData } from "@/utils/formatters";
import { useFeiras } from "@/features/feiras/hooks/useFeiras";
import { FEIRA_GERENCIAR_OPTIONS } from "@/features/feiras/constants/gerenciar-options";
import FeiraDropdown from "@/features/feiras/components/FeiraDropdown";
import FeiraActionCard from "@/features/feiras/components/FeiraActionCard";
import { PageHeader } from "@/components/ui/PageHeader";

export default function GerenciarFeiraPage() {
  const { feiras, selected, setSelected, loading, error, isFeiraSelected } =
    useFeiras();

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
              <FeiraActionCard
                key={opt.label + (opt.sublabel ?? "")}
                option={opt}
                disabled={!isFeiraSelected}
                feiraId={selected?.id ?? null}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
