"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, RefreshCw } from "lucide-react";
import { pagamentosService } from "../api/pagamentos.service";
import { RelatorioDTO } from "../api/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dados de exemplo
const mockData = [
  { month: "Jun", faturamento: 1250 },
  { month: "Jul", faturamento: 1840 },
  { month: "Ago", faturamento: 1420 },
  { month: "Set", faturamento: 2800 },
  { month: "Out", faturamento: 3150 },
  { month: "Nov", faturamento: 2890 },
  { month: "Dez", faturamento: 4560 },
];

// Interface para tipagem do dado mockado
interface MockDataItem {
  month: string;
  faturamento: number;
}

// Interface para CustomTooltip sem usar 'any'
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: string | number;
    name?: string;
    dataKey?: string;
    payload?: MockDataItem;
    [key: string]: unknown;
  }>;
  label?: string;
}

// CustomTooltip movido para fora do componente
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const payloadData = payload[0].payload as MockDataItem;
    return (
      <div
        className="rounded-lg px-3 py-2 text-xs font-semibold"
        style={{
          background: "#1A3D1F",
          boxShadow: "0px 4px 6px -4px rgba(0, 0, 0, 0.10)",
        }}
      >
        <p style={{ color: "white", marginBottom: "4px" }}>
          {payloadData?.month}
        </p>
        <p style={{ color: "white" }}>
          R$ {(payload[0].value as number).toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

export function RelatoriosFinanceiros() {
  const router = useRouter();
  const [relatorios, setRelatorios] = useState<RelatorioDTO[]>([]);
  const [selectedRelatorio, setSelectedRelatorio] =
    useState<RelatorioDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar relatórios ao carregar a página
  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        setIsLoading(true);
        const anoAtual = new Date().getFullYear();
        const data = await pagamentosService.listarRelatoriosPorMes(anoAtual);
        setRelatorios(data);
        if (data.length > 0) {
          setSelectedRelatorio(data[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
        setError("Erro ao carregar relatórios");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  const handleAtualizar = async () => {
    try {
      setIsLoading(true);
      const anoAtual = new Date().getFullYear();
      const data = await pagamentosService.listarRelatoriosPorMes(anoAtual);
      setRelatorios(data);
      if (data.length > 0) {
        setSelectedRelatorio(data[0]);
      }
      setError(null);
    } catch (err) {
      console.error("Erro ao atualizar relatórios:", err);
      setError("Erro ao atualizar relatórios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 mt-6 max-w-7xl w-full mx-auto flex flex-col gap-4 sm:gap-6">
      {/* Voltar + Título */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <button
          onClick={() => router.push("/pagamentos")}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0 flex-none"
          style={{
            background: "white",
            boxShadow: "0 2px 10px rgba(0,61,4,0.12)",
            border: "1px solid rgba(0,61,4,0.1)",
          }}
        >
          <ArrowLeft size={17} style={{ color: "#003d04" }} />
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="text-lg sm:text-xl md:text-2xl text-[#1a3d1f] font-bold leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Relatórios Financeiros
          </h1>
          <p className="text-xs sm:text-sm text-[#8aaa8d] line-clamp-2">
            Acompanhe o volume de vendas e faturamento no período.
          </p>
        </div>
      </div>

      {/* Container Principal - Responsivo */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
        {/* Painel de Filtros */}
        <div
          className="w-full lg:w-72 rounded-2xl overflow-hidden flex flex-col order-2 lg:order-1"
          style={{
            background: "white",
            boxShadow:
              "0 2px 16px rgba(0,61,4,0.07), 0 0 0 1px rgba(0,61,4,0.06)",
          }}
        >
          {/* Header do Filtro */}
          <div
            className="flex items-center gap-3 p-3 sm:p-4 md:p-5"
            style={{
              background: "#FCFDFC",
              borderBottom: "1px solid #EEF5EE",
            }}
          >
            <Calendar size={16} style={{ color: "#1B6112" }} />
            <h3 className="font-bold text-[#1B6112] text-sm sm:text-base">
              Filtros de Pesquisa
            </h3>
          </div>

          {/* Conteúdo dos Filtros */}
          <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-5">
            {/* Dropdown de Relatórios */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-[#5BC48B] text-xs font-bold uppercase tracking-wider">
                Selecionar Relatório
              </label>
              <select
                value={selectedRelatorio?.id || ""}
                onChange={(e) => {
                  const relatorio = relatorios.find(
                    (r) => r.id === e.target.value,
                  );
                  if (relatorio) {
                    setSelectedRelatorio(relatorio);
                  }
                }}
                disabled={relatorios.length === 0 || isLoading}
                className="px-3 py-2 rounded-lg border outline-none text-[#1a3d1f] text-xs sm:text-sm disabled:opacity-50"
                style={{
                  background: "#F9FAFB",
                  borderColor: "#DAEEDA",
                  boxShadow: "0 1px 3px rgba(0,61,4,0.06)",
                }}
              >
                {relatorios.length === 0 ? (
                  <option value="">Carregando relatórios...</option>
                ) : (
                  relatorios.map((relatorio) => (
                    <option key={relatorio.id} value={relatorio.id}>
                      {relatorio.titulo}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Botão Atualizar */}
          <div
            className="p-3 sm:p-4 md:p-5"
            style={{
              background: "#FCFDFC",
              borderTop: "1px solid #EEF5EE",
            }}
          >
            <button
              onClick={handleAtualizar}
              disabled={isLoading}
              className="w-full py-2 sm:py-2.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              style={{
                background: isLoading ? "#8AAA8D" : "#5BC48B",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#4ab07a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#5BC48B";
                }
              }}
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Atualizar Dados
            </button>
          </div>
        </div>

        {/* Gráfico */}
        <div
          className="flex-1 rounded-2xl overflow-hidden flex flex-col order-1 lg:order-2 min-w-0"
          style={{
            background: "white",
            boxShadow:
              "0 2px 16px rgba(0,61,4,0.07), 0 0 0 1px rgba(0,61,4,0.06)",
          }}
        >
          {/* Header do Gráfico */}
          <div
            className="p-3 sm:p-4 md:p-6 text-center"
            style={{ borderBottom: "1px solid #EEF5EE" }}
          >
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#1a3d1f] mb-1">
              {selectedRelatorio?.titulo || "Relatório Financeiro"}
            </h2>
            <p className="text-xs sm:text-sm text-[#8aaa8d]">
              {error ? error : "Evolução de receita no período selecionado"}
            </p>
          </div>

          {/* Gráfico - Responsivo */}
          <div className="flex-1 p-2 sm:p-3 md:p-6 w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={250}>
              <BarChart
                data={mockData}
                margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EEF5EE"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#8AAA8D"
                  style={{ fontSize: "10px" }}
                />
                <YAxis
                  stroke="#8AAA8D"
                  style={{ fontSize: "10px" }}
                  tickFormatter={(value: number) => `R$ ${value / 1000}k`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="faturamento"
                  fill="#5BC48B"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resumo - Grid Responsivo */}
          <div
            className="p-3 sm:p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4"
            style={{
              background: "#FCFDFC",
              borderTop: "1px solid #EEF5EE",
            }}
          >
            <div className="text-center min-w-0">
              <p className="text-xs text-[#8aaa8d] mb-0.5 sm:mb-1">Total</p>
              <p className="text-sm sm:text-lg font-bold text-[#1a3d1f] truncate">
                R$ 21.810
              </p>
            </div>
            <div className="text-center min-w-0">
              <p className="text-xs text-[#8aaa8d] mb-0.5 sm:mb-1">Média</p>
              <p className="text-sm sm:text-lg font-bold text-[#1a3d1f] truncate">
                R$ 3.115
              </p>
            </div>
            <div className="text-center min-w-0 col-span-2 sm:col-span-1">
              <p className="text-xs text-[#8aaa8d] mb-0.5 sm:mb-1">Maior Mês</p>
              <p className="text-sm sm:text-lg font-bold text-[#1a3d1f] truncate">
                Dez (R$ 4.560)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
