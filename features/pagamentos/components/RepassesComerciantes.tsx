"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  ChevronRight,
  Check,
  ArrowLeft,
  X,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { pagamentosService } from "../api/pagamentos.service";
import { RepasseDTO } from "../api/types";

interface ComercianteGroup {
  comerciante: RepasseDTO["comerciante"];
  repasses: RepasseDTO[];
  totalBruto: number;
  totalLiquido: number;
}

function getInitials(nome: string): string {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function groupByComerciante(repasses: RepasseDTO[]): ComercianteGroup[] {
  const map = new Map<string, ComercianteGroup>();
  for (const r of repasses) {
    const key = r.comerciante.id;
    if (!map.has(key)) {
      map.set(key, {
        comerciante: r.comerciante,
        repasses: [],
        totalBruto: 0,
        totalLiquido: 0,
      });
    }
    const g = map.get(key)!;
    g.repasses.push(r);
    g.totalBruto += r.valorBruto;
    g.totalLiquido += r.valorLiquido;
  }
  return Array.from(map.values());
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function RepassesComerciantes() {
  const router = useRouter();
  const [repasses, setRepasses] = useState<RepasseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ComercianteGroup | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    carregarRepasses();
  }, []);

  async function carregarRepasses() {
    setIsLoading(true);
    setError(null);
    try {
      const dados = await pagamentosService.listarRepasses();
      setRepasses(dados);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const groups = groupByComerciante(repasses);
  const paginatedGroups = groups.slice(0, itemsPerPage);

  return (
    <>
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mt-6 w-full flex flex-col gap-4 sm:gap-6">
        {/* Voltar + Cabeçalho */}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3D1F]">
              Pagamentos Comerciantes
            </h1>
            <p className="text-xs sm:text-sm text-[#8AAA8D] line-clamp-2">
              Gerencie os repasses financeiros do mês atual.
            </p>
          </div>
        </div>

        {error && !isLoading && (
          <div
            className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium"
            style={{
              background: "#F8D7DA",
              border: "1px solid #F5C6CB",
              color: "#721C24",
            }}
          >
            {error}
          </div>
        )}

        {/* Botão Atualizar */}
        <div className="flex justify-end">
          <button
            onClick={carregarRepasses}
            disabled={isLoading}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            style={{ background: isLoading ? "#8AAA8D" : "#5BC48B" }}
            onMouseEnter={(e) => {
              if (!isLoading)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#4ab07a";
            }}
            onMouseLeave={(e) => {
              if (!isLoading)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#5BC48B";
            }}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Atualizar Dados
          </button>
        </div>

        {/* Tabela */}
        <div
          className="rounded-2xl overflow-x-auto flex flex-col"
          style={{
            background: "white",
            boxShadow: "0px 8px 30px rgba(0, 61, 4, 0.04)",
            border: "1px solid #EEF5EE",
          }}
        >
          {/* Header */}
          <div
            className="hidden md:grid md:grid-cols-12 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-semibold text-xs uppercase tracking-wider flex-shrink-0"
            style={{
              background: "#FCFDFC",
              borderBottom: "1px solid #EEF5EE",
              color: "#5BC48B",
              letterSpacing: "0.64px",
            }}
          >
            <div className="md:col-span-5">Nome do Comerciante</div>
            <div className="md:col-span-2 text-center">Status</div>
            <div className="md:col-span-3 text-right">Total do Mês</div>
            <div className="md:col-span-2 text-center">Ação</div>
          </div>

          {/* Linhas */}
          <div className="divide-y" style={{ borderColor: "#F0F5F0" }}>
            {isLoading ? (
              <div className="px-3 sm:px-4 lg:px-8 py-6 flex justify-center">
                <div className="text-[#8AAA8D] text-sm">
                  Carregando dados...
                </div>
              </div>
            ) : paginatedGroups.length === 0 ? (
              <div className="px-3 sm:px-4 lg:px-8 py-6 flex justify-center">
                <div className="text-[#8AAA8D] text-sm">
                  Nenhum pagamento encontrado
                </div>
              </div>
            ) : (
              paginatedGroups.map((group) => {
                const isPendente = group.repasses.some(
                  (r) => r.status === "PENDENTE",
                );
                const status = isPendente ? "PENDENTE" : "PAGO";

                return (
                  <div
                    key={group.comerciante.id}
                    onClick={() => setSelected(group)}
                    className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4 grid grid-cols-1 md:grid-cols-12 md:items-center gap-2 sm:gap-3 md:gap-0 cursor-pointer transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(91, 196, 139, 0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Nome */}
                    <div className="md:col-span-5 flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                        style={{ background: "#5BC48B" }}
                      >
                        {getInitials(group.comerciante.nome)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-[#1A3D1F] text-sm sm:text-base truncate block">
                          {group.comerciante.nome}
                        </span>
                        <span className="text-[0.65rem] text-[#8AAA8D]">
                          {group.repasses.length} produto
                          {group.repasses.length !== 1 ? "s" : ""} · clique para
                          ver detalhes
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2 md:text-center">
                      <span
                        className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                        style={{
                          background:
                            status === "PENDENTE" ? "#FFF3CD" : "#D4EDDA",
                          color: status === "PENDENTE" ? "#856404" : "#155724",
                          border:
                            status === "PENDENTE"
                              ? "1px solid #FFEEBA"
                              : "1px solid #C3E6CB",
                        }}
                      >
                        {status === "PENDENTE" ? "Pendente" : "Pago"}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="md:col-span-3 md:text-right">
                      <span
                        className="text-xs sm:text-base font-bold"
                        style={{
                          color: status === "PENDENTE" ? "#1A3D1F" : "#4B5563",
                        }}
                      >
                        {formatarMoeda(group.totalBruto)}
                      </span>
                    </div>

                    {/* Ação */}
                    <div
                      className="md:col-span-2 md:text-center flex justify-end md:justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          if (isPendente) {
                            router.push(
                              `/pagamentos/repasses/${group.comerciante.id}`,
                            );
                          }
                        }}
                        disabled={!isPendente}
                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 disabled:cursor-not-allowed"
                        style={{
                          background: isPendente ? "#5BC48B" : "#F3F4F6",
                          boxShadow: isPendente
                            ? "0px 1px 2px rgba(0, 0, 0, 0.05)"
                            : "none",
                          border: !isPendente ? "1px solid #E5E7EB" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (isPendente)
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "#4ab07a";
                        }}
                        onMouseLeave={(e) => {
                          if (isPendente)
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "#5BC48B";
                        }}
                      >
                        {isPendente ? (
                          <ChevronRight size={16} style={{ color: "white" }} />
                        ) : (
                          <Check size={16} style={{ color: "#9CA3AF" }} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4 gap-3 sm:gap-4 flex-shrink-0"
            style={{
              background: "#FCFDFC",
              borderTop: "1px solid #EEF5EE",
            }}
          >
            <span className="text-xs sm:text-sm text-[#8AAA8D] text-center sm:text-left">
              Mostrando {paginatedGroups.length} de {groups.length} comerciantes
            </span>
            <div className="flex gap-2">
              <button
                disabled
                className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium text-[#8AAA8D] border transition-all disabled:opacity-50"
                style={{ borderColor: "#DAEEDA", background: "white" }}
              >
                Anterior
              </button>
              <button
                disabled
                className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium text-[#8AAA8D] border transition-all disabled:opacity-50"
                style={{ borderColor: "#DAEEDA", background: "white" }}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de produtos */}
      {selected && (
        <ProdutosModal
          group={selected}
          onClose={() => setSelected(null)}
          onPagar={(id) => router.push(`/pagamentos/repasses/${id}`)}
        />
      )}
    </>
  );
}

function ProdutosModal({
  group,
  onClose,
  onPagar,
}: {
  group: ComercianteGroup;
  onClose: () => void;
  onPagar: (comercianteId: string) => void;
}) {
  const isPendente = group.repasses.some((r) => r.status === "PENDENTE");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEF5EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5BC48B] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              {getInitials(group.comerciante.nome)}
            </div>
            <div>
              <h2 className="text-[#1A3D1F] font-bold text-base leading-tight">
                {group.comerciante.nome}
              </h2>
              <p className="text-[#8AAA8D] text-xs">
                {group.repasses.length} produto
                {group.repasses.length !== 1 ? "s" : ""} vendido
                {group.repasses.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPendente ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E6] border border-[#FFE082]">
                <Clock size={12} className="text-[#B38600]" />
                <span className="text-[0.68rem] font-bold text-[#B38600] uppercase tracking-wide">
                  Pendente
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#C2E5CC]">
                <CheckCircle2 size={12} className="text-[#1B6112]" />
                <span className="text-[0.68rem] font-bold text-[#1B6112] uppercase tracking-wide">
                  Pago
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
        <div className="overflow-y-auto max-h-[50vh]">
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
                  Valor
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EEF5EE] bg-[#f6faf4] flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
              Total a receber
            </p>
            <p className="font-bold text-[#2d7a1f] text-xl">
              {formatarMoeda(group.totalBruto)}
            </p>
          </div>
          {isPendente && (
            <button
              onClick={() => onPagar(group.comerciante.id)}
              className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
              style={{ background: "#5BC48B" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#4ab07a")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#5BC48B")
              }
            >
              Realizar Pagamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
