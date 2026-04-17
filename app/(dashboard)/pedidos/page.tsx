"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { listarTodosPedidos, PedidoDTO } from "@/services/pedidos.service";
import { Eye, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ecofeira_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const data = await listarTodosPedidos(token);
        setPedidos(data);
        setPedidosFiltrados(data);
        setLoading(false);
      } catch (error) {
        setErro("Erro ao carregar pedidos. Tente novamente.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isMounted, router]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setPedidosFiltrados(pedidos);
      return;
    }

    const filtered = pedidos.filter(
      (pedido) =>
        pedido.clienteNome.toLowerCase().includes(value.toLowerCase()) ||
        pedido.id.includes(value),
    );
    setPedidosFiltrados(filtered);
  };

  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPedidos = pedidosFiltrados.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatarHora = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower === "concluído" ||
      statusLower === "entregue" ||
      statusLower === "finalizado"
    ) {
      return {
        bg: "#E8F5EC",
        border: "#C2E5CC",
        text: "#1B6112",
      };
    } else if (statusLower === "aguardando" || statusLower === "pendente") {
      return {
        bg: "#FFF8E6",
        border: "#FFE082",
        text: "#B38600",
      };
    } else if (statusLower === "cancelado" || statusLower === "recusado") {
      return {
        bg: "#FFEBEE",
        border: "#EF9A9A",
        text: "#C62828",
      };
    }
    return {
      bg: "#F3E5F5",
      border: "#CE93D8",
      text: "#6A1B9A",
    };
  };

  const getInitials = (nome: string): string => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColor = (status: string) => getStatusColor(status);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background: "linear-gradient(160deg, #f6faf4 0%, #edf5eb 100%)",
      }}
    >
      <Header />

      <div className="flex-1 px-16 py-8">
        <div
          className="w-full max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-green-100"
          style={{
            boxShadow:
              "0px 0px 0px 1px rgba(0, 61, 4, 0.06), 0px 2px 12px rgba(0, 61, 4, 0.05)",
          }}
        >
          {/* Header com título e busca */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0"
                style={{
                  background: "white",
                  boxShadow: "0 2px 10px rgba(0,61,4,0.12)",
                  border: "1px solid rgba(0,61,4,0.1)",
                }}
              >
                <ArrowLeft size={17} style={{ color: "#003d04" }} />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#1A3D1F" }}>
                  Histórico de Pedidos
                </h1>
                <p className="text-sm" style={{ color: "#8AAA8D" }}>
                  Acompanhe as vendas recentes e detalhes das transações.
                </p>
              </div>
            </div>

            {/* Barra de busca */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por cliente ou ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 px-10 py-2 bg-white rounded-lg border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ color: "#1A3D1F" }}
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <circle
                    cx="6.67"
                    cy="6.67"
                    r="5.33"
                    stroke="#9DB89F"
                    strokeWidth="1.33"
                    fill="none"
                  />
                  <line
                    x1="11.11"
                    y1="11.11"
                    x2="13.33"
                    y2="13.33"
                    stroke="#9DB89F"
                    strokeWidth="1.33"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : erro ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{erro}</p>
            </div>
          ) : paginatedPedidos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "Nenhum pedido encontrado"
                  : "Nenhum pedido disponível"}
              </p>
            </div>
          ) : (
            <>
              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#FCFDFC",
                        borderBottom: "1px solid #EEF5EE",
                      }}
                    >
                      <th
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: "#5BC48B", letterSpacing: "0.28px" }}
                      >
                        Cliente
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: "#5BC48B", letterSpacing: "0.28px" }}
                      >
                        Data e Hora
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: "#5BC48B", letterSpacing: "0.28px" }}
                      >
                        Status
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: "#5BC48B", letterSpacing: "0.28px" }}
                      >
                        Total
                      </th>
                      <th
                        className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
                        style={{ color: "#5BC48B", letterSpacing: "0.28px" }}
                      >
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPedidos.map((pedido) => (
                      <tr
                        key={pedido.id}
                        style={{
                          borderBottom: "1px solid #F0F5F0",
                        }}
                      >
                        {/* Cliente */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{
                                backgroundColor: "#5BC48B",
                              }}
                            >
                              {getInitials(pedido.clienteNome)}
                            </div>
                            <div>
                              <p
                                className="font-semibold"
                                style={{ color: "#1A3D1F" }}
                              >
                                {pedido.clienteNome}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#8AAA8D" }}
                              >
                                ID: #{pedido.id.slice(-4)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Data e Hora */}
                        <td className="px-6 py-4">
                          <p style={{ color: "#1A3D1F" }}>
                            {formatarData(pedido.feiraData)}
                          </p>
                          <p
                            className="text-xs flex items-center gap-1"
                            style={{ color: "#8AAA8D" }}
                          >
                            🕐 {formatarHora(pedido.feiraData)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {(() => {
                            const colors = statusColor(pedido.status);
                            return (
                              <span
                                className="px-2 py-1 rounded-full text-xs font-bold"
                                style={{
                                  backgroundColor: colors.bg,
                                  border: `1px solid ${colors.border}`,
                                  color: colors.text,
                                }}
                              >
                                {pedido.status}
                              </span>
                            );
                          })()}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <p
                            className="font-bold text-base"
                            style={{ color: "#1A3D1F" }}
                          >
                            R$ {pedido.valorTotal.toFixed(2)}
                          </p>
                        </td>

                        {/* Ação */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => router.push(`/pedidos/${pedido.id}`)}
                            className="p-1.5 hover:bg-gray-100 rounded-md transition"
                          >
                            <Eye
                              width="16"
                              height="16"
                              style={{ color: "#9DB89F" }}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div
                className="flex justify-between items-center mt-6 pt-6 border-t"
                style={{ borderColor: "#EEF5EE" }}
              >
                <p className="text-xs" style={{ color: "#8AAA8D" }}>
                  Mostrando {startIndex + 1} a{" "}
                  {Math.min(startIndex + itemsPerPage, pedidosFiltrados.length)}{" "}
                  de {pedidosFiltrados.length} pedidos
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M7.5 2L4.5 6L7.5 10"
                        stroke="#9DB89F"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(3, totalPages) }).map(
                    (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className="w-6 h-6 rounded text-xs font-semibold transition"
                        style={{
                          backgroundColor:
                            currentPage === i + 1 ? "#EEF5EE" : "transparent",
                          color: currentPage === i + 1 ? "#1B6112" : "#9DB89F",
                        }}
                      >
                        {i + 1}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M4.5 2L7.5 6L4.5 10"
                        stroke="#9DB89F"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
