"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { CalendarDays, Store as StoreIcon, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatarData } from "@/utils/formatters";
import { useDetalhamentoComerciante } from "@/features/feiras/hooks/useDetalhamentoComerciante";
import { ComercianteDropdown } from "@/features/feiras/components/ComercianteDropdown";
import { BancaItemTable } from "@/features/feiras/components/BancaItemTable";

function DetalhamentoComercianteItemContent() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const feiraId = searchParams.get("feiraId");

  const { bancas, selected, setSelected, loading, erro } =
    useDetalhamentoComerciante(token, feiraId);

  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Comerciante → Item"
        subtitle="Veja os itens e estoque disponíveis por banca"
      />

      {erro && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
          {erro}
        </div>
      )}

      {/* Card feira + seletor */}
      <div className="rounded-2xl p-5 md:p-6 flex flex-col gap-5 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
        {/* Banner feira */}
        <div className="flex items-center gap-3 md:gap-4 px-4 py-3 rounded-xl bg-gradient-to-br from-[rgba(0,61,4,0.05)] to-[rgba(91,196,139,0.1)] border-[1.5px] border-[#5bc48b33]">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
            <CalendarDays size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#5bc48b] text-[0.68rem] font-semibold tracking-widest uppercase">
              Feira Selecionada
            </p>
            <p className="text-[#1a3d1f] font-bold text-[0.95rem] truncate">
              {selected?.feiraData
                ? formatarData(selected.feiraData)
                : (feiraId ?? "Demonstração")}
            </p>
          </div>
          {loading && (
            <Loader2
              size={16}
              className="text-[#5bc48b] animate-spin shrink-0"
            />
          )}
        </div>

        {/* Seletor de banca */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <StoreIcon size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1a3d1f] font-bold text-[0.9rem]">
                Comerciante / Banca
              </p>
              <p className="text-[#8aaa8d] text-[0.7rem]">
                Escolha a banca para ver os produtos e estoque
              </p>
            </div>
            {selected && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 bg-[#5bc48b1f] border border-[#5bc48b4d]">
                <div className="w-2 h-2 rounded-full bg-[#5bc48b]" />
                <span className="text-[#2d7a1f] text-xs font-semibold">
                  {selected.itens.length}{" "}
                  {selected.itens.length === 1 ? "item" : "itens"}
                </span>
              </div>
            )}
          </div>
          <ComercianteDropdown
            bancas={bancas}
            selected={selected}
            onSelect={setSelected}
            loading={loading}
          />
        </div>
      </div>

      {/* Tabela ou empty state */}
      {selected ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#c8deca] to-transparent" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <StoreIcon size={13} className="text-white/80" />
              <span className="text-white font-bold text-[0.85rem]">
                {selected.comercianteNome}
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-[#c8deca] to-transparent" />
          </div>
          <BancaItemTable banca={selected} />
        </div>
      ) : (
        !loading && (
          <div className="rounded-2xl flex flex-col items-center justify-center py-16 gap-4 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgba(0,61,4,0.07)] to-[rgba(91,196,139,0.12)]">
              <StoreIcon size={28} className="text-[#5bc48b]" />
            </div>
            <div className="text-center px-4">
              <p className="text-[#1a3d1f] font-bold text-base">
                {bancas.length === 0
                  ? "Nenhuma banca vinculada a esta feira"
                  : "Nenhum comerciante selecionado"}
              </p>
              <p className="text-[#8aaa8d] text-[0.8rem] mt-1">
                {bancas.length === 0
                  ? "Não foram encontrados dados de estoque para esta feira"
                  : "Selecione uma banca acima para visualizar seus produtos e quantidades"}
              </p>
            </div>
          </div>
        )
      )}
    </main>
  );
}

export default function ComercianteItemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-[#5bc48b]" size={32} />
        </div>
      }
    >
      <DetalhamentoComercianteItemContent />
    </Suspense>
  );
}
