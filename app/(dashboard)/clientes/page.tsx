"use client";

import { useState, useEffect } from "react";
import { Users, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { listarClientes, ClienteDTO } from "@/services/clientes.service";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTableList } from "@/components/ui/DataTableList";
import { TableCellIcon, TableCellText } from "@/components/ui/TableCell";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const data = await listarClientes();
        setClientes(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar clientes",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <main className="flex-1 px-4 md:px-6 py-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        <PageHeader
          title="Gerenciar Clientes"
          subtitle="Visualize, edite ou gerencie os clientes cadastrados no sistema"
          backHref="/dashboard"
        />

        {/* Barra de busca */}
        <div className="relative w-full md:w-72">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9db89f]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M10 10L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
          />
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[#8aaa8d]">Carregando clientes...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredClientes.length > 0 ? (
          <DataTableList
            data={filteredClientes}
            getKey={(cliente) => cliente.id}
            mobileHeaderTitle="Clientes"
            columns={[
              { label: "Nome", icon: Users, align: "left" },
              { label: "Ações", icon: Edit2, align: "right" },
            ]}
            renderRowDesktop={(cliente) => (
              <>
                <TableCellIcon icon={Users} label={cliente.nome} />
                <button
                  onClick={() => router.push(`/clientes/${cliente.id}`)}
                  className="px-4 py-2 rounded-lg bg-[#e8f5ec] border border-[#c2e5cc] hover:bg-[#d1efe2] transition-colors text-[#1b6112] text-sm font-semibold flex items-center gap-2"
                >
                  <Edit2 size={14} />
                  Editar
                </button>
              </>
            )}
            renderRowMobile={(cliente) => (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#5bc48b1f]">
                    <Users size={13} className="text-[#5bc48b]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#1a3d1f] font-medium text-sm truncate">
                      {cliente.nome}
                    </p>
                    <p className="text-[#8aaa8d] text-xs">
                      {cliente.dataCadastro || "Data não informada"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/clientes/${cliente.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#e8f5ec] border border-[#c2e5cc] text-[#1b6112] text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                >
                  <Edit2 size={12} />
                </button>
              </>
            )}
          />
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <p className="text-[#8aaa8d]">Nenhum cliente encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}
