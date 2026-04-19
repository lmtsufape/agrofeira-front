"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { type PedidoDTO } from "@/features/pedidos/services/pedidos.service";
import { formatarData, formatarHora, formatarMoeda } from "@/utils/formatters";
import { getStatusColor } from "@/utils/status";

interface PedidosTableProps {
  pedidos: PedidoDTO[];
}

export function PedidosTable({ pedidos }: Readonly<PedidosTableProps>) {
  const router = useRouter();

  const getInitials = (nome: string): string => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FCFDFC] border-b border-[#EEF5EE]">
            {["Cliente", "Data e Hora", "Status", "Total", "Ação"].map(
              (h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#5BC48B] ${i === 4 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F5F0]">
          {pedidos.map((pedido) => {
            const colors = getStatusColor(pedido.status);
            return (
              <tr
                key={pedido.id}
                className="hover:bg-[#5bc48b05] transition-colors"
              >
                {/* Cliente */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5BC48B] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                      {getInitials(pedido.clienteNome)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1A3D1F] truncate">
                        {pedido.clienteNome}
                      </p>
                      <p className="text-[0.65rem] text-[#8AAA8D] font-mono">
                        ID: #{pedido.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Data */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-[#1A3D1F] font-medium">
                    {formatarData(pedido.feiraData)}
                  </p>
                  <p className="text-[0.7rem] text-[#8AAA8D] flex items-center gap-1">
                    <span className="opacity-70">🕐</span>{" "}
                    {formatarHora(pedido.feiraData)}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase border ${colors.bg} ${colors.border} ${colors.text}`}
                  >
                    {pedido.status}
                  </span>
                </td>

                {/* Total */}
                <td className="px-6 py-4">
                  <p className="font-bold text-[#1A3D1F]">
                    {formatarMoeda(pedido.valorTotal)}
                  </p>
                </td>

                {/* Ação */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => router.push(`/pedidos/${pedido.id}`)}
                    className="p-2 hover:bg-[#5BC48B1a] rounded-lg transition-colors text-[#9DB89F] hover:text-[#1B6112] active:scale-90"
                    title="Ver Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
