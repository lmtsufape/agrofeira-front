"use client";

import { Package, Store, Users, ChevronRight } from "lucide-react";

interface SummaryItem {
  id: string;
  nome: string;
}

interface SummaryTableProps {
  type: "item" | "comerciante" | "cliente";
  data: SummaryItem[];
  onDetailClick: (type: "item" | "comerciante" | "cliente", id: string) => void;
}

export function SummaryTable({
  type,
  data,
  onDetailClick,
}: Readonly<SummaryTableProps>) {
  const config = {
    item: { label: "Itens", icon: Package },
    comerciante: { label: "Comerciantes", icon: Store },
    cliente: { label: "Clientes", icon: Users },
  };

  const { label, icon: Icon } = config[type];

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,61,4,0.08),0_0_0_1px_rgba(0,61,4,0.06)] bg-white">
      {/* Cabeçalho */}
      <div className="px-5 py-3 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-white/60 shrink-0" />
          <span className="text-white/90 uppercase text-[0.7rem] font-bold tracking-widest">
            {label} ({data.length})
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div>
        {data.length === 0 ? (
          <div className="px-5 py-8 text-center border-b border-[#eef5ee] last:border-0">
            <p className="text-[#9db89f] text-sm italic">
              Nenhum dado disponível
            </p>
          </div>
        ) : (
          data.map((item, i) => (
            <div
              key={item.id + i}
              className={`px-4 md:px-5 py-3 transition-colors duration-150 border-b border-[#eef5ee] last:border-0 hover:bg-[#5bc48b0f] flex items-center justify-between gap-3
                ${i % 2 === 0 ? "bg-white" : "bg-[#fafcf9]"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#5bc48b1f]">
                  <Icon size={13} className="text-[#5bc48b]" />
                </div>
                <p className="text-[#1a3d1f] font-medium text-[0.9rem] truncate">
                  {item.nome}
                </p>
              </div>
              <button
                onClick={() => onDetailClick(type, item.id)}
                className="px-3 py-1.5 bg-[#5bc48b] text-white rounded-lg font-semibold text-[0.75rem] hover:bg-[#3da96f] transition-all flex items-center gap-1 active:scale-95"
              >
                <span>Detalhar</span>
                <ChevronRight size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
