"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCliente } from "../hooks/useCliente";

interface ClienteEditProps {
  clienteId: string;
}

export function ClienteEdit({ clienteId }: ClienteEditProps) {
  const router = useRouter();
  const {
    cliente,
    formData,
    loading,
    error,
    savingChanges,
    handleFormChange,
    saveChanges,
  } = useCliente(clienteId);

  const handleSaveChanges = async () => {
    try {
      await saveChanges();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar alterações");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 px-4 sm:px-6 lg:px-32 py-8 flex items-center justify-center">
        <p className="text-[#8aaa8d]">Carregando dados...</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex-1 px-4 sm:px-6 lg:px-32 py-8 flex items-center justify-center">
        <p className="text-red-500">{error || "Cliente não encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-32 py-6 sm:py-8 flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-xl bg-white border border-[#daeeda] shadow-sm flex items-center justify-center hover:bg-[#f0f5f0] transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} className="text-[#1b6112]" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#1a3d1f]">
            Gerenciar Cliente
          </h1>
          <p className="text-base text-[#8aaa8d]">
            Atualize os dados pessoais e endereço para entrega.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-3xl border border-[#eef5ee] shadow-lg p-8 w-full">
        {/* Seção Dados Pessoais */}
        <div className="space-y-6 pb-8 border-b border-[#f0f5f0]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eef5ee]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#5bc48b]"
            >
              <path
                d="M11.67 5L8.33 15"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
              />
              <circle
                cx="10"
                cy="5.83"
                r="3.33"
                stroke="currentColor"
                strokeWidth="1.67"
              />
            </svg>
            <h2 className="text-xl font-bold text-[#1b6112]">Dados Pessoais</h2>
          </div>

          <div className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label
                htmlFor="nome"
                className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2"
              >
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleFormChange("nome", e.target.value)}
                placeholder="Ex: Maria de Oliveira"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="telefone"
                className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2"
              >
                Telefone
              </label>
              <input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleFormChange("telefone", e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Descrição */}
            <div>
              <label
                htmlFor="descricao"
                className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2"
              >
                Descrição / Observações
              </label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleFormChange("descricao", e.target.value)}
                placeholder="Adicione uma nota sobre o cliente (opcional)"
                rows={3}
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Seção Endereço */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eef5ee]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#5bc48b]"
            >
              <path
                d="M13.33 16.67L13.33 5"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
              />
              <path
                d="M7.50 5.83L7.50 5.83"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
              />
            </svg>
            <h2 className="text-xl font-bold text-[#1b6112]">Endereço</h2>
          </div>

          <div className="space-y-4">
            {/* CEP */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                CEP
              </label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => handleFormChange("cep", e.target.value)}
                placeholder="00000-000"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Rua */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                Rua / Logradouro
              </label>
              <input
                type="text"
                value={formData.rua}
                onChange={(e) => handleFormChange("rua", e.target.value)}
                placeholder="Av. Principal"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Número */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                Número
              </label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => handleFormChange("numero", e.target.value)}
                placeholder="123"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={formData.complemento}
                onChange={(e) =>
                  handleFormChange("complemento", e.target.value)
                }
                placeholder="Apto, Bloco, etc"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                Bairro
              </label>
              <input
                type="text"
                value={formData.bairro}
                onChange={(e) => handleFormChange("bairro", e.target.value)}
                placeholder="Centro"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => handleFormChange("cidade", e.target.value)}
                placeholder="São Paulo"
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-bold text-[#8aaa8d] uppercase tracking-wider mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleFormChange("estado", e.target.value)}
                className="w-full px-4 py-3.5 bg-[#fcfdfc] border border-[#c2e5cc] rounded-2xl text-base font-medium text-[#1a3d1f] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
              >
                <option value="">UF</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-[#f0f5f0]">
          <button
            onClick={() => router.back()}
            disabled={savingChanges}
            className="px-8 py-3 text-gray-500 text-base font-semibold hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={savingChanges}
            className="px-10 py-3 bg-[#5bc48b] rounded-xl text-white text-base font-bold hover:bg-[#4aa86f] transition-colors flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={20} />
            {savingChanges ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
