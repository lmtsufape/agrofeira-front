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
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  listarItens,
  atualizarItem,
  deletarItem,
  ItemDTO,
} from "@/services/itens.service";

export default function ItensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itens, setItens] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemDTO | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    valor: "",
    unidadeMedida: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchItens = async () => {
      try {
        setLoading(true);
        const dados = await listarItens();
        setItens(dados);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar itens");
      } finally {
        setLoading(false);
      }
    };

    fetchItens();
  }, []);

  const handleOpenEditModal = (item: ItemDTO) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome || "",
      valor: item.valor || "",
      unidadeMedida: item.unidadeMedida || "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
    setFormData({ nome: "", valor: "", unidadeMedida: "" });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editingItem) return;
    try {
      await atualizarItem(editingItem.id, {
        nome: formData.nome,
        valor: formData.valor,
        unidadeMedida: formData.unidadeMedida,
      });
      // Atualizar lista após salvar
      const dados = await listarItens();
      setItens(dados);
      handleCloseEditModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar item");
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem) return;
    if (
      !window.confirm(`Tem certeza que deseja excluir "${editingItem.nome}"?`)
    )
      return;
    try {
      await deletarItem(editingItem.id);
      // Atualizar lista após deletar
      const dados = await listarItens();
      setItens(dados);
      handleCloseEditModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar item");
    }
  };

  const filteredItens = itens.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-[#003d04]/6 shadow-sm overflow-hidden flex flex-col">
        {/* Header da tabela */}
        <div className="bg-[#fcfdfc] border-b border-[#eef5ee] px-6 py-3 flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#5bc48b] uppercase tracking-wider">
            Nome do Item
          </div>
          <div className="text-xs font-bold text-[#5bc48b] uppercase tracking-wider text-right">
            Ações
          </div>
        </div>

        {/* Body da tabela */}
        <div className="flex flex-col">
          {loading ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-[#8aaa8d]">Carregando itens...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredItens.length === 0 ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-[#8aaa8d]">Nenhum item encontrado</p>
            </div>
          ) : (
            filteredItens.map((item, index) => (
              <div
                key={item.id}
                className={`px-6 py-4 flex items-center justify-between gap-4 ${
                  index !== filteredItens.length - 1
                    ? "border-b border-[#f0f5f0]"
                    : ""
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
                    {item.dataCadastro && (
                      <p className="text-xs text-[#8aaa8d] truncate">
                        {item.dataCadastro}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex-shrink-0">
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
          {!loading && !error && filteredItens.length > 0 && (
            <div className="flex-1 bg-[#fcfdfc]" />
          )}
        </div>

        {/* Footer com paginação */}
        <div className="bg-[#fcfdfc] border-t border-[#eef5ee] px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-[#8aaa8d]">
            Mostrando {filteredItens.length} de {itens.length} Itens
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="w-6 h-6 opacity-50 rounded flex items-center justify-center"
            >
              <span className="text-xs">‹</span>
            </button>
            <button className="w-6 h-6 bg-[#eef5ee] rounded flex items-center justify-center">
              <span className="text-xs font-semibold text-[#1b6112]">1</span>
            </button>
            <button
              disabled
              className="w-6 h-6 opacity-50 rounded flex items-center justify-center"
            >
              <span className="text-xs">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditModal}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com botão de fechar */}
            <div className="flex items-start justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#1a3d1f]">Editar Item</h2>
              <button
                onClick={handleCloseEditModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f5f0] transition-colors text-[#8aaa8d] hover:text-[#1b6112]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Nome do Item */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-[#8aaa8d]" />
                  <label className="text-sm font-bold text-[#8aaa8d] uppercase tracking-wider">
                    Nome do Item
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleFormChange("nome", e.target.value)}
                  placeholder="Ex: Banana"
                  className="w-full px-5 py-4 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-lg font-semibold text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                />
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-[#8aaa8d]" />
                  <label className="text-sm font-bold text-[#8aaa8d] uppercase tracking-wider">
                    Valor
                  </label>
                </div>
                <div className="flex items-center border border-[#c2e5cc] rounded-2xl bg-[#fcfdfc] overflow-hidden">
                  <div className="px-5 py-4 bg-[#e8f5ec] border-r border-[#c2e5cc]">
                    <span className="font-bold text-[#1b6112] text-base">
                      R$
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.valor}
                    onChange={(e) => handleFormChange("valor", e.target.value)}
                    placeholder="6,00"
                    className="flex-1 px-4 py-4 bg-transparent text-lg font-semibold text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none"
                  />
                </div>
              </div>

              {/* Unidade de Medida */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-[#8aaa8d]" />
                  <label className="text-sm font-bold text-[#8aaa8d] uppercase tracking-wider">
                    Unidade de Medida
                  </label>
                </div>
                <select
                  value={formData.unidadeMedida}
                  onChange={(e) =>
                    handleFormChange("unidadeMedida", e.target.value)
                  }
                  className="w-full px-5 py-4 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-lg font-semibold text-[#1a3d1f] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
                >
                  <option value="">Selecione uma unidade</option>
                  <option value="Kg">Kg</option>
                  <option value="g">g</option>
                  <option value="L">Litro</option>
                  <option value="ml">ml</option>
                  <option value="Unidade">Unidade</option>
                  <option value="Dúzia">Dúzia</option>
                  <option value="Caixa">Caixa</option>
                  <option value="Saco">Saco</option>
                </select>
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
