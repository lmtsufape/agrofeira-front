"use client";

import { useParams } from "next/navigation";
import { User, Calendar, Loader2, AlertCircle } from "lucide-react";
import { formatarData, formatarHora } from "@/utils/formatters";
import { usePedidoDetalhes } from "@/features/pedidos/hooks/usePedidoDetalhes";
import { PedidoHeader } from "@/features/pedidos/components/PedidoHeader";
import { InfoCard } from "@/features/pedidos/components/InfoCard";
import { PedidoItensTable } from "@/features/pedidos/components/PedidoItensTable";

export default function DetalhePedidoPage() {
  const params = useParams();
  const pedidoId = params.id as string;

  const { pedido, loading, erro, handlePrint } = usePedidoDetalhes(pedidoId);

  let content = null;

  if (loading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B6112]" />
      </div>
    );
  } else if (erro) {
    content = (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl max-w-4xl mx-auto shadow-sm animate-shake">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <p className="text-red-700 font-medium">{erro}</p>
      </div>
    );
  } else if (pedido) {
    content = (
      <div className="w-full max-w-5xl mx-auto">
        <PedidoHeader status={pedido.status} onPrint={handlePrint} />

        {/* Informações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <InfoCard
            icon={User}
            label="Nome do Cliente"
            value={pedido.clienteNome}
          />
          <InfoCard
            icon={Calendar}
            label="Data do Pedido"
            value={`${formatarData(pedido.feiraData)} às ${formatarHora(pedido.feiraData)}`}
          />
        </div>

        <PedidoItensTable itens={pedido.itens} total={pedido.valorTotal} />
      </div>
    );
  }

  return <div className="flex-1 px-4 md:px-16 py-8">{content}</div>;
}
