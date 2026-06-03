"use client";

import { Loader2, CheckCircle2, ArrowRight, Scale } from "lucide-react";
import { formatarData, formatarMoeda } from "@/utils/formatters";
import { useCadastrarRepasse } from "@/features/repasses/hooks/useCadastrarRepasse";
import { type ComercianteRateioDTO } from "@/features/feiras/api/types";

interface Props {
  onSuccess: () => void;
}

export function CadastrarRepasseForm({ onSuccess }: Props) {
  const {
    feirasEncerradas,
    feiraId,
    handleSelecionarFeira,
    rateio,
    loadingFeiras,
    loadingRateio,
    registrando,
    erro,
    isComercianteRegistrado,
    handleRegistrar,
  } = useCadastrarRepasse(onSuccess);

  return (
    <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
          <Scale size={17} className="text-white" />
        </div>
        <div>
          <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
            Cadastrar Repasse
          </h3>
          <p className="text-[#8aaa8d] text-xs">
            Confirme o repasse para cada feirante da feira encerrada
          </p>
        </div>
      </div>

      {erro && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {erro}
        </div>
      )}

      {/* Seletor de feira */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[#1a3d1f] text-xs font-semibold tracking-wider uppercase px-1">
          Feira Encerrada
        </label>
        {loadingFeiras ? (
          <div className="flex items-center gap-2 py-3 text-[#8aaa8d] text-sm">
            <Loader2 size={14} className="animate-spin" />
            Carregando feiras...
          </div>
        ) : feirasEncerradas.length === 0 ? (
          <p className="text-[#8aaa8d] text-sm py-2">
            Nenhuma feira encerrada encontrada.
          </p>
        ) : (
          <select
            value={feiraId}
            onChange={(e) => handleSelecionarFeira(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#d4e8d6] outline-none bg-white text-[#1a3d1f] shadow-sm focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b1a] text-[0.92rem] transition-all duration-200"
          >
            <option value="">Selecione uma feira...</option>
            {feirasEncerradas.map((f) => (
              <option key={f.id} value={f.id}>
                Feira de {formatarData(f.dataHora)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Rateio */}
      {loadingRateio && (
        <div className="flex items-center justify-center py-8 gap-2 text-[#8aaa8d]">
          <Loader2 size={18} className="animate-spin text-[#5bc48b]" />
          <span className="text-sm">Carregando rateio...</span>
        </div>
      )}

      {rateio && !loadingRateio && (
        <div className="flex flex-col gap-3">
          {rateio.comerciantes.length === 0 && (
            <p className="text-[#8aaa8d] text-sm text-center py-4">
              Nenhum resultado de rateio para esta feira.
            </p>
          )}

          {rateio.comerciantes.map((item) => (
            <ComercianteRepasseCard
              key={item.comerciante.id}
              item={item}
              registrado={isComercianteRegistrado(item)}
              registrando={registrando === item.comerciante.id}
              onRegistrar={() => handleRegistrar(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  item: ComercianteRateioDTO;
  registrado: boolean;
  registrando: boolean;
  onRegistrar: () => void;
}

function ComercianteRepasseCard({
  item,
  registrado,
  registrando,
  onRegistrar,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors ${
        registrado
          ? "bg-[#f6faf4] border-[#c2e5cc]"
          : "bg-white border-[#e8f0e9]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[#1a3d1f] font-semibold truncate">
          {item.comerciante.nome}
        </p>
        <p className="text-[#8aaa8d] text-xs mt-0.5">
          {item.produtos.length} produto{item.produtos.length !== 1 ? "s" : ""}{" "}
          ·{" "}
          <span className="font-semibold text-[#2d7a1f]">
            {formatarMoeda(item.totalBrutoVenda)}
          </span>
        </p>

        {/* Detalhes dos produtos */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5">
          {item.produtos.map((p) => (
            <span key={p.id} className="text-[0.7rem] text-[#8aaa8d]">
              {p.produto.nome}: {formatarMoeda(p.valorBrutoVenda)}
            </span>
          ))}
        </div>
      </div>

      {registrado ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5EC] border border-[#C2E5CC] shrink-0">
          <CheckCircle2 size={13} className="text-[#1B6112]" />
          <span className="text-[0.7rem] font-bold text-[#1B6112] uppercase tracking-wide">
            Pago
          </span>
        </div>
      ) : (
        <button
          onClick={onRegistrar}
          disabled={registrando}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#003d04] to-[#1b6112] text-white text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 transition-all shrink-0"
        >
          {registrando ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowRight size={14} />
          )}
          {registrando ? "Registrando..." : "Confirmar Repasse"}
        </button>
      )}
    </div>
  );
}
