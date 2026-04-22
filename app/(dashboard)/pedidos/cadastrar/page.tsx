"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Users } from "lucide-react";
import { listarClientes } from "@/services/clientes.service";
import { listarComerciantes } from "@/services/comerciantes.service";
import { PageHeader } from "@/components/ui/PageHeader";

interface Participante {
  id: string;
  nome: string;
  tipo: "cliente" | "comerciante";
  telefone?: string;
}

const MOCK_PARTICIPANTES: Participante[] = [
  {
    id: "cliente-1",
    nome: "João da Silva",
    tipo: "cliente",
    telefone: "(11) 98765-4321",
  },
  {
    id: "cliente-2",
    nome: "Maria José Jacinto",
    tipo: "cliente",
    telefone: "(11) 98765-4322",
  },
  {
    id: "cliente-3",
    nome: "Zé Maria da Silva",
    tipo: "cliente",
    telefone: "(11) 98765-4323",
  },
  {
    id: "comerciante-1",
    nome: "Alisson Manoel",
    tipo: "comerciante",
    telefone: "(11) 98765-4324",
  },
  {
    id: "comerciante-2",
    nome: "Pedro Paulo Santos",
    tipo: "comerciante",
    telefone: "(11) 98765-4325",
  },
  {
    id: "comerciante-3",
    nome: "Ana Carolina Ribeiro",
    tipo: "comerciante",
    telefone: "(11) 98765-4326",
  },
];

export default function CadastrarPedidoPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [filteredParticipantes, setFilteredParticipantes] = useState<
    Participante[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipante, setSelectedParticipante] =
    useState<Participante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Carregar participantes
  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        setLoading(true);
        const [clientes, comerciantes] = await Promise.all([
          listarClientes(),
          listarComerciantes(),
        ]);

        const participantesData: Participante[] = [
          ...clientes.map((c) => ({
            id: c.id,
            nome: c.nome,
            tipo: "cliente" as const,
            telefone: c.telefone,
          })),
          ...comerciantes.map((com) => ({
            id: com.id,
            nome: com.nome,
            tipo: "comerciante" as const,
            telefone: com.telefone,
          })),
        ];

        setParticipantes(participantesData);
        setFilteredParticipantes(participantesData);
        setError(null);
      } catch {
        // Usar dados mock como fallback
        setParticipantes(MOCK_PARTICIPANTES);
        setFilteredParticipantes(MOCK_PARTICIPANTES);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, []);

  useEffect(() => {
    const filtered = participantes.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredParticipantes(filtered);
  }, [searchTerm, participantes]);

  const handleProximo = () => {
    if (selectedParticipante) {
      router.push(
        `/pedidos/itens?participante=${selectedParticipante.id}&tipo=${selectedParticipante.tipo}&nome=${encodeURIComponent(selectedParticipante.nome)}`,
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl w-full mx-auto flex flex-col gap-6">
        <PageHeader
          title="Selecionar Participante"
          subtitle="Escolha o cliente ou comerciante para continuar a operação"
          backHref="/dashboard"
        />

        {/* Barra de busca */}
        <div className="relative w-full">
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
            placeholder="Buscar participante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#daeeda] rounded-lg text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5bc48b]"
          />
        </div>

        {/* Lista de participantes */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
          {loading ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-[#8aaa8d]">Carregando participantes...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredParticipantes.length > 0 ? (
            filteredParticipantes.map((participante) => (
              <div
                key={participante.id}
                className="p-4 md:p-6 border-b border-[#eef5ee] last:border-0 hover:bg-[#fcfdfc] cursor-pointer transition-colors"
                onClick={() => setSelectedParticipante(participante)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#5bc48b1f]">
                      <Users size={17} className="text-[#5bc48b]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1a3d1f] text-sm">
                        {participante.nome}
                      </p>
                      <p className="text-xs text-[#8aaa8d]">
                        {participante.tipo === "cliente"
                          ? "Cliente"
                          : "Comerciante"}{" "}
                        • {participante.telefone || "S/telefone"}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="participante"
                    checked={selectedParticipante?.id === participante.id}
                    onChange={() => setSelectedParticipante(participante)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 flex items-center justify-center">
              <p className="text-[#8aaa8d]">Nenhum participante encontrado</p>
            </div>
          )}
        </div>

        {/* Botão próximo */}
        {selectedParticipante && (
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-500 text-base font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleProximo}
              className="flex-1 px-6 py-3 bg-[#5bc48b] rounded-lg text-white text-base font-bold hover:bg-[#4aa86f] transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Próximo
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
