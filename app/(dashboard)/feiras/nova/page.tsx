"use client";

import { useRouter } from "next/navigation";
import { Calendar, Users, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { TransferList } from "@/features/feiras/components/TransferList";
import { useCadastrarFeira } from "@/features/feiras/hooks/useCadastrarFeira";

export default function CadastrarFeiraPage() {
  const router = useRouter();
  const {
    dataFeira,
    setDataFeira,
    comerciantes,
    itens,
    toggleSel,
    loadingData,
    submitting,
    erro,
    handleConfirmar,
  } = useCadastrarFeira();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto flex flex-col gap-6">
        <PageHeader
          title="Cadastrar Feira"
          subtitle="Preencha as informações para cadastrar uma nova feira"
          backHref="/dashboard"
        />

        {erro && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
            {erro}
          </div>
        )}

        {/* Card data/hora */}
        <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
              <Calendar size={17} className="text-white" />
            </div>
            <div>
              <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
                Data da Feira
              </h3>
              <p className="text-[#8aaa8d] text-xs">
                Selecione a data e horário de realização
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label
                htmlFor="dataFeira"
                className="text-[#1a3d1f] text-xs font-semibold tracking-wider uppercase px-1"
              >
                Data e Horário
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#5bc48b]">
                  <Calendar size={16} />
                </span>
                <input
                  id="dataFeira"
                  type="datetime-local"
                  value={dataFeira}
                  onChange={(e) => setDataFeira(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#d4e8d6] outline-none transition-all duration-200 bg-white text-[#1a3d1f] shadow-sm focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b1a] text-[0.92rem]"
                />
              </div>
            </div>

            {dataFeira && (
              <div className="flex flex-col items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-br from-[#5bc48b12] to-[#5bc48b1f] border border-[#5bc48b4d] min-w-[200px]">
                <p className="text-[#5bc48b] text-[0.68rem] font-semibold tracking-widest uppercase">
                  Agendado para
                </p>
                <p className="text-[#1a3d1f] mt-1 font-bold text-base">
                  {new Date(dataFeira).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[#5a7a5e] text-[0.82rem] font-medium uppercase tracking-wide">
                  {new Date(dataFeira).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comerciantes */}
        <TransferList
          icon={Users}
          title="Comerciantes Elegíveis"
          leftLabel="Removidos"
          rightLabel="Adicionados"
          leftItems={comerciantes.left.map((c) => ({
            id: c.id,
            label: c.nome,
          }))}
          rightItems={comerciantes.right.map((c) => ({
            id: c.id,
            label: c.nome,
          }))}
          leftSelected={comerciantes.leftSel}
          rightSelected={comerciantes.rightSel}
          onLeftSelect={(id) =>
            toggleSel(id, comerciantes.leftSel, comerciantes.setLeftSel)
          }
          onRightSelect={(id) =>
            toggleSel(id, comerciantes.rightSel, comerciantes.setRightSel)
          }
          onMoveToLeft={comerciantes.toLeft}
          onMoveToRight={comerciantes.toRight}
          onMoveAllToLeft={comerciantes.allToLeft}
          onMoveAllToRight={comerciantes.allToRight}
          loading={loadingData}
        />

        {/* Itens */}
        <TransferList
          icon={Package}
          title="Itens Elegíveis"
          leftLabel="Removidos"
          rightLabel="Adicionados"
          leftItems={itens.left.map((i) => ({
            id: i.id,
            label: `${i.nome} (${i.unidadeMedida})`,
          }))}
          rightItems={itens.right.map((i) => ({
            id: i.id,
            label: `${i.nome} (${i.unidadeMedida})`,
          }))}
          leftSelected={itens.leftSel}
          rightSelected={itens.rightSel}
          onLeftSelect={(id) => toggleSel(id, itens.leftSel, itens.setLeftSel)}
          onRightSelect={(id) =>
            toggleSel(id, itens.rightSel, itens.setRightSel)
          }
          onMoveToLeft={itens.toLeft}
          onMoveToRight={itens.toRight}
          onMoveAllToLeft={itens.allToLeft}
          onMoveAllToRight={itens.allToRight}
          loading={loadingData}
        />

        {/* Botões */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} isLoading={submitting}>
            {submitting ? "Salvando..." : "Confirmar"}
          </Button>
        </div>
      </main>
    </div>
  );
}
