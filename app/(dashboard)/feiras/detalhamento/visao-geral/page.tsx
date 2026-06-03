"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Truck,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useVisaoGeralFeira } from "@/features/feiras/hooks/useVisaoGeralFeira";
import { formatarData, formatarHora, formatarMoeda } from "@/utils/formatters";
import { getStatusColor } from "@/utils/status";

function MetricCard({
  icon: Icon,
  label,
  value,
  accent = "#1B6112",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#EEF5EE] shadow-[0_2px_10px_rgba(0,61,4,0.04)] p-5 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}15` }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-xl font-bold text-[#1A3D1F]">{value}</p>
      </div>
    </div>
  );
}

const STATUS_PEDIDO_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  AGUARDANDO_SEPARACAO: "Aguardando Separação",
  PRONTO_RETIRADA: "Pronto p/ Retirada",
  SAIU_ENTREGA: "Saiu p/ Entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

const FEIRA_STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; border: string; text: string }
> = {
  RASCUNHO: {
    label: "Rascunho",
    bg: "bg-[#F5F5F5]",
    border: "border-[#BDBDBD]",
    text: "text-[#616161]",
  },
  ABERTA: {
    label: "Aberta",
    bg: "bg-[#E8F5EC]",
    border: "border-[#C2E5CC]",
    text: "text-[#1B6112]",
  },
  ENCERRADA: {
    label: "Encerrada",
    bg: "bg-[#E3F2FD]",
    border: "border-[#90CAF9]",
    text: "text-[#1565C0]",
  },
  FINALIZADA: {
    label: "Finalizada",
    bg: "bg-[#E8F5EC]",
    border: "border-[#A5D6A7]",
    text: "text-[#2E7D32]",
  },
  CANCELADA: {
    label: "Cancelada",
    bg: "bg-[#FFEBEE]",
    border: "border-[#EF9A9A]",
    text: "text-[#C62828]",
  },
};

function VisaoGeralContent() {
  const searchParams = useSearchParams();
  const feiraId = searchParams.get("feiraId");

  const { detalhes, loading, erro } = useVisaoGeralFeira(feiraId);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5bc48b]" />
      </div>
    );
  }

  if (erro || !detalhes) {
    return (
      <main className="flex-1 px-4 md:px-6 py-8 max-w-5xl w-full mx-auto">
        <PageHeader title="Visão Geral" />
        <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-red-700 font-medium">
            {erro ?? "Selecione uma feira para visualizar os detalhes."}
          </p>
        </div>
      </main>
    );
  }

  const feiraStatusConfig =
    FEIRA_STATUS_CONFIG[detalhes.status] ?? FEIRA_STATUS_CONFIG["RASCUNHO"];

  return (
    <main className="flex-1 px-4 md:px-6 py-8 max-w-5xl w-full mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="Visão Geral"
          subtitle={`${formatarData(detalhes.dataHora)} às ${formatarHora(detalhes.dataHora)}`}
        />
        <span
          className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold uppercase border ${feiraStatusConfig.bg} ${feiraStatusConfig.border} ${feiraStatusConfig.text}`}
        >
          {feiraStatusConfig.label}
        </span>
      </div>

      {/* Métricas de contagem */}
      <section>
        <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-3">
          Resumo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            icon={ShoppingCart}
            label="Total de Pedidos"
            value={String(detalhes.totalPedidos)}
            accent="#003D04"
          />
          <MetricCard
            icon={Users}
            label="Comerciantes"
            value={String(detalhes.totalComerciantes)}
            accent="#1B6112"
          />
          <MetricCard
            icon={Package}
            label="Produtos"
            value={String(detalhes.totalProdutos)}
            accent="#2D7A1F"
          />
        </div>
      </section>

      {/* Métricas financeiras */}
      <section>
        <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-3">
          Financeiro
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            icon={DollarSign}
            label="Valor Total dos Pedidos"
            value={formatarMoeda(detalhes.valorTotalPedidos)}
            accent="#003D04"
          />
          <MetricCard
            icon={BarChart2}
            label="Valor Total dos Produtos"
            value={formatarMoeda(detalhes.valorTotalProdutos)}
            accent="#1B6112"
          />
          <MetricCard
            icon={Truck}
            label="Total em Taxas de Entrega"
            value={formatarMoeda(detalhes.totalTaxasEntrega)}
            accent="#2D7A1F"
          />
          <MetricCard
            icon={TrendingUp}
            label="Total Rateado"
            value={formatarMoeda(detalhes.totalRateado)}
            accent="#3D9428"
          />
        </div>
      </section>

      {/* Pedidos por status */}
      {Object.keys(detalhes.pedidosPorStatus).length > 0 && (
        <section>
          <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-3">
            Pedidos por Status
          </p>
          <div className="bg-white rounded-2xl border border-[#EEF5EE] shadow-[0_2px_10px_rgba(0,61,4,0.04)] overflow-hidden">
            {Object.entries(detalhes.pedidosPorStatus).map(
              ([status, quantidade], idx, arr) => {
                const colors = getStatusColor(status);
                const label =
                  STATUS_PEDIDO_LABELS[status] ?? status.replace(/_/g, " ");
                const total = detalhes.totalPedidos || 1;
                const pct = Math.round((quantidade / total) * 100);
                return (
                  <div
                    key={status}
                    className={`flex items-center gap-4 px-6 py-4 ${idx < arr.length - 1 ? "border-b border-[#F0F5F0]" : ""}`}
                  >
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase border shrink-0 ${colors.bg} ${colors.border} ${colors.text}`}
                    >
                      {label}
                    </span>
                    <div className="flex-1 bg-[#F0F5F0] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#5BC48B] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#1A3D1F] shrink-0 w-6 text-right">
                      {quantidade}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default function FeiraVisaoGeralPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5bc48b]" />
          </div>
        }
      >
        <VisaoGeralContent />
      </Suspense>
    </div>
  );
}
