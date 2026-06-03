"use client";

import { useRouter } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import { getStatusColor, getStatusLabel } from "@/utils/status";

interface PedidoHeaderProps {
  status: string;
  onPrint: () => void;
}

export function PedidoHeader({ status, onPrint }: Readonly<PedidoHeaderProps>) {
  const router = useRouter();
  const colors = getStatusColor(status);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[#EEF5EE]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/pedidos")}
          className="w-9 h-9 bg-white shadow-sm border border-[#003D041a] rounded-xl flex items-center justify-center hover:bg-[#f6faf4] transition-colors print:hidden"
          title="Voltar para pedidos"
        >
          <ArrowLeft size={16} className="text-[#003D04]" />
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-[#1A3D1F]">
            Detalhes do Pedido
          </h1>
          <span
            className={`px-3 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wide border ${colors.bg} ${colors.border} ${colors.text}`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C2E5CC] rounded-xl text-[#1B6112] text-sm font-semibold shadow-sm hover:bg-[#F0FAF3] transition-colors active:scale-95 print:hidden"
      >
        <Printer size={16} />
        Imprimir Recibo
      </button>
    </div>
  );
}
