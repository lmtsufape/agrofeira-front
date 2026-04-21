"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { pagamentosService } from "../api/pagamentos.service";
import { RepasseDTO } from "../api/types";
import { ComercianteDTO } from "@/features/comerciantes/api/types";

export function RepasseDetalhes() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [comerciante, setComerciante] = useState<ComercianteDTO | null>(null);
  const [repasse, setRepasse] = useState<RepasseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Carrega dados ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Carregando detalhes do pagamento para comerciante:", id);
        const dados = await pagamentosService.obterPagamentoDetalhes(id);
        setComerciante(dados.comerciante);
        setRepasse(dados.repasse);
        console.log("Dados carregados com sucesso:", dados);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar dados";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleConfirmar = async () => {
    setIsConfirming(true);
    setError(null);
    try {
      console.log("Iniciando confirmação de pagamento para:", id);
      await pagamentosService.confirmarPagamento(id);
      setSuccess(true);
      console.log("Pagamento confirmado com sucesso");

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        router.push("/pagamentos/repasses");
      }, 1500);
    } catch (err) {
      console.error("Erro ao confirmar pagamento:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao confirmar pagamento. Tente novamente.";
      setError(errorMessage);
      setIsConfirming(false);
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
      {/* Título */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3 sm:gap-5">
          <button
            onClick={handleCancelar}
            className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-xl transition-all flex-shrink-0 hover:bg-gray-100"
            style={{
              background: "white",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #DAEEDA",
            }}
          >
            <ArrowLeft size={20} style={{ color: "#1B6112" }} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3D1F]">
              Detalhes do Pagamento
            </h1>
            <p className="text-xs sm:text-base text-[#8AAA8D] mt-1 sm:mt-2">
              Verifique as informações do comerciante antes de confirmar.
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {success && (
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-3 text-sm sm:text-base"
          style={{
            background: "#D4EDDA",
            border: "1px solid #C3E6CB",
            color: "#155724",
          }}
        >
          <Check size={18} className="flex-shrink-0" />
          <span className="font-medium">Pagamento confirmado com sucesso!</span>
        </div>
      )}

      {/* Mensagem de Erro Geral */}
      {error && !isLoading && (
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-3 text-sm sm:text-base"
          style={{
            background: "#F8D7DA",
            border: "1px solid #F5C6CB",
            color: "#721C24",
          }}
        >
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Estado de Carregamento */}
      {isLoading && (
        <div
          className="px-4 sm:px-6 py-6 sm:py-8 rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-3"
          style={{
            background: "white",
            border: "1px solid #EEF5EE",
            minHeight: "300px",
          }}
        >
          <div className="w-8 h-8 border-4 border-[#5BC48B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8AAA8D] text-sm">
            Carregando detalhes do pagamento...
          </p>
        </div>
      )}

      {/* Card Principal - Visível quando não está carregando */}
      {!isLoading && comerciante && repasse && (
        <div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8"
          style={{
            background: "white",
            boxShadow: "0px 10px 40px rgba(0, 61, 4, 0.05)",
            border: "1px solid #EEF5EE",
          }}
        >
          {/* Seção de Informações do Comerciante */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Cabeçalho com Comerciante */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className="w-14 sm:w-16 h-14 sm:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#E8F5EC",
                  border: "1px solid #C2E5CC",
                }}
              >
                <div className="text-2xl">🛒</div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase font-bold text-[#8AAA8D] tracking-wider">
                  Nome do Comerciante
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A3D1F] mt-1">
                  {comerciante.nome}
                </h2>
              </div>
            </div>

            {/* Info Box - Telefone e Email (Ajustado para o DTO real) */}
            <div
              className="p-5 sm:p-6 rounded-lg sm:rounded-2xl flex flex-col gap-4 sm:gap-6"
              style={{
                background: "#FCFDFC",
                border: "1px solid #F0F5F0",
              }}
            >
              {/* Telefone */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: "#8AAA8D" }}
                  />
                  <span className="text-xs uppercase font-bold text-[#8AAA8D] tracking-wider">
                    Telefone
                  </span>
                </div>
                <p className="text-base sm:text-lg text-[#4B5563] font-medium">
                  {comerciante.telefone}
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: "#8AAA8D" }}
                  />
                  <span className="text-xs uppercase font-bold text-[#8AAA8D] tracking-wider">
                    Email
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#4B5563] font-medium">
                  {comerciante.email}
                </p>
              </div>
            </div>

            {/* Total Card */}
            <div
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden flex flex-col items-center justify-center gap-3 sm:gap-4"
              style={{
                background: "linear-gradient(161deg, #F6FAF4 0%, #E8F5EC 100%)",
                border: "1px solid #C2E5CC",
              }}
            >
              {/* Decoração de fundo */}
              <div
                className="absolute opacity-10"
                style={{
                  width: "160px",
                  height: "160px",
                  right: "-40px",
                  bottom: "-40px",
                }}
              >
                <div
                  className="absolute"
                  style={{
                    width: "133px",
                    height: "133px",
                    border: "13px solid #5BC48B",
                    borderRadius: "50%",
                    right: "20px",
                    bottom: "20px",
                  }}
                />
              </div>

              {/* Label */}
              <div
                className="px-3 py-1.5 rounded-full text-xs font-bold text-[#1B6112] uppercase tracking-wider"
                style={{
                  background: "white",
                  border: "1px solid #C2E5CC",
                }}
              >
                Total a Pagar (Mês)
              </div>

              {/* Valor */}
              <div className="flex items-baseline gap-2 relative z-10">
                <span
                  className="font-black"
                  style={{
                    color: "#5BC48B",
                    fontSize: "32px",
                  }}
                >
                  R$
                </span>
                <span
                  className="font-black"
                  style={{
                    color: "#1A3D1F",
                    fontSize: "56px",
                  }}
                >
                  {repasse.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mt-2 relative z-10">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      repasse.status === "PENDENTE" ? "#EAB308" : "#22C55E",
                  }}
                />
                <span
                  className="text-sm sm:text-base font-semibold"
                  style={{
                    color:
                      repasse.status === "PENDENTE" ? "#856404" : "#15803D",
                  }}
                >
                  Status: {repasse.status === "PENDENTE" ? "Pendente" : "Pago"}
                </span>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div style={{ height: "1px", background: "#F0F5F0" }} />

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <button
              onClick={handleCancelar}
              disabled={isConfirming || success}
              className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-[#8AAA8D] transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "1px solid #DAEEDA",
                background: "white",
              }}
              onMouseEnter={(e) => {
                if (!isConfirming && !success) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#F9FAFB";
                }
              }}
              onMouseLeave={(e) => {
                if (!isConfirming && !success) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "white";
                }
              }}
            >
              Cancelar Operação
            </button>

            <button
              onClick={handleConfirmar}
              disabled={isConfirming || success || repasse.status === "PAGO"}
              className="px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:cursor-not-allowed"
              style={{
                background: success
                  ? "#22C55E"
                  : isConfirming
                    ? "#8AAA8D"
                    : "#5BC48B",
                boxShadow:
                  success || isConfirming
                    ? "none"
                    : "0px 4px 15px rgba(91, 196, 139, 0.40)",
              }}
              onMouseEnter={(e) => {
                if (!isConfirming && !success && repasse.status !== "PAGO") {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#4ab07a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isConfirming && !success && repasse.status !== "PAGO") {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#5BC48B";
                }
              }}
            >
              {success ? (
                <>
                  <Check size={18} />
                  Pagamento Confirmado
                </>
              ) : isConfirming ? (
                <>
                  <div className="animate-spin">
                    <Check size={18} />
                  </div>
                  Processando...
                </>
              ) : repasse.status === "PAGO" ? (
                <>
                  <Check size={18} />
                  Já Foi Pago
                </>
              ) : (
                <>
                  <Check size={18} />
                  Confirmar Pagamento
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
