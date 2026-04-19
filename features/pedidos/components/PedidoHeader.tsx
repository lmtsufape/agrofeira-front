"use client";

import { Printer } from "lucide-react";
import { getStatusColor } from "@/utils/status";

interface PedidoHeaderProps {
  status: string;
  onPrint: () => void;
}

export function PedidoHeader({ status, onPrint }: Readonly<PedidoHeaderProps>) {
  const colors = getStatusColor(status);

  // O Tailwind v4 com JIT permite interpolação indireta se os hexadecimais de colors estiverem em safe-list,
  // Mas como retornamos hexadecimais crus de `getStatusColor`, injetaremos via variável CSS de estilo ou classes montadas pelo formatter.
  // Já que só precisamos remover o objeto 'style' literal que suja o React.

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[#EEF5EE]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white shadow-sm border border-[#003D041a] rounded-xl flex items-center justify-center">
          <div className="w-1.5 h-6 bg-[#003D04] rounded-full" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-[#1A3D1F]">
            Detalhes do Pedido
          </h1>
          <span
            className={`px-3 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wide border ${colors.bg} ${colors.border} ${colors.text}`}
          >
            {status}
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
