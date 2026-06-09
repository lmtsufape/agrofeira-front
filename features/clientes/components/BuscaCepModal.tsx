"use client";

import { useState } from "react";
import { Search, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface BuscaCepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (endereco: ViaCepAddress) => void;
}

export function BuscaCepModal({
  isOpen,
  onClose,
  onSelect,
}: Readonly<BuscaCepModalProps>) {
  const [streetSearch, setStreetSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ViaCepAddress[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!streetSearch || streetSearch.trim().length < 3) {
      setError("Digite pelo menos 3 caracteres do logradouro.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const query = encodeURIComponent(streetSearch.trim()).replace(
        /%20/g,
        "+",
      );
      const response = await fetch(
        `https://viacep.com.br/ws/PE/Garanhuns/${query}/json/`,
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setResults([]);
        setError("Nenhum endereço encontrado em Garanhuns.");
      }
    } catch {
      setError("Erro ao buscar endereços. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target === e.currentTarget) onClose();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Fechar ao clicar fora"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-cep-title"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-[#f6faf4]">
          <h2
            id="modal-cep-title"
            className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2"
          >
            <MapPin size={20} className="text-[#5bc48b]" />
            Buscar CEP em Garanhuns
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-hidden">
          <p className="text-sm text-gray-600 leading-relaxed">
            Digite o nome da rua ou avenida para encontrar o CEP. A busca é
            restrita à cidade de <strong>Garanhuns/PE</strong>.
          </p>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Ex: Alipio Medeiros"
                value={streetSearch}
                onChange={(e) => setStreetSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoFocus
              />
            </div>
            <Button
              onClick={handleSearch}
              isLoading={loading}
              className="px-5 shrink-0"
            >
              <Search size={19} />
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-2 mt-2 custom-scrollbar">
            {results.map((result, idx) => (
              <button
                key={`${result.cep}-${idx}`}
                onClick={() => {
                  onSelect(result);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-2xl border border-gray-100 hover:border-[#5bc48b] hover:bg-[#f6faf4] hover:shadow-sm transition-all group group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#1a3d1f] text-base group-hover:text-[#1b6112]">
                      {result.cep}
                    </p>
                    <p className="text-sm text-gray-700 font-medium truncate mt-0.5">
                      {result.logradouro}
                    </p>
                    <p className="text-xs text-[#8aaa8d] mt-1">
                      {result.bairro} • {result.localidade}/{result.uf}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-[#5bc48b] transition-colors shrink-0 mt-1"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Pequena adição para exibir o ChevronRight se necessário, mas o lucide-react já deve ter.
function ChevronRight({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
