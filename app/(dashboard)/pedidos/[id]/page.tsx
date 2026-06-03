"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { formatarData, formatarHora } from "@/utils/formatters";
import { usePedidoDetalhes } from "@/features/pedidos/hooks/usePedidoDetalhes";
import { PedidoHeader } from "@/features/pedidos/components/PedidoHeader";
import { InfoCard } from "@/features/pedidos/components/InfoCard";
import { PedidoItensTable } from "@/features/pedidos/components/PedidoItensTable";
import { getStatusColor, STATUS_LABELS } from "@/utils/status";

export default function DetalhePedidoPage() {
  const params = useParams();
  const pedidoId = params.id as string;

  const {
    pedido,
    loading,
    erro,
    handlePrint,
    proximosStatus,
    handleAtualizarStatus,
    atualizandoStatus,
    erroStatus,
  } = usePedidoDetalhes(pedidoId);

  const [novoStatus, setNovoStatus] = useState("");

  let content = null;

  if (loading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B6112]" />
      </div>
    );
  } else if (erro) {
    content = (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl max-w-4xl mx-auto shadow-sm">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <p className="text-red-700 font-medium">{erro}</p>
      </div>
    );
  } else if (pedido) {
    content = (
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        <PedidoHeader status={pedido.status} onPrint={handlePrint} />

        {/* Informações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={User}
            label="Nome do Consumidor"
            value={pedido.consumidorNome}
          />
          <InfoCard
            icon={Calendar}
            label="Data do Pedido"
            value={`${formatarData(pedido.criadoEm)} às ${formatarHora(pedido.criadoEm)}`}
          />
        </div>

        {/* Atualizar Status */}
        {proximosStatus.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#EEF5EE] shadow-[0_2px_10px_rgba(0,61,4,0.04)] p-5">
            <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-4">
              Atualizar Status
            </p>

            {erroStatus && (
              <div className="flex items-center gap-2 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-red-700 text-sm">{erroStatus}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {proximosStatus.map((status) => {
                const colors = getStatusColor(status);
                const label = STATUS_LABELS[status] ?? status;
                const isSelected = novoStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setNovoStatus(isSelected ? "" : status)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      isSelected
                        ? `${colors.bg} ${colors.border} ${colors.text} shadow-sm`
                        : "bg-white border-[#EEF5EE] text-[#8AAA8D] hover:border-[#C2E5CC]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              <button
                onClick={async () => {
                  if (!novoStatus) return;
                  await handleAtualizarStatus(novoStatus);
                  setNovoStatus("");
                }}
                disabled={!novoStatus || atualizandoStatus}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#003D04] to-[#1B6112] text-white text-sm font-bold rounded-xl shadow hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all ml-auto"
              >
                {atualizandoStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronRight size={16} />
                )}
                Confirmar
              </button>
            </div>
          </div>
        )}

        <PedidoItensTable itens={pedido.itens} total={pedido.valorTotal} />
      </div>
    );
  }

  return <div className="flex-1 px-4 md:px-16 py-8">{content}</div>;
}
