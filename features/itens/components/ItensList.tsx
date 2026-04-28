"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  ArrowLeft,
  X,
  CheckCircle2,
  Trash2,
  Package,
  DollarSign,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ItemDTO, ItemOpcaoDTO } from "../api/types";
import { useItens } from "../hooks/useItens";
import { itemService } from "../api/itens.service";
import { formatarMoeda } from "@/utils/formatters";

export function ItensList() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [opcoes, setOpcoes] = useState<{
    categorias: ItemOpcaoDTO[];
    unidadesMedida: ItemOpcaoDTO[];
  }>({
    categorias: [],
    unidadesMedida: [],
  });

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const data = await itemService.getOpcoes();
        setOpcoes(data);
      } catch (err) {
        console.error("Erro ao carregar opções", err);
      }
    };
    carregarOpcoes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { itens, pageData, isLoading, isError, mutate } = useItens({
    page,
    nome: debouncedSearch,
  });

  const totalPages = pageData?.totalPages || 0;
  const totalElements = pageData?.totalElements || 0;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemDTO | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    precoBase: "",
    unidadeMedida: "",
    categoria: "",
  });

  const handleOpenEditModal = (item: ItemDTO) => {
    setEditingItem(item);
    // Formata o preço vindo do banco (ponto) para o padrão brasileiro (vírgula)
    const precoFormatado = item.precoBase.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setFormData({
      nome: item.nome || "",
      precoBase: precoFormatado,
      unidadeMedida: item.unidadeMedida || "",
      categoria: item.categoria || "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
    setFormData({
      nome: "",
      precoBase: "",
      unidadeMedida: "",
      categoria: "",
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value) {
      const numericValue = (parseInt(value, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      handleFormChange("precoBase", numericValue);
    } else {
      handleFormChange("precoBase", "");
    }
  };

  const handleSaveChanges = async () => {
    if (!editingItem) return;
    try {
      const numericPrice = parseFloat(
        formData.precoBase.replace(".", "").replace(",", "."),
      );

      await itemService.update(editingItem.id, {
        nome: formData.nome,
        unidadeMedida: formData.unidadeMedida,
        precoBase: numericPrice,
        categoria: formData.categoria,
      });
      mutate(); // Revalida a lista
      handleCloseEditModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar item");
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem) return;
    if (
      !window.confirm(`Tem certeza que deseja excluir "${editingItem.nome}"?`)
    )
      return;
    try {
      await itemService.delete(editingItem.id);
      mutate(); // Revalida a lista
      handleCloseEditModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao deletar item");
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div className="flex-1 px-4 sm:px-6 md:px-16 py-4 sm:py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header com título e busca */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">
        {/* Título */}
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg bg-white border border-[#003d04]/10 shadow-sm flex items-center justify-center hover:bg-[#f0f5f0] transition-colors flex-shrink-0 mt-0.5"
          >
            <ArrowLeft size={16} className="text-[#003d04]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-[#1a3d1f] truncate">
              Gerenciar Itens
            </h1>
            <p className="text-xs text-[#8aaa8d] line-clamp-2">
              Visualize, edite ou gerencie os itens cadastrados no sistema.
            </p>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9db89f]">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Buscar item..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-[#003d04]/6 shadow-sm overflow-hidden flex flex-col">
        {/* Header da tabela */}
        <div className="bg-[#fcfdfc] border-b border-[#eef5ee] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex-1 text-xs font-bold text-[#5bc48b] uppercase tracking-wider">
            Produto
          </div>
          <div className="hidden md:block w-32 text-xs font-bold text-[#5bc48b] uppercase tracking-wider">
            Categoria
          </div>
          <div className="w-24 text-xs font-bold text-[#5bc48b] uppercase tracking-wider text-right">
            Preço
          </div>
          <div className="w-24 text-xs font-bold text-[#5bc48b] uppercase tracking-wider text-right">
            Ações
          </div>
        </div>

        {/* Body da tabela */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-[#8aaa8d]">Carregando itens...</p>
            </div>
          ) : isError ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-red-500">Erro ao carregar itens</p>
            </div>
          ) : itens.length === 0 ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-[#8aaa8d]">Nenhum item encontrado</p>
            </div>
          ) : (
            itens.map((item, index) => (
              <div
                key={item.id}
                className={`px-6 py-4 flex items-center justify-between gap-4 ${
                  index !== itens.length - 1 ? "border-b border-[#f0f5f0]" : ""
                }`}
              >
                {/* Item Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#eef5ee] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#5bc48b]">
                      {item.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1a3d1f] truncate">
                      {item.nome}
                    </p>
                    <p className="text-[10px] text-[#8aaa8d] truncate md:hidden">
                      {item.categoria}
                    </p>
                  </div>
                </div>

                {/* Categoria (Desktop) */}
                <div className="hidden md:block w-32 flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e8f5ec] text-[#1b6112] border border-[#c2e5cc]">
                    {item.categoria}
                  </span>
                </div>

                {/* Preço */}
                <div className="w-24 text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#1a3d1f]">
                    {formatarMoeda(item.precoBase)}
                  </p>
                  <p className="text-[10px] text-[#8aaa8d]">
                    /{item.unidadeMedida.toLowerCase()}
                  </p>
                </div>

                {/* Ações */}
                <div className="w-24 flex justify-end flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="px-4 py-1.5 opacity-80 bg-[#e8f5ec] border border-[#c2e5cc] rounded-lg hover:opacity-100 transition-opacity flex items-center gap-1.5"
                  >
                    <Edit2 size={12} className="text-[#1b6112]" />
                    <span className="text-xs font-semibold text-[#1b6112]">
                      Editar
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Empty state fill */}
          {!isLoading && !isError && itens.length > 0 && (
            <div className="flex-1 bg-[#fcfdfc]" />
          )}
        </div>

        {/* Footer com paginação */}
        <div className="bg-[#fcfdfc] border-t border-[#eef5ee] px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-[#8aaa8d]">
            Página {page + 1} de {totalPages || 1} ({totalElements} itens no
            total)
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handlePrevPage}
              disabled={page === 0 || isLoading}
              className="w-8 h-8 rounded border border-[#daeeda] flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
            >
              <ChevronLeft size={16} className="text-[#1b6112]" />
            </button>

            <div className="px-3 py-1 rounded bg-[#eef5ee] text-xs font-semibold text-[#1b6112]">
              {page + 1}
            </div>

            <button
              onClick={handleNextPage}
              disabled={page >= totalPages - 1 || isLoading}
              className="w-8 h-8 rounded border border-[#daeeda] flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
            >
              <ChevronRight size={16} className="text-[#1b6112]" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditModal}
          role="presentation"
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title"
          >
            {/* Header com botão de fechar */}
            <div className="flex items-start justify-between mb-8">
              <h2
                id="modal-title"
                className="text-2xl font-bold text-[#1a3d1f]"
              >
                Editar Item
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f5f0] transition-colors text-[#8aaa8d] hover:text-[#1b6112]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome do Item */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-[#8aaa8d]" />
                    <label
                      htmlFor="edit-nome"
                      className="text-xs font-bold text-[#8aaa8d] uppercase tracking-wider"
                    >
                      Nome do Item
                    </label>
                  </div>
                  <input
                    id="edit-nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleFormChange("nome", e.target.value)}
                    placeholder="Ex: Banana"
                    className="w-full px-4 py-3 bg-[#fcfdfc] border border-[#c2e5cc] rounded-xl text-base font-semibold text-[#1a3d1f] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-[#8aaa8d]" />
                    <label
                      htmlFor="edit-categoria"
                      className="text-xs font-bold text-[#8aaa8d] uppercase tracking-wider"
                    >
                      Categoria
                    </label>
                  </div>
                  <select
                    id="edit-categoria"
                    value={formData.categoria}
                    onChange={(e) =>
                      handleFormChange("categoria", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#fcfdfc] border border-[#c2e5cc] rounded-xl text-base font-semibold text-[#1a3d1f] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                  >
                    <option value="">Selecione uma categoria</option>
                    {opcoes.categorias.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#8aaa8d]" />
                    <label
                      htmlFor="edit-valor"
                      className="text-xs font-bold text-[#8aaa8d] uppercase tracking-wider"
                    >
                      Preço Base
                    </label>
                  </div>
                  <div className="flex items-center border border-[#c2e5cc] rounded-xl bg-[#fcfdfc] overflow-hidden focus-within:ring-2 focus-within:ring-[#5bc48b]">
                    <div className="px-4 py-3 bg-[#e8f5ec] border-r border-[#c2e5cc]">
                      <span className="font-bold text-[#1b6112] text-sm">
                        R$
                      </span>
                    </div>
                    <input
                      id="edit-valor"
                      type="text"
                      value={formData.precoBase}
                      onChange={handlePriceChange}
                      placeholder="0,00"
                      className="flex-1 px-4 py-3 bg-transparent text-base font-semibold text-[#1a3d1f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Unidade de Medida */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-[#8aaa8d]" />
                    <label
                      htmlFor="edit-unidade"
                      className="text-xs font-bold text-[#8aaa8d] uppercase tracking-wider"
                    >
                      Unidade de Medida
                    </label>
                  </div>
                  <select
                    id="edit-unidade"
                    value={formData.unidadeMedida}
                    onChange={(e) =>
                      handleFormChange("unidadeMedida", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#fcfdfc] border border-[#c2e5cc] rounded-xl text-base font-semibold text-[#1a3d1f] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                  >
                    <option value="">Selecione uma unidade</option>
                    {opcoes.unidadesMedida.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#f0f5f0]" />

              {/* Botões */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleDeleteItem}
                  className="px-6 py-4 bg-[#fef2f2] border border-[#fca5a5] rounded-2xl hover:bg-[#fde8e8] transition-colors flex items-center gap-2"
                >
                  <Trash2 size={20} className="text-red-600" />
                  <span className="font-semibold text-red-600">
                    Excluir Item
                  </span>
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-10 py-4 bg-[#5bc48b] rounded-2xl hover:bg-[#4aa86f] transition-colors text-white font-bold text-lg flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle2 size={24} className="text-white" />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
