"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, Scale, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useRateioFeira } from "@/features/feiras/hooks/useRateioFeira";
import { formatarMoeda } from "@/utils/formatters";

function RateioContent() {
  const searchParams = useSearchParams();
  const feiraId = searchParams.get("feiraId");

  const { rateio, loading, erro } = useRateioFeira(feiraId);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5bc48b]" />
      </div>
    );
  }

  if (erro || !rateio) {
    return (
      <main className="flex-1 px-4 md:px-6 py-8 max-w-5xl w-full mx-auto">
        <PageHeader
          title="Resultado do Rateio"
          backHref={`/feiras/detalhamento${feiraId ? `?feiraId=${feiraId}` : ""}`}
        />
        <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-red-700 font-medium">
            {erro ?? "Selecione uma feira para visualizar o rateio."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 md:px-6 py-8 max-w-5xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Resultado do Rateio"
        subtitle="Distribuição de vendas entre os feirantes após o encerramento"
        backHref={`/feiras/detalhamento${feiraId ? `?feiraId=${feiraId}` : ""}`}
      />

      {/* Totais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#EEF5EE] shadow-[0_2px_10px_rgba(0,61,4,0.04)] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#003d0415]">
            <Users size={20} className="text-[#003d04]" />
          </div>
          <div>
            <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-0.5">
              Feirantes
            </p>
            <p className="text-xl font-bold text-[#1A3D1F]">
              {rateio.totalComerciantes}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#EEF5EE] shadow-[0_2px_10px_rgba(0,61,4,0.04)] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#3d942815]">
            <TrendingUp size={20} className="text-[#3d9428]" />
          </div>
          <div>
            <p className="text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-0.5">
              Total Rateado
            </p>
            <p className="text-xl font-bold text-[#1A3D1F]">
              {formatarMoeda(rateio.totalRateado)}
            </p>
          </div>
        </div>
      </div>

      {/* Sem dados */}
      {rateio.comerciantes.length === 0 && (
        <div className="flex items-center gap-3 p-5 bg-[#f6faf4] border border-[#c8deca] rounded-2xl">
          <Scale size={20} className="text-[#8AAA8D] shrink-0" />
          <p className="text-[#8AAA8D] text-sm">
            Nenhum resultado de rateio encontrado. O rateio é calculado
            automaticamente ao encerrar a feira.
          </p>
        </div>
      )}

      {/* Tabela por feirante */}
      {rateio.comerciantes.map((item) => (
        <section key={item.comerciante.id}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#1A3D1F]">
              {item.comerciante.nome}
            </p>
            <span className="text-xs font-semibold text-[#3d9428] bg-[#3d942815] px-3 py-1 rounded-full">
              {formatarMoeda(item.totalBrutoVenda)}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#EEF5EE] shadow-[0_2px_10px_rgba(0,61,4,0.04)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0F5F0]">
                  <th className="text-left px-5 py-3 text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
                    Produto
                  </th>
                  <th className="text-right px-5 py-3 text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
                    Qtd. Vendida
                  </th>
                  <th className="text-right px-5 py-3 text-[0.65rem] font-bold text-[#8AAA8D] uppercase tracking-widest">
                    Valor Bruto
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.produtos.map((produto, idx) => (
                  <tr
                    key={produto.id}
                    className={
                      idx < item.produtos.length - 1
                        ? "border-b border-[#F0F5F0]"
                        : ""
                    }
                  >
                    <td className="px-5 py-3 text-[#1A3D1F] font-medium">
                      {produto.produto.nome}
                      <span className="ml-2 text-[0.65rem] text-[#8AAA8D] uppercase">
                        {produto.produto.unidadeMedida}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-[#1A3D1F]">
                      {produto.quantidadeSequestrada}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-[#1A3D1F]">
                      {formatarMoeda(produto.valorBrutoVenda)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#EEF5EE] bg-[#f6faf4]">
                  <td
                    colSpan={2}
                    className="px-5 py-3 text-[0.68rem] font-bold text-[#8AAA8D] uppercase tracking-widest"
                  >
                    Total
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-[#1A3D1F]">
                    {formatarMoeda(item.totalBrutoVenda)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}

export default function RateioPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5bc48b]" />
          </div>
        }
      >
        <RateioContent />
      </Suspense>
    </div>
  );
}
