"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Users } from "lucide-react";
import { useSelecionarParticipante } from "../hooks/useSelecionarParticipante";

export function SelecionarParticipante() {
  const router = useRouter();
  const {
    filteredParticipantes,
    searchTerm,
    setSearchTerm,
    selectedParticipante,
    setSelectedParticipante,
    loading,
    error,
  } = useSelecionarParticipante();

  const handleProximo = () => {
    if (selectedParticipante) {
      router.push(
        `/pedidos/itens?participante=${selectedParticipante.id}&tipo=${selectedParticipante.tipo}&nome=${encodeURIComponent(selectedParticipante.nome)}`,
      );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 px-4 sm:px-6 md:px-16 py-4 sm:py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header com título */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-lg bg-white border border-[#003d04]/10 shadow-sm flex items-center justify-center hover:bg-[#f0f5f0] transition-colors flex-shrink-0 mt-0.5"
        >
          <ArrowLeft size={16} className="text-[#003d04]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#1a3d1f]">
              Selecionar Participante
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#8aaa8d]">
            Escolha o cliente ou comerciante para continuar a operação
          </p>
        </div>
      </div>

      {/* Card com lista */}
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col gap-6">
        {/* Seção de título */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#003d04] to-[#1b6112] flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1a3d1f]">
              Clientes e Comerciantes
            </h2>
            <p className="text-xs text-[#8aaa8d]">
              Selecione uma pessoa na lista abaixo
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#1a3d1f] uppercase tracking-wider">
            Nome do Cliente ou Comerciante
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar ou selecionar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#5bc48b] rounded-2xl text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:ring-2 focus:ring-[#5bc48b] focus:ring-offset-2"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5bc48b] pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.67"
              >
                <path d="M10 15L15 10" />
                <path d="M10 5L5 10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Lista de participantes */}
        <div className="bg-gradient-to-br from-[#f6faf4] to-[#edf5eb] rounded-2xl p-2 flex flex-col gap-1 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-[#8aaa8d]">Carregando participantes...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredParticipantes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-[#8aaa8d]">Nenhum participante encontrado</p>
            </div>
          ) : (
            filteredParticipantes.map((participante) => (
              <button
                key={`${participante.tipo}-${participante.id}`}
                onClick={() => setSelectedParticipante(participante)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  selectedParticipante?.id === participante.id
                    ? "bg-gradient-to-r from-[#003d04]/10 to-[#5bc48b]/20 outline outline-1 outline-[#5bc48b]/30"
                    : "bg-white hover:bg-[#fcfdfc]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    selectedParticipante?.id === participante.id
                      ? "bg-gradient-to-br from-[#003d04] to-[#1b6112] text-white"
                      : "bg-[#5bc48b]/15 text-[#5bc48b]"
                  }`}
                >
                  {getInitials(participante.nome)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p
                    className={`text-sm font-bold truncate ${
                      selectedParticipante?.id === participante.id
                        ? "text-[#003d04]"
                        : "text-[#1a3d1f]"
                    }`}
                  >
                    {participante.nome}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-4 sm:gap-4 pt-4">
        <button
          onClick={handleProximo}
          disabled={!selectedParticipante || loading}
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
    </div>
  );
}
