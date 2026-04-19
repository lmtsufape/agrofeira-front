"use client";

import {
  LucideIcon,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Panel, type TransferItem } from "./TransferPanel";

interface TransferListProps {
  icon: LucideIcon;
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftItems: TransferItem[];
  rightItems: TransferItem[];
  leftSelected: string[];
  rightSelected: string[];
  onLeftSelect: (id: string) => void;
  onRightSelect: (id: string) => void;
  onMoveToLeft: () => void;
  onMoveToRight: () => void;
  onMoveAllToLeft: () => void;
  onMoveAllToRight: () => void;
  loading?: boolean;
}

export function TransferList({
  icon: Icon,
  title,
  leftLabel,
  rightLabel,
  leftItems,
  rightItems,
  leftSelected,
  rightSelected,
  onLeftSelect,
  onRightSelect,
  onMoveToLeft,
  onMoveToRight,
  onMoveAllToLeft,
  onMoveAllToRight,
  loading,
}: Readonly<TransferListProps>) {
  const btnBase =
    "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 active:scale-95 shadow-sm";
  const btnSolid =
    "bg-gradient-to-br from-[#003d04] to-[#1b6112] text-white hover:shadow-md";
  const btnOutline =
    "bg-[#003d041f] border border-[#003d0433] text-[#003d04] hover:bg-[#003d04] hover:text-white";

  return (
    <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
          <Icon size={17} className="text-white" />
        </div>
        <div>
          <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
            {title}
          </h3>
          <p className="text-[#8aaa8d] text-xs">
            Selecione e transfira os itens desejados
          </p>
        </div>
      </div>

      <div className="flex items-stretch gap-2 md:gap-3">
        {/* Painel esquerdo */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[#5bc48b] text-[0.75rem] font-semibold tracking-wider uppercase">
              {leftLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#5bc48b1f] text-[#5bc48b] text-[0.65rem] font-bold">
              {leftItems.length}
            </span>
          </div>
          <Panel
            items={leftItems}
            selected={leftSelected}
            onSelect={onLeftSelect}
            gradient="bg-gradient-to-br from-[#003d04] to-[#1b6112]"
            loading={loading}
          />
        </div>

        {/* Botões de transferência */}
        <div className="flex flex-col items-center justify-center gap-2 py-8 shrink-0">
          <button
            className={`${btnBase} ${btnSolid}`}
            title="Remover todos"
            onClick={onMoveAllToLeft}
          >
            <ChevronsLeft size={15} />
          </button>
          <button
            className={`${btnBase} ${btnOutline}`}
            title="Remover selecionados"
            onClick={onMoveToLeft}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            className={`${btnBase} ${btnOutline}`}
            title="Adicionar selecionados"
            onClick={onMoveToRight}
          >
            <ChevronRight size={15} />
          </button>
          <button
            className={`${btnBase} ${btnSolid}`}
            title="Adicionar todos"
            onClick={onMoveAllToRight}
          >
            <ChevronsRight size={15} />
          </button>
        </div>

        {/* Painel direito */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[#5bc48b] text-[0.75rem] font-semibold tracking-wider uppercase">
              {rightLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#5bc48b1f] text-[#5bc48b] text-[0.65rem] font-bold">
              {rightItems.length}
            </span>
          </div>
          <Panel
            items={rightItems}
            selected={rightSelected}
            onSelect={onRightSelect}
            gradient="bg-gradient-to-br from-[#1b6112] to-[#3d9428]"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
