"use client";

import { Warehouse, Plus, Pencil, Check, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { formatarData, formatarMoeda } from "@/utils/formatters";
import {
  useEstoqueFeira,
  type OfertaCadastrada,
} from "@/features/feiras/hooks/useEstoqueFeira";

interface Props {
  feiraId: string;
}

export function EstoqueFeira({ feiraId }: Props) {
  const {
    feira,
    ofertas,
    comerciantes,
    itens,
    loadingOfertas,
    comercianteId,
    setComercianteId,
    produtoId,
    setProdutoId,
    quantidade,
    setQuantidade,
    submitting,
    erro,
    sucesso,
    setSucesso,
    handleAdicionar,
    editandoId,
    novaQtd,
    setNovaQtd,
    editSubmitting,
    iniciarEdicao,
    cancelarEdicao,
    handleAtualizar,
  } = useEstoqueFeira(feiraId);

  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Estoque / Bancas"
        subtitle={
          feira
            ? `Feira de ${formatarData(feira.dataHora)}`
            : "Carregando feira..."
        }
        backHref={feiraId ? `/feiras?feiraId=${feiraId}` : "/feiras"}
      />

      {erro && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
          <span>{sucesso}</span>
          <button
            onClick={() => setSucesso(null)}
            className="text-green-500 hover:text-green-700"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
            <Plus size={17} className="text-white" />
          </div>
          <div>
            <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
              Nova Oferta
            </h3>
            <p className="text-[#8aaa8d] text-xs">
              Registre o estoque de um comerciante para esta feira
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#1a3d1f] text-xs font-semibold tracking-wider uppercase px-1">
              Comerciante
            </label>
            <select
              value={comercianteId}
              onChange={(e) => setComercianteId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e8d6] outline-none bg-white text-[#1a3d1f] shadow-sm focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b1a] text-[0.92rem] transition-all duration-200"
            >
              <option value="">Selecione...</option>
              {comerciantes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1a3d1f] text-xs font-semibold tracking-wider uppercase px-1">
              Produto
            </label>
            <select
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e8d6] outline-none bg-white text-[#1a3d1f] shadow-sm focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b1a] text-[0.92rem] transition-all duration-200"
            >
              <option value="">Selecione...</option>
              {itens.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} ({i.unidadeMedida})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1a3d1f] text-xs font-semibold tracking-wider uppercase px-1">
              Quantidade
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 50"
              className="w-full px-4 py-3 rounded-xl border border-[#d4e8d6] outline-none bg-white text-[#1a3d1f] shadow-sm focus:border-[#5bc48b] focus:ring-2 focus:ring-[#5bc48b1a] text-[0.92rem] transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleAdicionar} isLoading={submitting}>
            {submitting ? "Adicionando..." : "Adicionar Oferta"}
          </Button>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
            <Warehouse size={17} className="text-white" />
          </div>
          <div>
            <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
              Estoque Cadastrado
            </h3>
            <p className="text-[#8aaa8d] text-xs">
              {ofertas.length} oferta{ofertas.length !== 1 ? "s" : ""}{" "}
              registrada
              {ofertas.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loadingOfertas ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#5bc48b]" size={26} />
          </div>
        ) : ofertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Warehouse size={32} className="text-[#c8deca]" />
            <p className="text-[#8aaa8d] text-sm">
              Nenhuma oferta cadastrada para esta feira
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8f0e9]">
                  {[
                    "Comerciante",
                    "Produto",
                    "Un.",
                    "Preço Base",
                    "Ofertado",
                    "Reservado",
                    "Disponível",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[#8aaa8d] text-xs font-semibold tracking-wider uppercase py-2 px-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta) => (
                  <OfertaRow
                    key={oferta.id}
                    oferta={oferta}
                    editandoId={editandoId}
                    novaQtd={novaQtd}
                    setNovaQtd={setNovaQtd}
                    editSubmitting={editSubmitting}
                    iniciarEdicao={iniciarEdicao}
                    cancelarEdicao={cancelarEdicao}
                    handleAtualizar={handleAtualizar}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

interface OfertaRowProps {
  oferta: OfertaCadastrada;
  editandoId: string | null;
  novaQtd: string;
  setNovaQtd: (v: string) => void;
  editSubmitting: boolean;
  iniciarEdicao: (o: OfertaCadastrada) => void;
  cancelarEdicao: () => void;
  handleAtualizar: (id: string) => Promise<void>;
}

function OfertaRow({
  oferta,
  editandoId,
  novaQtd,
  setNovaQtd,
  editSubmitting,
  iniciarEdicao,
  cancelarEdicao,
  handleAtualizar,
}: OfertaRowProps) {
  const editing = editandoId === oferta.id;

  return (
    <tr className="border-b border-[#f0f7f1] hover:bg-[#f6faf4] transition-colors">
      <td className="py-3 px-3 text-[#1a3d1f] font-medium">
        {oferta.comerciante.nome}
      </td>
      <td className="py-3 px-3 text-[#1a3d1f]">{oferta.produto.nome}</td>
      <td className="py-3 px-3 text-[#5a7a5e]">
        {oferta.produto.unidadeMedida}
      </td>
      <td className="py-3 px-3 text-[#5a7a5e]">
        {formatarMoeda(oferta.produto.precoBase)}
      </td>
      <td className="py-3 px-3">
        {editing ? (
          <input
            type="number"
            min="1"
            value={novaQtd}
            onChange={(e) => setNovaQtd(e.target.value)}
            className="w-20 px-2 py-1 rounded-lg border border-[#5bc48b] outline-none text-[#1a3d1f] text-sm focus:ring-2 focus:ring-[#5bc48b1a]"
          />
        ) : (
          <span className="text-[#1a3d1f] font-semibold">
            {oferta.quantidadeOfertada}
          </span>
        )}
      </td>
      <td className="py-3 px-3 text-[#5a7a5e]">{oferta.quantidadeReservada}</td>
      <td className="py-3 px-3">
        <span
          className={`font-semibold ${
            oferta.quantidadeDisponivel > 0 ? "text-[#2d7a1f]" : "text-red-500"
          }`}
        >
          {oferta.quantidadeDisponivel}
        </span>
      </td>
      <td className="py-3 px-3">
        {editing ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAtualizar(oferta.id)}
              disabled={editSubmitting}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#5bc48b] text-white hover:bg-[#4aad7a] disabled:opacity-50 transition-colors"
            >
              {editSubmitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
            </button>
            <button
              onClick={cancelarEdicao}
              disabled={editSubmitting}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f0f0] text-[#666] hover:bg-[#e0e0e0] disabled:opacity-50 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => iniciarEdicao(oferta)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-[#8aaa8d] hover:bg-[#e8f0e9] hover:text-[#2d7a1f] transition-colors"
          >
            <Pencil size={14} />
          </button>
        )}
      </td>
    </tr>
  );
}
