"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Search,
  Calendar,
} from "lucide-react";
import { useSelecionarFeiraEItens } from "../hooks/useSelecionarFeiraEItens";

export function SelecionarFeiraEItens() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const participanteId = searchParams.get("participante");
  const participanteTipo = searchParams.get("tipo");
  const participanteNome = searchParams.get("nome") || "João da Silva";

  const {
    feirasFiltradasPorPesquisa,
    selectedFeira,
    setSelectedFeira,
    searchTerm,
    setSearchTerm,
    itens,
    itensSelecionados,
    handleQuantidadeChange,
  } = useSelecionarFeiraEItens();

  const totalItens = itensSelecionados.length;

  const handleProximo = () => {
    if (itensSelecionados.length === 0) {
      alert("Selecione pelo menos um item");
      return;
    }
    if (!selectedFeira) {
      alert("Selecione uma feira");
      return;
    }
    // Passar dados para próxima etapa
    const itensList = itensSelecionados
      .map((i) => `${i.id}:${i.quantidade}`)
      .join(",");
    const feiraNome = new Date(selectedFeira.dataHora).toLocaleDateString(
      "pt-BR",
    );
    const feiraNomeCompleto = `${feiraNome} - ${selectedFeira.local}`;
    router.push(
      `/pedidos/resumo?participante=${participanteId}&tipo=${participanteTipo}&itens=${itensList}&feira=${selectedFeira.id}&feiraNome=${encodeURIComponent(feiraNomeCompleto)}`,
    );
  };

  return (
    <div className="flex-1 px-4 sm:px-6 md:px-16 py-4 sm:py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header com título */}
      <div className="flex items-start gap-3 md:gap-4">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-lg bg-white border border-[#003d04]/10 shadow-sm flex items-center justify-center hover:bg-[#f0f5f0] transition-colors flex-shrink-0 mt-0.5"
        >
          <ArrowLeft size={16} className="text-[#003d04]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#003d04] to-[#1b6112] flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#1a3d1f]">
              Selecionar Feira
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#8aaa8d]">
            Escolha a feira para listar os produtos
          </p>
        </div>
      </div>

      {/* Barra de pesquisa de feiras */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8aaa8d]"
        />
        <input
          type="text"
          placeholder="Pesquisar feiras por data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#d4e8d6] rounded-2xl text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:ring-2 focus:ring-[#5bc48b] focus:ring-offset-2 focus:border-[#5bc48b]"
        />
      </div>

      {/* Lista de feiras */}
      {!selectedFeira ? (
        <div className="grid gap-3">
          {feirasFiltradasPorPesquisa.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#8aaa8d] font-semibold">
                Nenhuma feira encontrada
              </p>
            </div>
          ) : (
            feirasFiltradasPorPesquisa.map((feira) => (
              <button
                key={feira.id}
                onClick={() => setSelectedFeira(feira)}
                className="bg-white border-2 border-[#d4e8d6] rounded-2xl p-4 hover:border-[#5bc48b] hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-[#1a3d1f]">
                      {new Date(feira.dataHora).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-[#5bc48b] font-semibold">
                      {feira.local}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-[#8aaa8d]" />
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Card com informações selecionada */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#5bc48b]/15 to-[#5bc48b]/5 flex items-center justify-center">
                <Calendar size={24} className="text-[#5bc48b]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a3d1f] text-base">
                  {new Date(selectedFeira.dataHora).toLocaleDateString("pt-BR")}{" "}
                  - {selectedFeira.local}
                </h2>
                <p className="text-sm text-[#5bc48b] font-bold">
                  Participante: {participanteNome}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFeira(null)}
              className="bg-[#f0f5f0] text-[#5bc48b] px-4 py-2 rounded-lg font-semibold hover:bg-[#e0ebde] transition-colors text-sm"
            >
              Trocar Feira
            </button>
          </div>

          {/* Título produtos */}
          <div>
            <h2 className="text-lg font-bold text-[#1a3d1f] mb-3">
              Selecione os Produtos
            </h2>
          </div>

          {/* Grid de itens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {itens.length === 0 ? (
              <div className="col-span-full py-8 text-center">
                <p className="text-[#8aaa8d] font-semibold">
                  Nenhum produto disponível
                </p>
              </div>
            ) : (
              itens.map((item) => {
                const isAdicionado = item.quantidade > 0;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl transition-all ${
                      isAdicionado
                        ? "bg-white shadow-lg border border-[#5bc48b]"
                        : "bg-white shadow-sm border border-[#eef5ee]"
                    }`}
                  >
                    {/* Nome e unidade */}
                    <div className="mb-3">
                      <p className="font-bold text-[#1a3d1f] text-sm">
                        {item.nome}
                      </p>
                      <p className="text-xs text-[#8aaa8d]">
                        {item.unidadeMedida}
                      </p>
                    </div>

                    {/* Contador */}
                    <div className="bg-[#f6faf4] rounded-lg p-1 flex items-center justify-between mb-3">
                      <button
                        onClick={() => handleQuantidadeChange(item.id, -1)}
                        className="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm hover:bg-[#f0f5f0] transition-colors text-[#5bc48b]"
                      >
                        −
                      </button>
                      <span className="font-bold text-[#1a3d1f] text-sm w-8 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => handleQuantidadeChange(item.id, 1)}
                        className="w-7 h-7 bg-[#5bc48b] rounded-md flex items-center justify-center text-white hover:bg-[#4aa86f] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Botão Adicionar/Adicionado */}
                    <button
                      onClick={() =>
                        handleQuantidadeChange(
                          item.id,
                          isAdicionado ? -item.quantidade : 1,
                        )
                      }
                      className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                        isAdicionado
                          ? "bg-gradient-to-r from-[#003d04] to-[#1b6112] text-white flex items-center justify-center gap-1"
                          : "bg-[#5bc48b]/10 text-[#2d7a1f] hover:bg-[#5bc48b]/15"
                      }`}
                    >
                      {isAdicionado ? (
                        <>
                          <CheckCircle2 size={14} />
                          Adicionado
                        </>
                      ) : (
                        "Adicionar"
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col-reverse sm:flex-row-reverse sm:justify-start gap-3 pt-4">
            <button
              onClick={handleProximo}
              disabled={totalItens === 0}
              className="h-12 px-8 bg-gradient-to-r from-[#003d04] to-[#1b6112] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <span>Próximo</span>
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => router.back()}
              className="h-12 px-8 bg-white border border-[#d4e8d6] text-[#1a3d1f] font-bold rounded-2xl hover:bg-[#f9fdf8] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
