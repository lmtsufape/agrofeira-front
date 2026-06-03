"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  Users,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { pagamentosService } from "../api/pagamentos.service";
import {
  FaturamentoMensalDTO,
  FeiraDTO,
  FeiraDetalhesDTO,
  RepasseTotaisDTO,
} from "../api/types";

function fmt(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getInitials(nome: string): string {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: FaturamentoMensalDTO }>;
  label?: string;
}

const ChartTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl px-4 py-3 text-xs"
      style={{ background: "#1A3D1F", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
    >
      <p className="text-[#5BC48B] font-bold mb-1">
        {d.mesLabel} {d.ano}
      </p>
      <p className="text-white font-semibold">{fmt(d.totalBruto)}</p>
      <p className="text-[#8AAA8D]">
        {d.quantidadeRepasses} repasse{d.quantidadeRepasses !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export function RelatoriosFinanceiros() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [ano, setAno] = useState(currentYear);
  const [faturamentoMensal, setFaturamentoMensal] = useState<
    FaturamentoMensalDTO[]
  >([]);
  const [rankingGeral, setRankingGeral] = useState<RepasseTotaisDTO[]>([]);
  const [feiras, setFeiras] = useState<FeiraDTO[]>([]);
  const [feiraId, setFeiraId] = useState<string>("");
  const [detalhesFeira, setDetalhesFeira] = useState<FeiraDetalhesDTO | null>(
    null,
  );
  const [rankingFeira, setRankingFeira] = useState<RepasseTotaisDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFeira, setIsLoadingFeira] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarDadosGlobais = useCallback(async (anoRef: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const [mensal, ranking, listFeiras] = await Promise.all([
        pagamentosService.relatorioMensal(anoRef),
        pagamentosService.relatorioGeralPorComerciante(),
        pagamentosService.listarFeiras(),
      ]);
      setFaturamentoMensal(mensal);
      setRankingGeral(ranking);
      setFeiras(listFeiras);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDadosGlobais(ano);
  }, [ano, carregarDadosGlobais]);

  const carregarDetalhesFeira = useCallback(async (id: string) => {
    if (!id) {
      setDetalhesFeira(null);
      setRankingFeira([]);
      return;
    }
    setIsLoadingFeira(true);
    try {
      const [detalhes, totais] = await Promise.all([
        pagamentosService.detalhesFeira(id),
        pagamentosService.totaisRepassesPorFeira(id),
      ]);
      setDetalhesFeira(detalhes);
      setRankingFeira(totais.sort((a, b) => b.totalBruto - a.totalBruto));
    } catch {
      setDetalhesFeira(null);
      setRankingFeira([]);
    } finally {
      setIsLoadingFeira(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDetalhesFeira(feiraId);
  }, [feiraId, carregarDetalhesFeira]);

  const totalAno = faturamentoMensal.reduce((s, m) => s + m.totalBruto, 0);
  const totalRepasses = faturamentoMensal.reduce(
    (s, m) => s + m.quantidadeRepasses,
    0,
  );
  const melhorMes = faturamentoMensal.reduce<FaturamentoMensalDTO | null>(
    (best, m) => (!best || m.totalBruto > best.totalBruto ? m : best),
    null,
  );

  return (
    <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mt-6 w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <button
          onClick={() => router.push("/pagamentos")}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0"
          style={{
            background: "white",
            boxShadow: "0 2px 10px rgba(0,61,4,0.12)",
            border: "1px solid rgba(0,61,4,0.1)",
          }}
        >
          <ArrowLeft size={17} style={{ color: "#003d04" }} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3D1F]">
            Relatórios Financeiros
          </h1>
          <p className="text-xs sm:text-sm text-[#8AAA8D]">
            Acompanhe faturamento, repasses e desempenho por feira.
          </p>
        </div>
        <button
          onClick={() => carregarDadosGlobais(ano)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-xs sm:text-sm transition-all shrink-0"
          style={{ background: isLoading ? "#8AAA8D" : "#5BC48B" }}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-lg text-sm font-medium"
          style={{
            background: "#F8D7DA",
            border: "1px solid #F5C6CB",
            color: "#721C24",
          }}
        >
          {error}
        </div>
      )}

      {/* Cards de resumo anual */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          icon={<TrendingUp size={18} style={{ color: "#5BC48B" }} />}
          label={`Faturamento ${ano}`}
          value={isLoading ? "—" : fmt(totalAno)}
          sub="Total bruto dos repasses"
        />
        <SummaryCard
          icon={<Banknote size={18} style={{ color: "#5BC48B" }} />}
          label="Repasses no Período"
          value={isLoading ? "—" : String(totalRepasses)}
          sub="Quantidade de repasses"
        />
        <SummaryCard
          icon={<ShoppingBag size={18} style={{ color: "#5BC48B" }} />}
          label="Melhor Mês"
          value={isLoading || !melhorMes ? "—" : melhorMes.mesLabel}
          sub={melhorMes ? fmt(melhorMes.totalBruto) : "Sem dados"}
        />
        <SummaryCard
          icon={<Users size={18} style={{ color: "#5BC48B" }} />}
          label="Comerciantes Ativos"
          value={isLoading ? "—" : String(rankingGeral.length)}
          sub="Com repasses registrados"
        />
      </div>

      {/* Gráfico de evolução mensal */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0px 8px 30px rgba(0, 61, 4, 0.04)",
          border: "1px solid #EEF5EE",
        }}
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-4"
          style={{ borderBottom: "1px solid #EEF5EE" }}
        >
          <div>
            <h2 className="font-bold text-[#1A3D1F] text-base sm:text-lg">
              Evolução Mensal de Faturamento
            </h2>
            <p className="text-xs text-[#8AAA8D]">
              Soma bruta dos repasses por mês
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAno((a) => a - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[#f0f5f0]"
            >
              <ChevronLeft size={14} style={{ color: "#1A3D1F" }} />
            </button>
            <span className="text-sm font-bold text-[#1A3D1F] w-10 text-center">
              {ano}
            </span>
            <button
              onClick={() => setAno((a) => Math.min(a + 1, currentYear))}
              disabled={ano >= currentYear}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[#f0f5f0] disabled:opacity-40"
            >
              <ChevronRight size={14} style={{ color: "#1A3D1F" }} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-[#8AAA8D] text-sm">
              Carregando...
            </div>
          ) : faturamentoMensal.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[#8AAA8D] text-sm">
              Nenhum dado para {ano}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={faturamentoMensal}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EEF5EE"
                  vertical={false}
                />
                <XAxis
                  dataKey="mesLabel"
                  stroke="#8AAA8D"
                  style={{ fontSize: "11px" }}
                />
                <YAxis
                  stroke="#8AAA8D"
                  style={{ fontSize: "10px" }}
                  tickFormatter={(v: number) =>
                    `R$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                  width={45}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="totalBruto"
                  fill="#5BC48B"
                  radius={[6, 6, 0, 0]}
                  animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Ranking geral de comerciantes */}
      {rankingGeral.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0px 8px 30px rgba(0, 61, 4, 0.04)",
            border: "1px solid #EEF5EE",
          }}
        >
          <div
            className="px-4 sm:px-6 py-4"
            style={{ borderBottom: "1px solid #EEF5EE" }}
          >
            <h2 className="font-bold text-[#1A3D1F] text-base sm:text-lg">
              Ranking de Comerciantes
            </h2>
            <p className="text-xs text-[#8AAA8D]">
              Ordenado pelo total bruto acumulado (todos os períodos)
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "#F0F5F0" }}>
            {rankingGeral.slice(0, 8).map((item, idx) => (
              <div
                key={item.comerciante.id}
                className="flex items-center gap-3 px-4 sm:px-6 py-3"
              >
                <span
                  className="w-6 text-center text-xs font-bold"
                  style={{ color: idx < 3 ? "#5BC48B" : "#8AAA8D" }}
                >
                  {idx + 1}º
                </span>
                <div className="w-8 h-8 rounded-full bg-[#5BC48B] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {getInitials(item.comerciante.nome)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A3D1F] text-sm truncate">
                    {item.comerciante.nome}
                  </p>
                  <p className="text-[0.65rem] text-[#8AAA8D]">
                    {item.quantidadeRepasses} repasse
                    {item.quantidadeRepasses !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#1A3D1F] text-sm">
                    {fmt(item.totalBruto)}
                  </p>
                  <p className="text-[0.65rem] text-[#8AAA8D]">
                    líq. {fmt(item.totalLiquido)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalhes por feira */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0px 8px 30px rgba(0, 61, 4, 0.04)",
          border: "1px solid #EEF5EE",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-4"
          style={{ borderBottom: "1px solid #EEF5EE" }}
        >
          <Store size={16} style={{ color: "#5BC48B" }} />
          <div>
            <h2 className="font-bold text-[#1A3D1F] text-base sm:text-lg">
              Detalhes por Feira
            </h2>
            <p className="text-xs text-[#8AAA8D]">
              Selecione uma feira para ver o balanço financeiro
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* Seletor de feira */}
          <select
            value={feiraId}
            onChange={(e) => setFeiraId(e.target.value)}
            className="w-full sm:w-80 px-3 py-2.5 rounded-xl border outline-none text-[#1a3d1f] text-sm"
            style={{
              background: "#F9FAFB",
              borderColor: "#DAEEDA",
              boxShadow: "0 1px 3px rgba(0,61,4,0.06)",
            }}
          >
            <option value="">Selecionar feira...</option>
            {feiras.map((f) => (
              <option key={f.id} value={f.id}>
                {fmtData(f.dataHora)} — {f.status}
              </option>
            ))}
          </select>

          {isLoadingFeira && (
            <div className="py-8 flex justify-center text-[#8AAA8D] text-sm">
              Carregando dados da feira...
            </div>
          )}

          {!isLoadingFeira && feiraId && !detalhesFeira && (
            <div className="py-8 flex justify-center text-[#8AAA8D] text-sm">
              Nenhum dado disponível para esta feira.
            </div>
          )}

          {!isLoadingFeira && detalhesFeira && (
            <>
              {/* Cards de detalhes da feira */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <FeiraCard
                  label="Pedidos"
                  value={String(detalhesFeira.totalPedidos)}
                  sub="Total na feira"
                />
                <FeiraCard
                  label="Faturamento"
                  value={fmt(detalhesFeira.valorTotalPedidos)}
                  sub="Valor total dos pedidos"
                />
                <FeiraCard
                  label="Total Rateado"
                  value={fmt(detalhesFeira.totalRateado)}
                  sub="Distribuído aos comerciantes"
                />
                <FeiraCard
                  label="Taxa de Entrega"
                  value={fmt(detalhesFeira.totalTaxasEntrega)}
                  sub="Arrecadado em entregas"
                />
                <FeiraCard
                  label="Comerciantes"
                  value={String(detalhesFeira.totalComerciantes)}
                  sub="Participantes na feira"
                />
              </div>

              {/* Status dos pedidos */}
              {Object.keys(detalhesFeira.pedidosPorStatus).length > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#F9FAFB", border: "1px solid #EEF5EE" }}
                >
                  <p className="text-xs font-bold text-[#8AAA8D] uppercase tracking-wider mb-3">
                    Pedidos por Status
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(detalhesFeira.pedidosPorStatus).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{
                            background: "white",
                            border: "1px solid #EEF5EE",
                          }}
                        >
                          <span className="text-xs font-semibold text-[#1A3D1F]">
                            {count}
                          </span>
                          <span className="text-xs text-[#8AAA8D]">
                            {status}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Ranking de comerciantes da feira */}
              {rankingFeira.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#8AAA8D] uppercase tracking-wider mb-3">
                    Ranking de Comerciantes — Esta Feira
                  </p>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid #EEF5EE" }}
                  >
                    {rankingFeira.map((item, idx) => (
                      <div
                        key={item.comerciante.id}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{
                          borderBottom:
                            idx < rankingFeira.length - 1
                              ? "1px solid #F0F5F0"
                              : undefined,
                        }}
                      >
                        <span
                          className="w-6 text-center text-xs font-bold"
                          style={{ color: idx < 3 ? "#5BC48B" : "#8AAA8D" }}
                        >
                          {idx + 1}º
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#5BC48B] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(item.comerciante.nome)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A3D1F] text-sm truncate">
                            {item.comerciante.nome}
                          </p>
                          <p className="text-[0.65rem] text-[#8AAA8D]">
                            {item.quantidadeRepasses} produto
                            {item.quantidadeRepasses !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#1A3D1F] text-sm">
                            {fmt(item.totalBruto)}
                          </p>
                          <p className="text-[0.65rem] text-[#8AAA8D]">
                            líq. {fmt(item.totalLiquido)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "white",
        boxShadow: "0px 8px 30px rgba(0, 61, 4, 0.04)",
        border: "1px solid #EEF5EE",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#E8F5EC" }}
        >
          {icon}
        </div>
        <span className="text-xs font-semibold text-[#8AAA8D] leading-tight">
          {label}
        </span>
      </div>
      <p className="text-lg sm:text-xl font-bold text-[#1A3D1F] leading-tight">
        {value}
      </p>
      <p className="text-[0.65rem] text-[#8AAA8D]">{sub}</p>
    </div>
  );
}

function FeiraCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-1"
      style={{ background: "white", border: "1px solid #EEF5EE" }}
    >
      <p className="text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-wider">
        {label}
      </p>
      <p className="font-bold text-[#1A3D1F] text-sm sm:text-base leading-tight">
        {value}
      </p>
      <p className="text-[0.6rem] text-[#8AAA8D]">{sub}</p>
    </div>
  );
}
