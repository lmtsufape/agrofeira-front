"use client";

import { useState, useEffect, useId, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  ChevronRight,
  X,
} from "lucide-react";

interface ItemPedido {
  id: string;
  nome: string;
  unidadeMedida: string;
  quantidade: number;
  preco?: number;
}

interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const MOCK_ITENS: ItemPedido[] = [
  {
    id: "1",
    nome: "Tomate Orgânico",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 5.5,
  },
  {
    id: "2",
    nome: "Alface Crespa",
    unidadeMedida: "Maço",
    quantidade: 0,
    preco: 3.0,
  },
  {
    id: "3",
    nome: "Cenoura Fresca",
    unidadeMedida: "Maço",
    quantidade: 0,
    preco: 4.0,
  },
  {
    id: "4",
    nome: "Cebola Roxa",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 2.5,
  },
  {
    id: "5",
    nome: "Batata Doce",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 3.5,
  },
  {
    id: "6",
    nome: "Pimentão Verde",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 6.0,
  },
  {
    id: "7",
    nome: "Cheiro Verde",
    unidadeMedida: "Maço",
    quantidade: 0,
    preco: 2.0,
  },
  { id: "8", nome: "Mandioca", unidadeMedida: "Kg", quantidade: 0, preco: 4.5 },
];

export default function ResumoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </div>
      }
    >
      <ResumoContent />
    </Suspense>
  );
}

function ResumoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const participanteId = searchParams.get("participante");
  const participanteTipo = searchParams.get("tipo");
  const itensList = searchParams.get("itens") || "";
  const feiraNomeCompleto =
    searchParams.get("feiraNome") || "15/04/2026 - Garanhuns PE";

  const [itensCarrinho, setItensCarrinho] = useState<ItemPedido[]>([]);
  const [opcaoRetirada, setOpcaoRetirada] = useState<"local" | "endereco">(
    "local",
  );
  const [enderecoModal, setEnderecoModal] = useState(false);
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [endereco, setEndereco] = useState<Endereco>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const id = useId();
  const numeroPedido = id.replace(/:/g, "").slice(0, 9).toUpperCase();

  useEffect(() => {
    // Parse dos itens do query param
    if (itensList) {
      const itensParsed: ItemPedido[] = [];
      const pares = itensList.split(",");

      pares.forEach((par) => {
        const [id, qty] = par.split(":");
        const itemOriginal = MOCK_ITENS.find((i) => i.id === id);
        if (itemOriginal) {
          itensParsed.push({
            ...itemOriginal,
            quantidade: parseInt(qty, 10),
          });
        }
      });

      // eslint-disable-next-line
      setItensCarrinho(itensParsed);
    }
  }, [itensList]);

  const handleQuantidadeChange = (id: string, delta: number) => {
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item,
      ),
    );
  };

  const handleRemover = (id: string) => {
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const valorTotal = itensCarrinho.reduce(
    (acc, item) => acc + (item.preco || 0) * item.quantidade,
    0,
  );

  const handleFinalizarPedido = () => {
    // TODO: Enviar pedido para API
    console.log({
      participanteId,
      participanteTipo,
      itensCarrinho,
      opcaoRetirada,
      endereco: opcaoRetirada === "endereco" ? endereco : null,
      valorTotal,
    });
    // Marcar como realizado com sucesso
    setPedidoRealizado(true);

    // Redirecionar para dashboard após 3 segundos
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <>
      {/* Modal de Sucesso */}
      {pedidoRealizado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#5bc48b] to-[#3d9428] flex items-center justify-center">
                <CheckCircle2 size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3d1f] mb-2">
              Pedido Realizado com Sucesso!
            </h2>
            <p className="text-sm sm:text-base text-[#8aaa8d] mb-6">
              Seu pedido foi processado e enviado. Redirecionando para a
              dashboard em alguns instantes...
            </p>
            <div className="w-full bg-gradient-to-r from-[#003d04] to-[#1b6112] rounded-2xl px-6 py-3 text-white font-bold mb-3">
              Pedido #{numeroPedido}
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full h-11 bg-gradient-to-r from-[#003d04] to-[#1b6112] text-white font-bold rounded-2xl hover:shadow-lg transition-all"
            >
              Voltar para Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo da página */}
      <div className="flex-1 px-4 sm:px-6 md:px-16 py-4 sm:py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Header com título */}
        <div className="flex items-start gap-3 md:gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg bg-white border border-[#003d04]/10 shadow-sm flex items-center justify-center hover:bg-[#f0f5f0] transition-colors flex-shrink-0 mt-0.5"
          >
            <ArrowLeft size={16} className="text-[#003d04]" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg sm:text-xl font-bold text-[#1a3d1f]">
                Confirmar Pedido e Itens
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#8aaa8d]">
              Feira {feiraNomeCompleto}
            </p>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 border border-[#eef5ee]">
          {/* Seção itens e valor total */}
          <div className="pb-4 sm:pb-6 border-b border-[#5bc48b]/15">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#003d04] to-[#1b6112] flex items-center justify-center flex-shrink-0">
                  <Package size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-[#1a3d1f] text-sm sm:text-base">
                    Itens Selecionados
                  </h2>
                  <p className="text-xs text-[#8aaa8d]">Revise a quantidade</p>
                </div>
              </div>
              <div className="text-right sm:text-right">
                <p className="text-xs text-[#8aaa8d] font-bold uppercase">
                  Total
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#1a3d1f]">
                  R$ {valorTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de itens */}
          <div className="flex flex-col gap-2 sm:gap-3 py-4 sm:py-6">
            {itensCarrinho.length === 0 ? (
              <p className="text-center text-[#8aaa8d] py-8">
                Nenhum item selecionado
              </p>
            ) : (
              itensCarrinho.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 transition-all ${
                    item.quantidade > 0
                      ? "bg-gradient-to-b from-[#f6faf4] to-[#edf5eb] border-[#daeeda]"
                      : "bg-white border-[#e5efe6]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#5bc48b]/15 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1a3d1f] text-xs sm:text-sm truncate">
                          {item.nome}
                        </p>
                        <p className="text-xs text-[#8aaa8d]">
                          {item.unidadeMedida} • R${" "}
                          {(item.preco || 0).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      {/* Controle de quantidade */}
                      <div className="flex items-center gap-0.5 sm:gap-1 bg-white rounded-lg border border-[#003d04]/10">
                        <button
                          onClick={() => handleQuantidadeChange(item.id, -1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#1a3d1f] hover:bg-[#f0f5f0] transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-6 sm:w-10 text-center font-bold text-[#1a3d1f] text-xs sm:text-sm">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => handleQuantidadeChange(item.id, 1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#1a3d1f] hover:bg-[#f0f5f0] transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => handleRemover(item.id)}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Opção de retirada */}
          <div className="pt-4 sm:pt-6 border-t border-[#eef5ee]">
            <p className="text-xs font-bold text-[#1a3d1f] uppercase tracking-wider mb-3 sm:mb-4">
              Opção de Retirada
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setOpcaoRetirada("local")}
                className={`p-3 sm:p-4 rounded-2xl border-2 transition-all text-left ${
                  opcaoRetirada === "local"
                    ? "bg-gradient-to-b from-[#f6faf4] to-[#edf5eb] border-[#5bc48b]"
                    : "bg-white border-[#d4e8d6]"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-4 flex-shrink-0 ${
                      opcaoRetirada === "local"
                        ? "border-[#5bc48b] bg-[#5bc48b] box-content"
                        : "border-[#d4e8d6]"
                    }`}
                  ></div>
                  <span
                    className={`font-bold text-sm ${
                      opcaoRetirada === "local"
                        ? "text-[#003d04]"
                        : "text-[#8aaa8d]"
                    }`}
                  >
                    Local da Feira
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setOpcaoRetirada("endereco");
                  setEnderecoModal(true);
                }}
                className={`p-3 sm:p-4 rounded-2xl border-2 transition-all text-left ${
                  opcaoRetirada === "endereco"
                    ? "bg-gradient-to-b from-[#f6faf4] to-[#edf5eb] border-[#5bc48b]"
                    : "bg-white border-[#d4e8d6]"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                      opcaoRetirada === "endereco"
                        ? "border-[#5bc48b] bg-[#5bc48b]"
                        : "border-[#d4e8d6]"
                    }`}
                  ></div>
                  <span
                    className={`font-bold text-sm ${
                      opcaoRetirada === "endereco"
                        ? "text-[#003d04]"
                        : "text-[#8aaa8d]"
                    }`}
                  >
                    Endereço Específico
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Exibir endereço selecionado */}
          {opcaoRetirada === "endereco" && (
            <div className="pt-4 sm:pt-6 border-t border-[#eef5ee]">
              <p className="text-xs font-bold text-[#1a3d1f] uppercase tracking-wider mb-3 sm:mb-4">
                Endereço de Retirada
              </p>
              {endereco.rua && endereco.numero ? (
                <div className="bg-gradient-to-b from-[#f6faf4] to-[#edf5eb] border-2 border-[#5bc48b] rounded-2xl p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-[#8aaa8d] font-bold">
                        ENDEREÇO
                      </p>
                      <p className="text-sm font-bold text-[#1a3d1f]">
                        {endereco.rua}, {endereco.numero}
                        {endereco.complemento && ` - ${endereco.complemento}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8aaa8d] font-bold">BAIRRO</p>
                      <p className="text-sm font-bold text-[#1a3d1f]">
                        {endereco.bairro}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#8aaa8d] font-bold">
                          CIDADE
                        </p>
                        <p className="text-sm font-bold text-[#1a3d1f]">
                          {endereco.cidade}
                          {endereco.estado && `, ${endereco.estado}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8aaa8d] font-bold">CEP</p>
                        <p className="text-sm font-bold text-[#1a3d1f]">
                          {endereco.cep}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEnderecoModal(true)}
                      className="mt-3 w-full text-xs font-bold text-[#5bc48b] hover:text-[#4aa86f] transition-colors text-center py-2"
                    >
                      Editar Endereço
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f0f5f0] border-2 border-[#d4e8d6] rounded-2xl p-4 text-center">
                  <p className="text-sm text-[#8aaa8d]">
                    Clique em &quot;Endereço Específico&quot; para informar o
                    endereço de retirada
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col-reverse sm:flex-row-reverse sm:justify-end gap-3 sm:gap-4 pb-4">
          <button
            onClick={handleFinalizarPedido}
            disabled={itensCarrinho.length === 0 || pedidoRealizado}
            className="h-10 sm:h-12 px-4 sm:px-8 bg-gradient-to-r from-[#003d04] to-[#1b6112] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>Finalizar</span>
            <ChevronRight size={16} className="hidden sm:block" />
          </button>
          <button
            onClick={() => router.back()}
            className="h-10 sm:h-12 px-4 sm:px-8 bg-white border border-[#d4e8d6] text-[#1a3d1f] font-bold rounded-2xl hover:bg-[#f9fdf8] transition-colors text-sm sm:text-base"
          >
            Cancelar
          </button>
        </div>

        {/* Modal de Endereço */}
        {enderecoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-[#1a3d1f]">
                  Informar Endereço
                </h2>
                <button
                  onClick={() => setEnderecoModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#f0f5f0] flex items-center justify-center hover:bg-[#e0ebde] transition-colors"
                >
                  <X size={18} className="text-[#8aaa8d]" />
                </button>
              </div>

              {/* Formulário */}
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* CEP */}
                <div>
                  <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={endereco.cep}
                    onChange={(e) =>
                      setEndereco({ ...endereco, cep: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border-2 border-[#d4e8d6] rounded-xl text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors"
                  />
                </div>

                {/* Rua */}
                <div>
                  <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                    Rua
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rua Principal"
                    value={endereco.rua}
                    onChange={(e) =>
                      setEndereco({ ...endereco, rua: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border-2 border-[#d4e8d6] rounded-xl text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors"
                  />
                </div>

                {/* Número e Complemento */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={endereco.numero}
                      onChange={(e) =>
                        setEndereco({ ...endereco, numero: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-[#d4e8d6] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      placeholder="Apt 42"
                      value={endereco.complemento}
                      onChange={(e) =>
                        setEndereco({
                          ...endereco,
                          complemento: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-[#d4e8d6] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors"
                    />
                  </div>
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                    Bairro
                  </label>
                  <input
                    type="text"
                    placeholder="Centro"
                    value={endereco.bairro}
                    onChange={(e) =>
                      setEndereco({ ...endereco, bairro: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border-2 border-[#d4e8d6] rounded-xl text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors"
                  />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="Garanhuns"
                      value={endereco.cidade}
                      onChange={(e) =>
                        setEndereco({ ...endereco, cidade: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-[#d4e8d6] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8aaa8d] uppercase mb-1 sm:mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      placeholder="PE"
                      value={endereco.estado}
                      onChange={(e) =>
                        setEndereco({
                          ...endereco,
                          estado: e.target.value.toUpperCase().slice(0, 2),
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-[#d4e8d6] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1a3d1f] placeholder-[#8aaa8d] focus:outline-none focus:border-[#5bc48b] transition-colors uppercase"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setEnderecoModal(false)}
                    className="flex-1 h-9 sm:h-10 bg-white border border-[#d4e8d6] text-[#1a3d1f] font-bold rounded-xl hover:bg-[#f9fdf8] transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setEnderecoModal(false)}
                    className="flex-1 h-9 sm:h-10 bg-gradient-to-r from-[#003d04] to-[#1b6112] text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
