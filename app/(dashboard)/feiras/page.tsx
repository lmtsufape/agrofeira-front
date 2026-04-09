"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { listarFeiras, type FeiraDTO } from "@/services/feiras.service";
import {
  ArrowLeft,
  LogOut,
  Leaf,
  LayoutGrid,
  Package,
  ShoppingCart,
  FileText,
  BarChart2,
  ChevronDown,
  CalendarDays,
  Star,
  ChevronRight,
} from "lucide-react";

/* ── Helpers ─────────────────────────────────────────────── */
const MOCK_FEIRAS: FeiraDTO[] = [
  {
    id: "mock-1",
    dataHora: new Date().toISOString(),
    status: "ABERTA_PEDIDOS",
    comerciantes: [],
    itens: [],
  },
  {
    id: "mock-2",
    dataHora: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: "ABERTA_OFERTAS",
    comerciantes: [],
    itens: [],
  },
  {
    id: "mock-3",
    dataHora: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: "FINALIZADA",
    comerciantes: [],
    itens: [],
  },
];

function formatarData(dataHora: string): string {
  const date = new Date(dataHora);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isFeirasAtiva(status: FeiraDTO["status"]): boolean {
  return status === "ABERTA_PEDIDOS" || status === "ABERTA_OFERTAS";
}

/* ── Types ───────────────────────────────────────────────── */
type ActionOption = {
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  description: string;
  accent: string;
  href?: string;
};

const OPTIONS: ActionOption[] = [
  {
    label: "Cadastrar",
    sublabel: "Itens",
    icon: Package,
    description: "Adicione produtos à feira selecionada",
    accent: "#003d04",
  },
  {
    label: "Cadastrar",
    sublabel: "Pedidos",
    icon: ShoppingCart,
    description: "Registre novos pedidos da feira",
    accent: "#1b6112",
  },
  {
    label: "Visualizar",
    sublabel: "Detalhamento",
    icon: FileText,
    description: "Visualize todos os detalhes da feira",
    accent: "#2d7a1f",
    href: "/feiras/detalhamento",
  },
  {
    label: "Balanço",
    sublabel: "Financeiro",
    icon: BarChart2,
    description: "Acompanhe receitas e despesas",
    accent: "#3d9428",
  },
];

/* ── Dropdown ────────────────────────────────────────────── */
function FeiraDropdown({
  feiras,
  selected,
  onSelect,
  loading,
  error,
}: {
  feiras: FeiraDTO[];
  selected: FeiraDTO | null;
  onSelect: (f: FeiraDTO) => void;
  loading: boolean;
  error: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const placeholder = loading
    ? "Carregando feiras..."
    : error
      ? "Erro ao carregar feiras"
      : "Selecione a Feira";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !loading && !error && setOpen((o) => !o)}
        disabled={loading || !!error}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          borderColor: open ? "#5bc48b" : "#d4e8d6",
          boxShadow: open
            ? "0 0 0 3px rgba(91,196,139,0.15)"
            : "0 1px 3px rgba(0,61,4,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <CalendarDays size={17} style={{ color: "#5bc48b" }} />
          {selected ? (
            <span className="text-[#1a3d1f] font-semibold text-[0.95rem]">
              {formatarData(selected.dataHora)}
            </span>
          ) : (
            <span className="text-[#9db89f] text-[0.95rem]">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          style={{
            color: "#5bc48b",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && feiras.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{
            background: "white",
            boxShadow:
              "0 8px 32px rgba(0,61,4,0.15), 0 0 0 1px rgba(0,61,4,0.08)",
          }}
        >
          {feiras.map((feira, i) => {
            const isSelected = selected?.id === feira.id;
            const ativa = isFeirasAtiva(feira.status);
            return (
              <button
                key={feira.id}
                onClick={() => {
                  onSelect(feira);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(0,61,4,0.07), rgba(91,196,139,0.1))"
                    : i % 2 === 0
                      ? "#fafcf9"
                      : "white",
                  borderBottom:
                    i < feiras.length - 1 ? "1px solid #eef5ee" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(91,196,139,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      i % 2 === 0 ? "#fafcf9" : "white";
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, #003d04, #1b6112)"
                      : "rgba(91,196,139,0.12)",
                  }}
                >
                  {ativa ? (
                    <Star
                      size={12}
                      style={{
                        color: isSelected ? "white" : "#5bc48b",
                        fill: isSelected ? "white" : "#5bc48b",
                      }}
                    />
                  ) : (
                    <CalendarDays
                      size={12}
                      style={{ color: isSelected ? "white" : "#5bc48b" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[0.9rem]"
                    style={{
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#003d04" : "#1a3d1f",
                    }}
                  >
                    {formatarData(feira.dataHora)}
                  </span>
                  {ativa && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded-full text-[0.63rem] font-semibold tracking-wide uppercase"
                      style={{
                        background: "rgba(91,196,139,0.18)",
                        color: "#2d7a1f",
                      }}
                    >
                      Ativa
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#5bc48b" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {open && feiras.length === 0 && !loading && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-xl px-4 py-6 text-center z-50"
          style={{
            background: "white",
            boxShadow: "0 8px 32px rgba(0,61,4,0.15)",
          }}
        >
          <p className="text-[#8aaa8d] text-sm">Nenhuma feira cadastrada</p>
        </div>
      )}
    </div>
  );
}

/* ── Option Card ─────────────────────────────────────────── */
function OptionCard({
  option,
  disabled,
  feiraId,
}: {
  option: ActionOption;
  disabled: boolean;
  feiraId: string | null;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const active = !disabled && hovered;

  function handleClick() {
    if (disabled || !option.href) return;
    const url = feiraId ? `${option.href}?feiraId=${feiraId}` : option.href;
    router.push(url);
  }

  return (
    <button
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="relative flex flex-col items-start text-left rounded-2xl p-5 md:p-6 overflow-hidden transition-all duration-300 w-full"
      style={{
        background: active
          ? `linear-gradient(135deg, ${option.accent} 0%, #5bc48b 100%)`
          : disabled
            ? "#f8f9f8"
            : "white",
        boxShadow: active
          ? `0 20px 40px rgba(0,61,4,0.22), 0 0 0 1px ${option.accent}22`
          : disabled
            ? "0 1px 4px rgba(0,61,4,0.04)"
            : "0 2px 16px rgba(0,61,4,0.08), 0 0 0 1px rgba(0,61,4,0.06)",
        transform: active ? "translateY(-5px)" : "translateY(0)",
        cursor: disabled ? "not-allowed" : option.href ? "pointer" : "default",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {/* Círculos decorativos */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: active ? "rgba(255,255,255,0.12)" : `${option.accent}10`,
        }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: active ? "rgba(255,255,255,0.07)" : `${option.accent}08`,
        }}
      />

      {/* Ícone */}
      <div
        className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-all duration-300"
        style={{
          background: active ? "rgba(255,255,255,0.2)" : `${option.accent}12`,
        }}
      >
        <option.icon
          size={22}
          style={{ color: active ? "white" : option.accent }}
          className="transition-colors duration-300"
        />
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1">
        <p
          className="text-[10px] mb-0.5 font-medium tracking-widest uppercase transition-colors duration-300"
          style={{ color: active ? "rgba(255,255,255,0.75)" : "#7aaa80" }}
        >
          {option.label}
        </p>
        {option.sublabel && (
          <p
            className="font-bold text-base leading-tight mb-1.5 transition-colors duration-300"
            style={{ color: active ? "white" : "#1a3d1f" }}
          >
            {option.sublabel}
          </p>
        )}
        <p
          className="text-xs leading-relaxed transition-colors duration-300"
          style={{ color: active ? "rgba(255,255,255,0.65)" : "#8aaa8d" }}
        >
          {option.description}
        </p>
      </div>

      {/* Seta — só se tiver rota */}
      {option.href && (
        <div className="relative z-10 mt-3 self-end">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300"
            style={{
              background: active
                ? "rgba(255,255,255,0.2)"
                : `${option.accent}10`,
            }}
          >
            <ChevronRight
              size={14}
              style={{ color: active ? "white" : option.accent }}
              className="transition-colors duration-300"
            />
          </div>
        </div>
      )}
    </button>
  );
}

/* ── Página principal ────────────────────────────────────── */
export default function GerenciarFeiraPage() {
  const router = useRouter();
  const { token, logout } = useAuth();

  const [feiras, setFeiras] = useState<FeiraDTO[]>([]);
  const [selected, setSelected] = useState<FeiraDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeiras() {
      if (!token || token === "mock-token-dev") {
        setFeiras(MOCK_FEIRAS);
        setLoading(false);
        return;
      }
      try {
        const data = await listarFeiras(token);
        setFeiras(data);
      } catch {
        setFeiras(MOCK_FEIRAS);
        setError("Não foi possível carregar as feiras da API, usando dados locais.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeiras();
  }, [token]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const feiraSelected = selected !== null;

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background: "linear-gradient(160deg, #f6faf4 0%, #edf5eb 100%)",
      }}
    >
      {/* Header */}
      <header
        className="w-full flex items-center justify-between px-4 md:px-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #003d04 0%, #1b6112 60%, #2d7a1f 100%)",
          minHeight: "64px",
          boxShadow: "0 4px 24px rgba(0,61,4,0.25)",
        }}
      >
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full opacity-10 bg-[#5bc48b] pointer-events-none" />
        <div className="absolute right-40 -bottom-12 w-36 h-36 rounded-full opacity-10 bg-[#5bc48b] pointer-events-none" />

        {/* Logo */}
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

        {/* Centro — só desktop */}
        <div
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full relative z-10"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <LayoutGrid size={13} className="text-[#a8e6c0]" />
          <span className="text-white/80 text-sm">Gerenciar Feira</span>
        </div>

        {/* Sair */}
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-200 text-white/85 hover:text-white"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)";
            }}
          >
            <LogOut size={15} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Corpo */}
      <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl w-full mx-auto flex flex-col gap-6">
        {/* Voltar + título */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0"
            style={{
              background: "white",
              boxShadow: "0 2px 10px rgba(0,61,4,0.12)",
              border: "1px solid rgba(0,61,4,0.1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#f0faf3";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "white";
            }}
          >
            <ArrowLeft size={17} style={{ color: "#003d04" }} />
          </button>
          <div>
            <h1
              className="text-[#1a3d1f] leading-tight"
              style={{
                fontWeight: 700,
                fontSize: "1.35rem",
                letterSpacing: "-0.02em",
              }}
            >
              Gerenciar Feira
            </h1>
            <p className="text-[#8aaa8d] text-xs">
              Selecione uma feira para acessar as opções de gestão
            </p>
          </div>
        </div>

        {/* Card seletor de feira */}
        <div
          className="rounded-2xl p-5 md:p-6"
          style={{
            background: "white",
            boxShadow:
              "0 2px 16px rgba(0,61,4,0.07), 0 0 0 1px rgba(0,61,4,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{
                background: "linear-gradient(135deg, #003d04, #1b6112)",
              }}
            >
              <CalendarDays size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-[#1a3d1f]"
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Feira
              </h3>
              <p className="text-[#8aaa8d] text-xs">
                Escolha a data da feira que deseja gerenciar
              </p>
            </div>
            {feiraSelected && selected && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,61,4,0.07), rgba(91,196,139,0.12))",
                  border: "1.5px solid rgba(91,196,139,0.3)",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#5bc48b]" />
                <span className="text-[#2d7a1f] text-xs font-semibold">
                  {formatarData(selected.dataHora)}
                </span>
              </div>
            )}
          </div>

          <FeiraDropdown
            feiras={feiras}
            selected={selected}
            onSelect={setSelected}
            loading={loading}
            error={error}
          />
        </div>

        {/* Grid de opções */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, #c8deca, transparent)",
              }}
            />
            <p className="text-[#8aaa8d] px-3 text-[0.72rem] font-semibold tracking-widest uppercase">
              {feiraSelected
                ? "O que deseja fazer?"
                : "Selecione uma feira para continuar"}
            </p>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to left, #c8deca, transparent)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {OPTIONS.map((opt) => (
              <OptionCard
                key={opt.label + (opt.sublabel ?? "")}
                option={opt}
                disabled={!feiraSelected}
                feiraId={selected?.id ?? null}
              />
            ))}
          </div>
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
