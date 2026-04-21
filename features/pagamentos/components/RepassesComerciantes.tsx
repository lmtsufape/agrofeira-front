"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  RefreshCw,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { pagamentosService } from "../api/pagamentos.service";
import { RepasseComercianteDTO } from "../api/types";

export function RepassesComerciantes() {
  const router = useRouter();
  const [repasses, setRepasses] = useState<RepasseComercianteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8;

  // Carrega dados ao montar o componente
  useEffect(() => {
    const carregarRepasses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Carregando lista de repasses...");
        const mesAtual = new Date().getMonth() + 1;
        const anoAtual = new Date().getFullYear();
        const dados = await pagamentosService.listarRepasses(
          mesAtual,
          anoAtual,
        );
        setRepasses(dados);
        console.log("Repasses carregados:", dados);
      } catch (err) {
        console.error("Erro ao carregar repasses:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar dados";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    carregarRepasses();
  }, []);

  const handleAtualizar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mesAtual = new Date().getMonth() + 1;
      const anoAtual = new Date().getFullYear();
      const dados = await pagamentosService.listarRepasses(mesAtual, anoAtual);
      setRepasses(dados);
    } catch (err) {
      console.error("Erro ao atualizar repasses:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar dados";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = repasses.length;
  const paginatedItems = repasses.slice(0, itemsPerPage);

  return (
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

      {/* Mensagem de Erro */}
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
          onClick={handleAtualizar}
          disabled={isLoading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
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
        {/* Header da Tabela */}
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

        {/* Linhas da Tabela */}
        <div
          className="divide-y overflow-y-auto"
          style={{ borderColor: "#F0F5F0" }}
        >
          {isLoading ? (
            <div className="px-3 sm:px-4 lg:px-8 py-6 flex justify-center">
              <div className="text-[#8AAA8D] text-sm">Carregando dados...</div>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="px-3 sm:px-4 lg:px-8 py-6 flex justify-center">
              <div className="text-[#8AAA8D] text-sm">
                Nenhum pagamento encontrado
              </div>
            </div>
          ) : (
            paginatedItems.map((repasse) => (
              <div
                key={repasse.id}
                className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4 grid grid-cols-1 md:grid-cols-12 md:items-center gap-2 sm:gap-3 md:gap-0"
              >
                {/* Nome */}
                <div className="md:col-span-5 flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#E8F5EC",
                      border: "1px solid #C2E5CC",
                    }}
                  >
                    <FileText size={16} style={{ color: "#5BC48B" }} />
                  </div>
                  <span className="font-semibold text-[#1A3D1F] text-sm sm:text-base truncate">
                    {repasse.commercianteName}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-2 md:text-center">
                  <span
                    className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{
                      background:
                        repasse.status === "PENDENTE" ? "#FFF3CD" : "#D4EDDA",
                      color:
                        repasse.status === "PENDENTE" ? "#856404" : "#155724",
                      border:
                        repasse.status === "PENDENTE"
                          ? "1px solid #FFEEBA"
                          : "1px solid #C3E6CB",
                    }}
                  >
                    {repasse.status === "PENDENTE" ? "Pendente" : "Pago"}
                  </span>
                </div>

                {/* Total do Mês */}
                <div className="md:col-span-3 md:text-right">
                  <span
                    className="text-xs sm:text-base font-bold"
                    style={{
                      color:
                        repasse.status === "PENDENTE" ? "#1A3D1F" : "#4B5563",
                    }}
                  >
                    R${" "}
                    {repasse.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Ação */}
                <div className="md:col-span-2 md:text-center flex justify-end md:justify-center">
                  <button
                    onClick={() => {
                      if (repasse.status === "PENDENTE") {
                        router.push(
                          `/pagamentos/repasses/${repasse.comercianteId}`,
                        );
                      }
                    }}
                    disabled={repasse.status === "PAGO"}
                    className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 disabled:cursor-not-allowed"
                    style={{
                      background:
                        repasse.status === "PENDENTE" ? "#5BC48B" : "#F3F4F6",
                      boxShadow:
                        repasse.status === "PENDENTE"
                          ? "0px 1px 2px rgba(0, 0, 0, 0.05)"
                          : "none",
                      border:
                        repasse.status === "PAGO"
                          ? "1px solid #E5E7EB"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (repasse.status === "PENDENTE") {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#4ab07a";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (repasse.status === "PENDENTE") {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#5BC48B";
                      }
                    }}
                  >
                    {repasse.status === "PENDENTE" ? (
                      <ChevronRight size={16} style={{ color: "white" }} />
                    ) : (
                      <Check size={16} style={{ color: "#9CA3AF" }} />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer da Tabela */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4 gap-3 sm:gap-4 flex-shrink-0"
          style={{
            background: "#FCFDFC",
            borderTop: "1px solid #EEF5EE",
          }}
        >
          <span className="text-xs sm:text-sm text-[#8AAA8D] text-center sm:text-left">
            Mostrando {itemsPerPage} de {totalItems} comerciantes
          </span>

          {/* Paginação */}
          <div className="flex gap-2">
            <button
              disabled
              className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium text-[#8AAA8D] border transition-all disabled:opacity-50"
              style={{
                borderColor: "#DAEEDA",
                background: "white",
              }}
            >
              Anterior
            </button>
            <button
              disabled
              className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium text-[#8AAA8D] border transition-all disabled:opacity-50"
              style={{
                borderColor: "#DAEEDA",
                background: "white",
              }}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
