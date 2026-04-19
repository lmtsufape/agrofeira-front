import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { DecorativeCircle } from "@/components/ui/DecorativeCircle";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#f6faf4_0%,#edf5eb_100%)] px-4">
      {/* Elementos Decorativos */}
      <DecorativeCircle
        size={160}
        color="#003d04"
        opacity={0.05}
        className="-top-20 -left-20"
      />
      <DecorativeCircle
        size={240}
        color="#5bc48b"
        opacity={0.05}
        className="-bottom-24 -right-24"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Ícone de Busca Falha */}
        <div className="w-24 h-24 rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,61,4,0.08)] flex items-center justify-center mb-8 border border-[#eef5ee] animate-bounce-slow">
          <SearchX size={48} className="text-[#5bc48b]" />
        </div>

        {/* Mensagem Principal */}
        <h1 className="text-7xl font-black text-[#003d04] mb-2 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[#1a3d1f] mb-4">
          Página não encontrada
        </h2>

        <p className="text-[#8aaa8d] text-base leading-relaxed mb-10">
          Ops! O endereço que você tentou acessar não existe ou foi movido. Que
          tal voltar para um lugar seguro?
        </p>

        {/* Botão de Retorno */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] bg-gradient-to-br from-[#003d04] via-[#1b6112] to-[#2d7a1f] text-white shadow-[0_4px_16px_rgba(0,61,4,0.3)] hover:shadow-[0_6px_20px_rgba(0,61,4,0.4)] hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Home size={18} />
          Voltar para o Início
        </Link>
      </div>

      {/* Marca d'água ou rodapé simples */}
      <div className="absolute bottom-8 text-[11px] font-medium text-[#aacaad] uppercase tracking-[0.2em]">
        EcoFeira · Plataforma Agroecológica
      </div>
    </div>
  );
}
