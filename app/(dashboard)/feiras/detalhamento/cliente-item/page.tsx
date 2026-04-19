"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { CalendarDays, User as UserIcon, Users, Loader2 } from "lucide-react";
import { formatarData } from "@/utils/formatters";
import { PageHeader } from "@/components/ui/PageHeader";
import { useDetalhamentoCliente } from "@/features/feiras/hooks/useDetalhamentoCliente";
import { ClienteDropdown } from "@/features/feiras/components/ClienteDropdown";
import { ItemTable } from "@/features/feiras/components/ItemTable";

function DetalhamentoClienteItemContent() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const feiraId = searchParams.get("feiraId");

  const { clientes, selected, setSelected, feiraData, loading, erro } =
    useDetalhamentoCliente(token, feiraId);

  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Cliente → Item"
        subtitle="Veja os itens pedidos por cada cliente da feira"
      />

      {erro && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
          {erro}
        </div>
      )}

      {/* Card feira + seletor */}
      <div className="rounded-2xl p-5 md:p-6 flex flex-col gap-5 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
        {/* Banner da feira */}
        <div className="flex items-center gap-3 md:gap-4 px-4 py-3 rounded-xl bg-gradient-to-br from-[rgba(0,61,4,0.05)] to-[rgba(91,196,139,0.1)] border-[1.5px] border-[#5bc48b33]">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
            <CalendarDays size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#5bc48b] text-[0.68rem] font-semibold tracking-widest uppercase">
              Feira Selecionada
            </p>
            <p className="text-[#1a3d1f] font-bold text-[0.95rem] truncate">
              {feiraData ? formatarData(feiraData) : (feiraId ?? "—")}
            </p>
          </div>
          {loading && (
            <Loader2
              size={16}
              className="text-[#5bc48b] animate-spin shrink-0"
            />
          )}
        </div>

        {/* Seletor de cliente */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <UserIcon size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1a3d1f] font-bold text-[0.9rem]">Cliente</p>
              <p className="text-[#8aaa8d] text-[0.7rem]">
                Escolha o cliente para visualizar seus itens pedidos
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
          <ClienteDropdown
            clientes={clientes}
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
              <UserIcon size={13} className="text-white/80" />
              <span className="text-white font-bold text-[0.85rem]">
                {selected.clienteNome}
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-[#c8deca] to-transparent" />
          </div>
          <ItemTable cliente={selected} />
        </div>
      ) : (
        !loading && (
          <div className="rounded-2xl flex flex-col items-center justify-center py-16 gap-4 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgba(0,61,4,0.07)] to-[rgba(91,196,139,0.12)]">
              <Users size={28} className="text-[#5bc48b]" />
            </div>
            <div className="text-center px-4">
              <p className="text-[#1a3d1f] font-bold text-base">
                {clientes.length === 0
                  ? "Nenhum pedido encontrado para esta feira"
                  : "Nenhum cliente selecionado"}
              </p>
              <p className="text-[#8aaa8d] text-[0.8rem] mt-1">
                {clientes.length === 0
                  ? "Esta feira ainda não possui pedidos cadastrados"
                  : "Selecione um cliente acima para visualizar seus itens pedidos"}
              </p>
            </div>
          </div>
        )
      )}
    </main>
  );
}

export default function ClienteItemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-[#5bc48b]" size={32} />
        </div>
      }
    >
      <DetalhamentoClienteItemContent />
    </Suspense>
  );
}
