"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  LogOut,
  Leaf,
  FileText,
  Users,
  Package,
  User,
  BarChart2,
  ChevronRight,
  ArrowRight,
  Loader2,
} from "lucide-react";

export const dynamic = "force-dynamic";

type DetOption = {
  label: string;
  leftIcon: React.ElementType;
  rightIcon: React.ElementType | null;
  description: string;
  accent: string;
  href?: string;
};

const OPTIONS: DetOption[] = [
  {
    label: "Comerciante > Item",
    leftIcon: Users,
    rightIcon: Package,
    description: "Veja os itens por comerciante cadastrado",
    accent: "#003d04",
    href: "/feiras/detalhamento/comerciante-item",
  },
  {
    label: "Item > Comerciante",
    leftIcon: Package,
    rightIcon: Users,
    description: "Veja os comerciantes por item ofertado",
    accent: "#1b6112",
    href: "/feiras/detalhamento/item-comerciante",
  },
  {
    label: "Cliente > Item",
    leftIcon: User,
    rightIcon: Package,
    description: "Veja os itens pedidos por cliente",
    accent: "#2d7a1f",
    href: "/feiras/detalhamento/cliente-item",
  },
  {
    label: "Visão Geral",
    leftIcon: BarChart2,
    rightIcon: null,
    description: "Painel completo com todos os dados da feira",
    accent: "#3d9428",
    href: "/feiras/detalhamento/visao-geral",
  },
];

function DetCard({
  option,
  feiraId,
}: {
  option: DetOption;
  feiraId: string | null;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const LeftIcon = option.leftIcon;
  const RightIcon = option.rightIcon;

  function handleClick() {
    if (!option.href) return;
    const url = feiraId ? `${option.href}?feiraId=${feiraId}` : option.href;
    router.push(url);
  }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="relative flex flex-col items-start text-left rounded-2xl p-5 md:p-6 overflow-hidden transition-all duration-300 w-full"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${option.accent} 0%, #5bc48b 100%)`
          : "white",
        boxShadow: hovered
          ? `0 20px 40px rgba(0,61,4,0.22), 0 0 0 1px ${option.accent}22`
          : "0 2px 16px rgba(0,61,4,0.08), 0 0 0 1px rgba(0,61,4,0.06)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        cursor: option.href ? "pointer" : "default",
      }}
    >
      {/* Círculos decorativos */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full transition-all duration-300 pointer-events-none"
        style={{ background: hovered ? "rgba(255,255,255,0.12)" : `${option.accent}10` }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full transition-all duration-300 pointer-events-none"
        style={{ background: hovered ? "rgba(255,255,255,0.08)" : `${option.accent}08` }}
      />

      {/* Ícones */}
      <div className="relative z-10 flex items-center gap-2 mb-5">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
          style={{ background: hovered ? "rgba(255,255,255,0.2)" : `${option.accent}12` }}
        >
          <LeftIcon
            size={20}
            style={{ color: hovered ? "white" : option.accent }}
            className="transition-colors duration-300"
          />
        </div>
        {RightIcon && (
          <>
            <ArrowRight
              size={13}
              className="transition-colors duration-300 shrink-0"
              style={{ color: hovered ? "rgba(255,255,255,0.5)" : "#aacaad" }}
            />
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
              style={{ background: hovered ? "rgba(255,255,255,0.15)" : `${option.accent}09` }}
            >
              <RightIcon
                size={20}
                style={{ color: hovered ? "rgba(255,255,255,0.85)" : option.accent }}
                className="transition-colors duration-300"
              />
            </div>
          </>
        )}
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1">
        <p
          className="transition-colors duration-300 mb-1 font-bold text-base leading-tight"
          style={{
            color: hovered ? "white" : "#1a3d1f",
            letterSpacing: "-0.01em",
          }}
        >
          {option.label}
        </p>
        <p
          className="transition-colors duration-300 leading-relaxed text-xs"
          style={{ color: hovered ? "rgba(255,255,255,0.65)" : "#8aaa8d" }}
        >
          {option.description}
        </p>
      </div>

      {/* Seta */}
      <div className="relative z-10 mt-4 self-end">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300"
          style={{ background: hovered ? "rgba(255,255,255,0.2)" : `${option.accent}10` }}
        >
          <ChevronRight
            size={14}
            style={{ color: hovered ? "white" : option.accent }}
            className="transition-colors duration-300"
          />
        </div>
      </div>
    </button>
  );
}

// COMPONENTE EXTRAÍDO COM A LÓGICA DO USE_SEARCH_PARAMS
function DetalhamentoFeiraContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const feiraId = searchParams.get("feiraId");

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: "linear-gradient(160deg, #f6faf4 0%, #edf5eb 100%)" }}
    >
      {/* Header */}
      <header
        className="w-full flex items-center justify-between px-4 md:px-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #003d04 0%, #1b6112 60%, #2d7a1f 100%)",
          minHeight: "64px",
          boxShadow: "0 4px 24px rgba(0,61,4,0.25)",
        }}
      >
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full opacity-10 bg-[#5bc48b] pointer-events-none" />
        <div className="absolute right-40 -bottom-12 w-36 h-36 rounded-full opacity-10 bg-[#5bc48b] pointer-events-none" />

        <div className="flex items-center gap-2.5 relative z-10">
          <div
            className="flex items-center justify-center rounded-xl p-2"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-[1.1rem] tracking-tight">
            EcoFeira
          </span>
        </div>

        <div
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full relative z-10"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <FileText size={13} className="text-[#a8e6c0]" />
          <span className="text-white/80 text-sm">Detalhamento Feira</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-200 text-white/85 hover:text-white relative z-10"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
        >
          <LogOut size={15} />
          <span>Sair</span>
        </button>
      </header>

      {/* Corpo */}
      <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl w-full mx-auto flex flex-col gap-6">

        {/* Voltar + título */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0"
            style={{
              background: "white",
              boxShadow: "0 2px 10px rgba(0,61,4,0.12)",
              border: "1px solid rgba(0,61,4,0.1)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f0faf3"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
          >
            <ArrowLeft size={17} style={{ color: "#003d04" }} />
          </button>
          <div>
            <h1
              className="text-[#1a3d1f] font-bold leading-tight"
              style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}
            >
              Detalhamento Feira
            </h1>
            <p className="text-[#8aaa8d] text-xs">
              Escolha uma visão de detalhamento para a feira selecionada
            </p>
          </div>
        </div>

        {/* Banner info */}
        <div
          className="rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(0,61,4,0.06), rgba(91,196,139,0.1))",
            border: "1.5px solid rgba(91,196,139,0.25)",
          }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #003d04, #1b6112)" }}
          >
            <FileText size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[#1a3d1f] font-semibold text-[0.9rem]">
              Selecione o tipo de detalhamento
            </p>
            <p className="text-[#8aaa8d] text-xs">
              Cada opção exibe uma perspectiva diferente dos dados da feira
            </p>
          </div>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #c8deca, transparent)" }} />
          <p className="text-[#8aaa8d] px-3 text-[0.72rem] font-semibold tracking-widest uppercase">
            Opções de Detalhamento
          </p>
          <div className="h-px flex-1" style={{ background: "linear-gradient(to left, #c8deca, transparent)" }} />
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {OPTIONS.map((opt) => (
            <DetCard key={opt.label} option={opt} feiraId={feiraId} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={13} className="text-[#5bc48b]" />
          <p className="text-[#9db89f] text-xs">
            © 2026 EcoFeira · Associação Agroecológica
          </p>
        </div>
        <p className="text-[#b8ceba] text-[0.7rem] hidden sm:block">
          Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}

// EXPORTAÇÃO PRINCIPAL ENVOLVIDA NO SUSPENSE
export default function DetalhamentoFeiraPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f6faf4]">
          <Loader2 className="animate-spin text-[#5bc48b]" size={32} />
        </div>
      }
    >
      <DetalhamentoFeiraContent />
    </Suspense>
  );
}