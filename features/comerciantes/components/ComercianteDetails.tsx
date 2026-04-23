"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Edit2,
  X,
} from "lucide-react";
import { useComerciante } from "../hooks/useComerciante";

interface ComercianteDetailsProps {
  comercianteId: string;
}

export function ComercianteDetails({ comercianteId }: ComercianteDetailsProps) {
  const router = useRouter();
  const {
    comerciante,
    allCategories,
    activeCategories,
    setActiveCategories,
    formData,
    loading,
    error,
    savingChanges,
    handleFormChange,
    saveChanges,
  } = useComerciante(comercianteId);

  const [selectedInactive, setSelectedInactive] = useState<string[]>([]);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const inactiveCategories = allCategories.filter(
    (cat) => !activeCategories.includes(cat.id),
  );
  const active = allCategories.filter((cat) =>
    activeCategories.includes(cat.id),
  );

  const handleAddSelected = () => {
    setActiveCategories([...activeCategories, ...selectedInactive]);
    setSelectedInactive([]);
  };

  const handleRemoveSelected = () => {
    setActiveCategories(
      activeCategories.filter((id) => !selectedActive.includes(id)),
    );
    setSelectedActive([]);
  };

  const toggleInactiveSelection = (categoryId: string) => {
    setSelectedInactive((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleActiveSelection = (categoryId: string) => {
    setSelectedActive((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      await saveChanges();
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar alterações");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 px-4 sm:px-6 md:px-16 py-8 flex items-center justify-center">
        <p className="text-[#8aaa8d]">Carregando dados...</p>
      </div>
    );
  }

  if (error || !comerciante) {
    return (
      <div className="flex-1 px-4 sm:px-6 md:px-16 py-8 flex items-center justify-center">
        <p className="text-red-500">{error || "Comerciante não encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6 md:px-16 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
      {/* Header com voltar e título */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => router.back()}
          className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-white border border-[#daeeda] shadow-sm flex items-center justify-center hover:bg-[#f0f5f0] transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} className="text-[#1b6112]" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a3d1f] truncate">
          Perfil e Autorizações
        </h1>
      </div>

      {/* Card do comerciante */}
      <div className="bg-white rounded-2xl border border-[#eef5ee] shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Info */}
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a3d1f]">
                {comerciante.nome}
              </h2>
              <div className="flex items-center gap-2 text-[#8aaa8d] text-sm mt-1 justify-center sm:justify-start">
                <Phone size={14} />
                {comerciante.telefone}
              </div>
            </div>
            <p className="text-sm text-[#4b5563] max-w-md">
              {comerciante.descricao}
            </p>
          </div>
        </div>

        {/* Botão editar */}
        <button
          onClick={handleOpenEditModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#f6faf4] border border-[#c2e5cc] rounded-xl hover:bg-[#eef5ee] transition-colors flex items-center justify-center sm:justify-start gap-2 text-[#1b6112] text-sm font-semibold flex-shrink-0"
        >
          <Edit2 size={16} />
          Editar Dados
        </button>
      </div>

      {/* Gestão de itens elegíveis */}
      <div className="bg-white rounded-2xl border border-[#eef5ee] shadow-lg p-4 sm:p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
            <h3 className="text-lg font-bold text-[#1a3d1f]">
              Gestão de Itens Elegíveis
            </h3>
          </div>
          <p className="text-sm text-[#8aaa8d] text-center sm:text-left">
            Selecione quais categorias de produtos este comerciante tem
            permissão para vender.
          </p>
        </div>

        {/* Painéis de categorias */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-96">
          {/* Removidos */}
          <div className="flex-1 bg-[#fcfdfc] rounded-xl border border-[#eef5ee] flex flex-col overflow-hidden">
            <div className="bg-[#f0f5f0] px-3 sm:px-4 py-3 border-b border-[#eef5ee]">
              <p className="text-sm font-semibold text-[#1a3d1f]">
                Removidos / Inativos
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {inactiveCategories.length > 0 ? (
                <div className="p-2 flex flex-col gap-1">
                  {inactiveCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedInactive.includes(cat.id)}
                        onChange={() => toggleInactiveSelection(cat.id)}
                        className="w-4 h-4 rounded border-gray-400 flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-sm text-[#4b5563] truncate">
                        {cat.nome}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-[#8aaa8d] text-center px-4">
                    Nenhum item removido.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-3 px-2 flex-shrink-0">
            <button
              onClick={handleAddSelected}
              disabled={selectedInactive.length === 0}
              className="w-10 h-10 rounded-full bg-[#f6faf4] border border-[#c2e5cc] flex items-center justify-center text-[#5bc48b] hover:bg-[#e8f5ec] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Adicionar selecionados"
            >
              <ChevronRight size={16} />
            </button>
            <div className="w-6 h-px bg-[#eef5ee]" />
            <button
              onClick={handleRemoveSelected}
              disabled={selectedActive.length === 0}
              className="w-10 h-10 rounded-full bg-[#f6faf4] border border-[#c2e5cc] flex items-center justify-center text-[#5bc48b] hover:bg-[#e8f5ec] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remover selecionados"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Botões de ação mobile */}
          <div className="lg:hidden flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleAddSelected}
                disabled={selectedInactive.length === 0}
                className="flex-1 px-4 py-2 bg-[#5bc48b] text-white rounded-lg font-semibold text-sm hover:bg-[#4aa86f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar ({selectedInactive.length})
              </button>
              <button
                onClick={handleRemoveSelected}
                disabled={selectedActive.length === 0}
                className="flex-1 px-4 py-2 bg-[#e8f5ec] border border-[#c2e5cc] text-[#5bc48b] rounded-lg font-semibold text-sm hover:bg-[#d0e8dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remover ({selectedActive.length})
              </button>
            </div>
          </div>

          {/* Adicionados */}
          <div className="flex-1 bg-[#fcfdfc] rounded-xl border border-[#c2e5cc] flex flex-col overflow-hidden">
            <div className="bg-[#e8f5ec] px-3 sm:px-4 py-3 border-b border-[#c2e5cc] flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#1b6112] truncate">
                Adicionados / Ativos
              </p>
              <span className="text-xs font-bold text-[#5bc48b] bg-white px-2 py-1 rounded-full flex-shrink-0">
                {active.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 flex flex-col gap-1">
                {active.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f0f5f0]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedActive.includes(cat.id)}
                      onChange={() => toggleActiveSelection(cat.id)}
                      className="w-4 h-4 rounded border-gray-400 flex-shrink-0 cursor-pointer"
                    />
                    <span className="text-sm text-[#4b5563] font-medium truncate">
                      {cat.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-end gap-3 sm:gap-4 pt-4">
        <button
          onClick={() => router.back()}
          className="w-full sm:w-auto px-8 py-3 rounded-xl text-[#6b7280] text-base font-semibold hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={async () => {
            try {
              await saveChanges();
              router.back();
            } catch (err) {
              alert(
                err instanceof Error
                  ? err.message
                  : "Erro ao salvar alterações",
              );
            }
          }}
          disabled={savingChanges}
          className="w-full sm:w-auto px-8 sm:px-10 py-3 bg-[#5bc48b] rounded-xl text-white text-base font-bold hover:bg-[#4aa86f] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 size={20} />
          <span className="hidden sm:inline">
            {savingChanges ? "Salvando..." : "Confirmar Alterações"}
          </span>
          <span className="sm:hidden">
            {savingChanges ? "Salvando..." : "Confirmar"}
          </span>
        </button>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#eef5ee] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#003d04]/10 flex items-center justify-center">
                  <Edit2 size={16} className="text-[#003d04]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a3d1f]">
                    Editar Comerciante
                  </h2>
                  <p className="text-xs text-[#8aaa8d]">
                    Atualize as informações do comerciante
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-[#8aaa8d]" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-[#eef5ee]">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#003d04]/7 to-[#5bc48b]/12 rounded flex items-center justify-center">
                    <span className="text-xs text-[#5bc48b]">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1a3d1f]">
                    Dados Pessoais
                  </h3>
                </div>

                {/* Campo Nome */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-nome"
                    className="text-xs font-bold text-[#5bc48b] uppercase tracking-wide"
                  >
                    Nome <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="edit-nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleFormChange("nome", e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-3 bg-[#f6faf4] border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                  />
                </div>

                {/* Campo Telefone */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-telefone"
                    className="text-xs font-bold text-[#5bc48b] uppercase tracking-wide"
                  >
                    Telefone <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="edit-telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) =>
                      handleFormChange("telefone", e.target.value)
                    }
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 bg-[#f6faf4] border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                  />
                </div>

                {/* Campo Descrição */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-descricao"
                    className="text-xs font-bold text-[#5bc48b] uppercase tracking-wide"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="edit-descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      handleFormChange("descricao", e.target.value)
                    }
                    placeholder="Detalhes sobre os produtos, localização..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f6faf4] border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#eef5ee] p-6 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseEditModal}
                disabled={savingChanges}
                className="px-6 py-2.5 bg-[#f0faf3] border border-[#daeeda] rounded-lg text-[#2d7a1f] text-sm font-bold hover:bg-[#eef5ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={savingChanges}
                className="px-8 py-2.5 bg-[#003d04] rounded-lg text-white text-sm font-bold hover:bg-[#002803] transition-colors flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={16} />
                {savingChanges ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
