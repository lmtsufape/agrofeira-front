"use client";

import { Search, Edit2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClientes } from "../hooks/useClientes";

export function ClientesList() {
  const router = useRouter();
  const {
    filteredClientes,
    clientes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useClientes();

  return (
    <div className="flex-1 px-4 sm:px-6 md:px-16 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
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
              Gerenciar Clientes
            </h1>
            <p className="text-xs text-[#8aaa8d] line-clamp-2">
              Visualize, edite ou gerencie os clientes cadastrados no sistema.
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
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-[#003d04]/6 shadow-sm overflow-hidden flex flex-col">
        {/* Header da tabela */}
        <div className="bg-[#fcfdfc] border-b border-[#eef5ee] px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#5bc48b] uppercase tracking-wider truncate">
            Nome do Cliente
          </div>
          <div className="text-xs font-bold text-[#5bc48b] uppercase tracking-wider flex-shrink-0">
            Ações
          </div>
        </div>

        {/* Linhas da tabela */}
        <div className="flex-1 overflow-x-auto sm:overflow-x-visible divide-y divide-[#f0f5f0]">
          {loading ? (
            <div className="px-6 py-8 flex items-center justify-center">
              <p className="text-sm text-[#8aaa8d]">Carregando clientes...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-8 flex items-center justify-center text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : filteredClientes.length > 0 ? (
            filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 hover:bg-[#fcfdfc]/50 transition-colors"
              >
                {/* Info do cliente */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#eef5ee] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#5bc48b]">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1a3d1f] truncate">
                      {cliente.nome}
                    </p>
                    <p className="text-xs text-[#8aaa8d] truncate">
                      {cliente.dataCadastro || "Data não informada"}
                    </p>
                  </div>
                </div>

                {/* Botão editar */}
                <button
                  onClick={() => router.push(`/clientes/${cliente.id}`)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-1.5 bg-[#e8f5ec] border border-[#c2e5cc] rounded-lg opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#1b6112] flex-shrink-0"
                >
                  <Edit2 size={12} />
                  <span>Editar</span>
                </button>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 flex items-center justify-center text-center">
              <p className="text-sm text-[#8aaa8d]">
                Nenhum cliente encontrado
              </p>
            </div>
          )}
        </div>

        {/* Footer da tabela com paginação */}
        <div className="bg-[#fcfdfc] border-t border-[#eef5ee] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-[#8aaa8d] text-center sm:text-left">
            {loading ? (
              <span>Carregando...</span>
            ) : (
              <span>
                Mostrando {filteredClientes.length} de {clientes.length}{" "}
                clientes
              </span>
            )}
          </p>

          {/* Paginação */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="w-6 h-6 rounded opacity-50 hover:opacity-75 flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 9L3 6l4.5-3"
                  stroke="#9db89f"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="w-6 h-6 rounded bg-[#eef5ee] flex items-center justify-center text-xs font-semibold text-[#1b6112]">
              1
            </button>
            <button className="w-6 h-6 rounded opacity-50 hover:opacity-75 flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 3L9 6l-4.5 3"
                  stroke="#9db89f"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
