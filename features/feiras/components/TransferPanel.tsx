"use client";

import { Check, Loader2 } from "lucide-react";

export type TransferItem = { id: string; label: string };

interface PanelProps {
  items: TransferItem[];
  selected: string[];
  onSelect: (id: string) => void;
  gradient: string;
  loading?: boolean;
}

export function Panel({
  items,
  selected,
  onSelect,
  gradient,
  loading,
}: Readonly<PanelProps>) {
  let content = null;

  if (loading) {
    content = (
      <div className="flex items-center justify-center h-full gap-2">
        <Loader2 size={16} className="text-[#5bc48b] animate-spin" />
        <p className="text-[#aacaad] text-xs">Carregando...</p>
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#5bc48b26]">
          <Check size={14} className="text-[#5bc48b]" />
        </div>
        <p className="text-[#aacaad] text-xs">Nenhum item</p>
      </div>
    );
  } else {
    content = items.map((item) => {
      const isSel = selected.includes(item.id);

      const buttonClasses = isSel
        ? `text-white shadow-md ${gradient}`
        : "bg-white text-[#1a3d1f] shadow-sm hover:bg-[#5bc48b0d]";

      return (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all duration-150 flex items-center gap-2 shadow-sm ${buttonClasses}`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-150
              ${isSel ? "bg-white/20 border-0" : "bg-[#5bc48b26] border-[1.5px] border-[#5bc48b]"}`}
          >
            {isSel && <Check size={10} className="text-white" />}
          </div>
          <span className="text-xs font-medium truncate">{item.label}</span>
        </button>
      );
    });
  }

  return (
    <div className="flex-1 rounded-xl p-2 overflow-y-auto min-h-[160px] max-h-[200px] bg-gradient-to-br from-[#f6faf4] to-[#edf5eb] border-[1.5px] border-[#daeeda]">
      {content}
    </div>
  );
}
