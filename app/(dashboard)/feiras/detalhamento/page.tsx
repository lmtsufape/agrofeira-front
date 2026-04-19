"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { DetalhamentoCard } from "@/features/feiras/components/DetalhamentoCard";
import { DETALHAMENTO_OPTIONS } from "@/features/feiras/constants/detalhamento-options";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

function DetalhamentoFeiraContent() {
  const searchParams = useSearchParams();
  const feiraId = searchParams.get("feiraId");

  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Detalhamento Feira"
        subtitle="Escolha uma visão de detalhamento para a feira selecionada"
      />

      {/* Banner info */}
      <div className="rounded-2xl px-5 py-4 flex items-center gap-4 bg-gradient-to-br from-[#003d040f] to-[#5bc48b1a] border-[1.5px] border-[#5bc48b40] shadow-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
          <FileText size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[#1a3d1f] font-semibold text-[0.9rem]">
            Selecione o tipo de detalhamento
          </p>
          <p className="text-[#8aaa8d] text-xs">
            Cada opção exibe uma perspectiva diferente dos dados da feira
          </p>
        </div>
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-[#c8deca] to-transparent" />
        <p className="text-[#8aaa8d] px-3 text-[0.72rem] font-semibold tracking-widest uppercase">
          Opções de Detalhamento
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-[#c8deca] to-transparent" />
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {DETALHAMENTO_OPTIONS.map((opt) => (
          <DetalhamentoCard key={opt.label} option={opt} feiraId={feiraId} />
        ))}
      </div>
    </main>
  );
}

export default function DetalhamentoFeiraPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center bg-[#f6faf4]">
            <Loader2 className="animate-spin text-[#5bc48b]" size={32} />
          </div>
        }
      >
        <DetalhamentoFeiraContent />
      </Suspense>
    </div>
  );
}
