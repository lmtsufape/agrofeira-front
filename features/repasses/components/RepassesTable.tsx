"use client";

import { useState } from "react";
import { X, CheckCircle2, Clock } from "lucide-react";
import { type RepasseDTO } from "@/features/repasses/api/types";
import { formatarData, formatarMoeda } from "@/utils/formatters";

interface RepassesTableProps {
  repasses: RepasseDTO[];
}

interface ComercianteGroup {
  comerciante: RepasseDTO["comerciante"];
  repasses: RepasseDTO[];
  totalBruto: number;
  totalLiquido: number;
  repassadoEm: string | null;
  feiraId: string;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; label: string }
> = {
  PAGO: {
    bg: "bg-[#E8F5EC]",
    border: "border-[#C2E5CC]",
    text: "text-[#1B6112]",
    label: "Pago",
  },
  PENDENTE: {
    bg: "bg-[#FFF8E6]",
    border: "border-[#FFE082]",
    text: "text-[#B38600]",
    label: "Pendente",
  },
  CANCELADO: {
    bg: "bg-[#FFEBEE]",
    border: "border-[#EF9A9A]",
    text: "text-[#C62828]",
    label: "Cancelado",
  },
};

function getInitials(nome: string): string {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function groupByComercianteAndFeira(
  repasses: RepasseDTO[],
): ComercianteGroup[] {
  const map = new Map<string, ComercianteGroup>();
  for (const r of repasses) {
    const key = `${r.comerciante.id}-${r.feiraId}`;
    if (!map.has(key)) {
      map.set(key, {
        comerciante: r.comerciante,
        repasses: [],
        totalBruto: 0,
        totalLiquido: 0,
        repassadoEm: r.repassadoEm,
        feiraId: r.feiraId,
      });
    }
    const g = map.get(key)!;
    g.repasses.push(r);
    g.totalBruto += r.valorBruto;
    g.totalLiquido += r.valorLiquido;
    if (r.repassadoEm && (!g.repassadoEm || r.repassadoEm > g.repassadoEm)) {
      g.repassadoEm = r.repassadoEm;
    }
  }
  return Array.from(map.values());
}

export function RepassesTable({ repasses }: Readonly<RepassesTableProps>) {
  const [selected, setSelected] = useState<ComercianteGroup | null>(null);
  const groups = groupByComercianteAndFeira(repasses);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FCFDFC] border-b border-[#EEF5EE]">
              {[
                "Agricultor",
                "Data do Repasse",
                "Total Bruto",
                "Total Líquido",
                "Status",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#5BC48B] ${i === 4 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F5F0]">
            {groups.map((group) => {
              const key = `${group.comerciante.id}-${group.feiraId}`;
              const allPago = group.repasses.every((r) => r.status === "PAGO");
              const status = allPago ? "PAGO" : "PENDENTE";
              const statusCfg = STATUS_CONFIG[status];

              return (
                <tr
                  key={key}
                  onClick={() => setSelected(group)}
                  className="hover:bg-[#5bc48b08] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#5BC48B] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {getInitials(group.comerciante.nome)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1A3D1F] truncate">
                          {group.comerciante.nome}
                        </p>
                        <p className="text-[0.65rem] text-[#8AAA8D]">
                          {group.repasses.length} produto
                          {group.repasses.length !== 1 ? "s" : ""} · clique para
                          ver detalhes
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {group.repassadoEm ? (
                      <p className="text-sm text-[#1A3D1F] font-medium">
                        {formatarData(group.repassadoEm)}
                      </p>
                    ) : (
                      <p className="text-sm text-[#8AAA8D]">—</p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1A3D1F]">
                      {formatarMoeda(group.totalBruto)}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1A3D1F]">
                      {formatarMoeda(group.totalLiquido)}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <RepasseModal group={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function RepasseModal({
  group,
  onClose,
}: {
  group: ComercianteGroup;
  onClose: () => void;
}) {
  const allPago = group.repasses.every((r) => r.status === "PAGO");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEF5EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5BC48B] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              {group.comerciante.nome
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-[#1A3D1F] font-bold text-base leading-tight">
                {group.comerciante.nome}
              </h2>
              {group.repassadoEm && (
                <p className="text-[#8AAA8D] text-xs">
                  Repassado em {formatarData(group.repassadoEm)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {allPago ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#C2E5CC]">
                <CheckCircle2 size={12} className="text-[#1B6112]" />
                <span className="text-[0.68rem] font-bold text-[#1B6112] uppercase tracking-wide">
                  Pago
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E6] border border-[#FFE082]">
                <Clock size={12} className="text-[#B38600]" />
                <span className="text-[0.68rem] font-bold text-[#B38600] uppercase tracking-wide">
                  Pendente
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-xl text-[#8AAA8D] hover:bg-[#f0f5f0] hover:text-[#1A3D1F] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabela de produtos */}
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#FCFDFC]">
              <tr className="border-b border-[#EEF5EE]">
                <th className="text-left px-6 py-3 text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
                  Produto
                </th>
                <th className="text-right px-6 py-3 text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
                  Qtd.
                </th>
                <th className="text-right px-6 py-3 text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5F0]">
              {group.repasses.map((r) => (
                <tr key={r.id} className="hover:bg-[#f6faf4] transition-colors">
                  <td className="px-6 py-3">
                    <p className="text-[#1A3D1F] font-medium">
                      {r.produtoNome}
                    </p>
                    <p className="text-[0.65rem] text-[#8AAA8D]">
                      {formatarMoeda(r.valorBruto / r.quantidadeVendida)} /{" "}
                      {r.produtoUnidade}
                    </p>
                  </td>
                  <td className="px-6 py-3 text-right text-[#1A3D1F] font-medium whitespace-nowrap">
                    {r.quantidadeVendida} {r.produtoUnidade}
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-[#1A3D1F]">
                    {formatarMoeda(r.valorBruto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer — totais */}
        <div className="px-6 py-4 border-t border-[#EEF5EE] bg-[#f6faf4] flex items-center justify-between gap-4">
          <span className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
            Total a receber
          </span>
          <p className="font-bold text-[#2d7a1f] text-xl">
            {formatarMoeda(group.totalBruto)}
          </p>
        </div>
      </div>
    </div>
  );
}
