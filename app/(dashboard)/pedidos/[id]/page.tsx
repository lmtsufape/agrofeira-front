"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import { buscarPedidoPorId, PedidoDTO } from "@/services/pedidos.service";
import { Loader2, AlertCircle, Printer, User, Calendar } from "lucide-react";

export default function DetalhePedidoPage() {
  const router = useRouter();
  const params = useParams();
  const pedidoId = params.id as string;

  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !pedidoId) return;

    const fetchPedido = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ecofeira_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const data = await buscarPedidoPorId(token, pedidoId);
        setPedido(data);
        setLoading(false);
      } catch (error) {
        setErro("Erro ao carregar detalhes do pedido.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchPedido();
  }, [isMounted, pedidoId, router]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower === "concluído" ||
      statusLower === "entregue" ||
      statusLower === "finalizado"
    ) {
      return { bg: "#E8F5EC", border: "#C2E5CC", text: "#1B6112" };
    } else if (statusLower === "aguardando" || statusLower === "pendente") {
      return { bg: "#FFF8E6", border: "#FFE082", text: "#B38600" };
    } else if (statusLower === "cancelado" || statusLower === "recusado") {
      return { bg: "#FFEBEE", border: "#EF9A9A", text: "#C62828" };
    }
    return { bg: "#F3E5F5", border: "#CE93D8", text: "#6A1B9A" };
  };

  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background: "linear-gradient(160deg, #f6faf4 0%, #edf5eb 100%)",
      }}
    >
      <Header />

      <div className="flex-1 px-16 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : erro ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{erro}</p>
          </div>
        ) : pedido ? (
          <div
            className="w-full max-w-6xl mx-auto"
            style={{ paddingLeft: "63px", paddingRight: "63px" }}
          >
            {/* Header com título e botão imprimir */}
            <div
              className="flex justify-between items-center mb-6"
              style={{
                width: "100%",
                maxWidth: "1024px",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "white",
                    boxShadow: "0px 2px 8px rgba(0, 61, 4, 0.08)",
                    borderRadius: "8px",
                    outline: "1px rgba(0, 61, 4, 0.10) solid",
                    outlineOffset: "-1px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="3.33"
                      y="3.33"
                      width="1.33"
                      height="9.33"
                      fill="#003D04"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      color: "#1A3D1F",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    Detalhes do Pedido
                  </div>
                  {(() => {
                    const colors = getStatusColor(pedido.status);
                    return (
                      <span
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          paddingTop: "2px",
                          paddingBottom: "2px",
                          backgroundColor: colors.bg,
                          borderRadius: "6px",
                          border: `1px solid ${colors.border}`,
                          outlineOffset: "-1px",
                          fontSize: "11.2px",
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        {pedido.status}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Botão Imprimir */}
              <button
                onClick={handlePrint}
                style={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  background: "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.02)",
                  borderRadius: "8px",
                  border: "1px solid #C2E5CC",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#1B6112",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                <Printer width="16" height="16" />
                Imprimir Recibo
              </button>
            </div>

            {/* Informações principais */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Cliente */}
              <div
                style={{
                  padding: "20px",
                  background: "white",
                  boxShadow: "0px 2px 10px rgba(0, 61, 4, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid #EEF5EE",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#F0FAF3",
                    borderRadius: "9999px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <User width="20" height="20" style={{ color: "#5BC48B" }} />
                </div>
                <div>
                  <div
                    style={{
                      color: "#8AAA8D",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      marginBottom: "4px",
                    }}
                  >
                    Nome do Cliente
                  </div>
                  <div
                    style={{
                      color: "#1A3D1F",
                      fontSize: "16.8px",
                      fontWeight: "700",
                    }}
                  >
                    {pedido.clienteNome}
                  </div>
                </div>
              </div>

              {/* Data */}
              <div
                style={{
                  padding: "20px",
                  background: "white",
                  boxShadow: "0px 2px 10px rgba(0, 61, 4, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid #EEF5EE",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#F0FAF3",
                    borderRadius: "9999px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Calendar
                    width="20"
                    height="20"
                    style={{ color: "#5BC48B" }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      color: "#8AAA8D",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      marginBottom: "4px",
                    }}
                  >
                    Data do Pedido
                  </div>
                  <div
                    style={{
                      color: "#1A3D1F",
                      fontSize: "16.8px",
                      fontWeight: "700",
                    }}
                  >
                    {formatarData(pedido.feiraData)} às{" "}
                    {formatarHora(pedido.feiraData)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de produtos */}
            <div
              style={{
                background: "white",
                boxShadow: "0px 2px 10px rgba(0, 61, 4, 0.04)",
                borderRadius: "12px",
                border: "1px solid #EEF5EE",
                marginBottom: "16px",
                overflow: "hidden",
              }}
            >
              {/* Header da tabela */}
              <div
                style={{
                  padding: "12px 24px",
                  background: "#FCFDFC",
                  borderBottom: "1px solid #EEF5EE",
                  display: "grid",
                  gridTemplateColumns: "1fr 0.5fr 0.5fr",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    color: "#5BC48B",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Produto
                </div>
                <div
                  style={{
                    color: "#5BC48B",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    textAlign: "center",
                  }}
                >
                  Quantidade
                </div>
                <div
                  style={{
                    color: "#5BC48B",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    textAlign: "right",
                  }}
                >
                  Valor
                </div>
              </div>

              {/* Linhas da tabela */}
              {pedido.itens.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: "16px 24px",
                    borderBottom:
                      index < pedido.itens.length - 1
                        ? "1px solid #F0F5F0"
                        : "none",
                    display: "grid",
                    gridTemplateColumns: "1fr 0.5fr 0.5fr",
                    gap: "24px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "#E8F5EC",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 4H14V13C14 13.5304 13.7893 14.0391 13.4142 14.4142C13.0391 14.7893 12.5304 15 12 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4Z"
                          stroke="#5BC48B"
                          strokeWidth="1.33"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        color: "#1A3D1F",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {item.itemNome}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      color: "#1A3D1F",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {item.quantidade}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: "#1A3D1F",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    R$ {item.valorTotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer com total */}
            <div
              style={{
                paddingTop: "8px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  paddingLeft: "32px",
                  paddingRight: "32px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  background: "#1B6112",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "32px",
                  boxShadow:
                    "0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.80)",
                    fontSize: "18px",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.45px",
                  }}
                >
                  Valor Total:
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  R$ {pedido.valorTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
