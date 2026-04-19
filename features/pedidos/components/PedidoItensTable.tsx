"use client";

import { Package } from "lucide-react";
import { type ItemPedidoDTO } from "@/features/pedidos/api/types";
import { formatarMoeda } from "@/utils/formatters";

interface PedidoItensTableProps {
  itens: ItemPedidoDTO[];
  total: number;
}

export function PedidoItensTable({
  itens,
  total,
}: Readonly<PedidoItensTableProps>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-[#EEF5EE] rounded-2xl shadow-[0_2px_10px_rgba(0,61,4,0.04)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_0.5fr_0.5fr] gap-6 px-6 py-3 bg-[#FCFDFC] border-b border-[#EEF5EE]">
          {["Produto", "Quantidade", "Valor"].map((label, i) => {
            const textAlignment = (() => {
              if (i === 1) return "text-center";
              if (i === 2) return "text-right";
              return "";
            })();
            return (
              <span
                key={label}
                className={`text-[0.7rem] font-bold text-[#5BC48B] uppercase tracking-wider ${textAlignment}`}
              >
                {label}
              </span>
            );
          })}
        </div>

        {/* Linhas */}
        <div>
          {itens.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-[1fr_0.5fr_0.5fr] gap-6 px-6 py-4 items-center border-b border-[#F0F5F0] last:border-0 hover:bg-[#5bc48b08] transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E8F5EC] rounded-lg flex items-center justify-center shrink-0">
                  <Package size={16} className="text-[#5BC48B]" />
                </div>
                <span className="text-base font-semibold text-[#1A3D1F] truncate">
                  {item.itemNome}
                </span>
              </div>
              <span className="text-center font-medium text-[#1A3D1F]">
                {item.quantidade}
              </span>
              <span className="text-right font-bold text-[#1A3D1F]">
                {formatarMoeda(item.valorTotal)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Total */}
      <div className="flex justify-end">
        <div className="flex items-center gap-8 px-8 py-5 bg-gradient-to-br from-[#1B6112] to-[#2D7A1F] rounded-2xl shadow-lg shadow-[#1B611226]">
          <span className="text-[0.9rem] font-medium text-white/80 uppercase tracking-widest">
            Valor Total
          </span>
          <span className="text-2xl font-bold text-white">
            {formatarMoeda(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
