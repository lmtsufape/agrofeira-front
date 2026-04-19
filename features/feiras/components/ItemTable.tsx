"use client";

import { Package, Hash, DollarSign, Receipt } from "lucide-react";
import { type ClienteAgrupado } from "../hooks/useDetalhamentoCliente";
import { formatarMoeda } from "@/utils/formatters";

interface ItemTableProps {
  cliente: ClienteAgrupado;
}

export function ItemTable({ cliente }: Readonly<ItemTableProps>) {
  const totalQtd = cliente.itens.reduce(
    (acc, it) => acc + Number(it.quantidade),
    0,
  );

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,61,4,0.08),0_0_0_1px_rgba(0,61,4,0.06)]">
      {/* Cabeçalho */}
      <div className="hidden md:grid px-5 py-3 grid-cols-[1fr_120px_130px_110px] gap-4 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
        {[
          { label: "Nome", icon: Package, align: "left" },
          { label: "Quantidade", icon: Hash, align: "right" },
          { label: "Valor unitário", icon: DollarSign, align: "right" },
          { label: "Total", icon: Receipt, align: "right" },
        ].map(({ label, icon: Icon, align }) => (
          <div
            key={label}
            className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}
          >
            <Icon size={13} className="text-white/60 shrink-0" />
            <span className="text-white/90 uppercase text-[0.7rem] font-bold tracking-widest">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Cabeçalho mobile */}
      <div className="md:hidden px-4 py-3 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
        <span className="text-white/90 uppercase text-[0.7rem] font-bold tracking-widest">
          Itens do pedido
        </span>
      </div>

      {/* Linhas */}
      <div className="bg-white">
        {cliente.itens.map((item, i) => (
          <div
            key={item.id}
            className={`px-4 md:px-5 py-3 md:py-3.5 transition-colors duration-150 border-b border-[#eef5ee] last:border-0 hover:bg-[#5bc48b0f]
              ${i % 2 === 0 ? "bg-white" : "bg-[#fafcf9]"}`}
          >
            {/* Desktop */}
            <div className="hidden md:grid items-center grid-cols-[1fr_120px_130px_110px] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#5bc48b1f]">
                  <Package size={13} className="text-[#5bc48b]" />
                </div>
                <span className="text-[#1a3d1f] font-medium text-[0.9rem] truncate">
                  {item.itemNome}
                </span>
              </div>
              <div className="flex justify-end">
                <span className="px-2.5 py-0.5 rounded-full text-[0.85rem] font-semibold bg-[#003d0412] text-[#1a3d1f]">
                  {Number(item.quantidade)}
                </span>
              </div>
              <div className="flex justify-end">
                <span className="text-[#5a7a5e] font-medium text-[0.9rem]">
                  {formatarMoeda(Number(item.valorUnitario))}
                </span>
              </div>
              <div className="flex justify-end">
                <span className="text-[#1a3d1f] font-bold text-[0.9rem]">
                  {formatarMoeda(Number(item.valorTotal))}
                </span>
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#5bc48b1f]">
                  <Package size={13} className="text-[#5bc48b]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#1a3d1f] font-medium text-sm truncate">
                    {item.itemNome}
                  </p>
                  <p className="text-[#9db89f] text-xs">
                    {Number(item.quantidade)}x{" "}
                    {formatarMoeda(Number(item.valorUnitario))}
                  </p>
                </div>
              </div>
              <span className="text-[#1a3d1f] font-bold text-sm shrink-0">
                {formatarMoeda(Number(item.valorTotal))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé totais */}
      <div className="px-4 md:px-5 py-4 bg-gradient-to-br from-[rgba(0,61,4,0.07)] to-[rgba(91,196,139,0.1)] border-t-2 border-[#5bc48b4d]">
        {/* Desktop */}
        <div className="hidden md:grid items-center grid-cols-[1fr_120px_130px_110px] gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <Receipt size={13} className="text-white" />
            </div>
            <span className="text-[#003d04] font-bold text-[0.85rem]">
              Totais
            </span>
          </div>
          <div className="flex justify-end">
            <span className="px-2.5 py-0.5 rounded-full text-[0.85rem] font-bold bg-[#003d041a] text-[#003d04]">
              {totalQtd}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-[#5a7a5e] text-[0.85rem]">—</span>
          </div>
          <div className="flex justify-end">
            <span className="text-[#003d04] font-bold text-[0.95rem]">
              {formatarMoeda(cliente.totalGeral)}
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <Receipt size={13} className="text-white" />
            </div>
            <span className="text-[#003d04] font-bold text-sm">
              Total — {totalQtd} itens
            </span>
          </div>
          <span className="text-[#003d04] font-bold text-base">
            {formatarMoeda(cliente.totalGeral)}
          </span>
        </div>
      </div>
    </div>
  );
}
