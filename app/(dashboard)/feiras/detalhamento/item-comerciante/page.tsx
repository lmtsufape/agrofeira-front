"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  LogOut,
  Leaf,
  Users,
  Package,
  ChevronDown,
  CalendarDays,
  ArrowRight,
  Hash,
  DollarSign,
  Receipt,
  Search,
  Store,
  Loader2,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   TIPOS
   ══════════════════════════════════════════════════════════ */
interface ComercianteDeItem {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

interface ItemAgrupado {
  id: string;
  nome: string;
  comerciantes: ComercianteDeItem[];
}

/* ══════════════════════════════════════════════════════════
   FUNÇÃO DE BUSCA REAL (CONECTADA AO BACKEND)
   ══════════════════════════════════════════════════════════ */
async function fetchItensComComerciantes(
  token: string,
  feiraId: string
): Promise<ItemAgrupado[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/estoque-banca?feiraId=${feiraId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  if (!response.ok) {
    throw new Error("Erro ao buscar estoques");
  }
  
  const data = await response.json();
  
  // Agrupar os dados retornados por item
  const map = new Map<string, ItemAgrupado>();
  for (const estoque of data) {
    if (!map.has(estoque.itemId)) {
      map.set(estoque.itemId, { 
        id: estoque.itemId, 
        nome: estoque.itemNome, 
        comerciantes: [] 
      });
    }
    map.get(estoque.itemId)!.comerciantes.push({
      id: estoque.comercianteId,
      nome: estoque.comercianteNome,
      quantidade: estoque.quantidadeDisponivel,
      valorUnitario: estoque.precoBase,
    });
  }
  
  return Array.from(map.values());
}

/* ── Helpers ─────────────────────────────────────────────── */
function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ── Dropdown de itens ───────────────────────────────────── */
function ItemDropdown({
  itens,
  selected,
  onSelect,
  loading,
}: {
  itens: ItemAgrupado[];
  selected: ItemAgrupado | null;
  onSelect: (i: ItemAgrupado) => void;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (search) {
          setSearch("");
        }
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [search]);

  const filtered = itens.filter((it) =>
    it.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !loading && setOpen((o) => !o)}
        disabled={loading}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          borderColor: open ? "#5bc48b" : "#d4e8d6",
          boxShadow: open
            ? "0 0 0 3px rgba(91,196,139,0.15)"
            : "0 1px 3px rgba(0,61,4,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 size={17} className="text-[#5bc48b] animate-spin" />
          ) : (
            <Package size={17} style={{ color: "#5bc48b" }} />
          )}
          {selected ? (
            <span className="text-[#1a3d1f] font-semibold text-[0.95rem]">
              {selected.nome}
            </span>
          ) : (
            <span className="text-[#9db89f] text-[0.95rem]">
              {loading ? "Carregando..." : "Selecione o Item"}
            </span>
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

      {open && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{
            background: "white",
            boxShadow: "0 8px 32px rgba(0,61,4,0.15), 0 0 0 1px rgba(0,61,4,0.08)",
          }}
        >
          <div className="p-2 border-b" style={{ borderColor: "#eef5ee" }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db89f]" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar item…"
                className="w-full pl-8 pr-3 py-2 rounded-lg outline-none text-[#1a3d1f]"
                style={{ background: "#f6faf4", border: "1px solid #daeeda", fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-5 text-center text-[#aacaad] text-sm">Nenhum resultado</div>
          ) : (
            filtered.map((it, i) => {
              const isSel = selected?.id === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => { onSelect(it); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
                  style={{
                    background: isSel
                      ? "linear-gradient(135deg, rgba(0,61,4,0.07), rgba(91,196,139,0.1))"
                      : i % 2 === 0 ? "#fafcf9" : "white",
                    borderBottom: i < filtered.length - 1 ? "1px solid #eef5ee" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,196,139,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = i % 2 === 0 ? "#fafcf9" : "white";
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ background: isSel ? "linear-gradient(135deg, #003d04, #1b6112)" : "rgba(91,196,139,0.12)" }}
                  >
                    <Package size={13} style={{ color: isSel ? "white" : "#5bc48b" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] truncate" style={{ fontWeight: isSel ? 700 : 500, color: isSel ? "#003d04" : "#1a3d1f" }}>
                      {it.nome}
                    </p>
                    <p className="text-[0.7rem] text-[#9db89f]">
                      {it.comerciantes.length} {it.comerciantes.length === 1 ? "comerciante" : "comerciantes"}
                    </p>
                  </div>
                  {isSel && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#5bc48b" }} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ── Tabela de comerciantes ──────────────────────────────── */
function ComercianteTable({ item }: { item: ItemAgrupado }) {
  const totalQtd = item.comerciantes.reduce((acc, c) => acc + c.quantidade, 0);
  const totalGeral = item.comerciantes.reduce((acc, c) => acc + c.quantidade * c.valorUnitario, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(0,61,4,0.08), 0 0 0 1px rgba(0,61,4,0.06)" }}
    >
      {/* Cabeçalho desktop */}
      <div
        className="hidden md:grid px-5 py-3"
        style={{
          gridTemplateColumns: "1fr 120px 130px 110px",
          gap: "0 1rem",
          background: "linear-gradient(135deg, #003d04 0%, #1b6112 100%)",
        }}
      >
        {[
          { label: "Nome", icon: Store, align: "left" },
          { label: "Quantidade", icon: Hash, align: "right" },
          { label: "Valor unitário", icon: DollarSign, align: "right" },
          { label: "Total", icon: Receipt, align: "right" },
        ].map(({ label, icon: Icon, align }) => (
          <div key={label} className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
            <Icon size={13} className="text-white/60 shrink-0" />
            <span className="text-white/90 uppercase text-[0.7rem] font-bold tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* Cabeçalho mobile */}
      <div
        className="md:hidden px-4 py-3"
        style={{ background: "linear-gradient(135deg, #003d04 0%, #1b6112 100%)" }}
      >
        <span className="text-white/90 uppercase text-[0.7rem] font-bold tracking-widest">Comerciantes</span>
      </div>

      {/* Linhas */}
      <div style={{ background: "white" }}>
        {item.comerciantes.map((c, i) => {
          const rowTotal = c.quantidade * c.valorUnitario;
          const isEven = i % 2 === 0;
          return (
            <div
              key={c.id + i}
              className="px-4 md:px-5 py-3 md:py-3.5 transition-colors duration-150"
              style={{
                background: isEven ? "white" : "#fafcf9",
                borderBottom: i < item.comerciantes.length - 1 ? "1px solid #eef5ee" : "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(91,196,139,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = isEven ? "white" : "#fafcf9"; }}
            >
              {/* Desktop */}
              <div className="hidden md:grid items-center" style={{ gridTemplateColumns: "1fr 120px 130px 110px", gap: "0 1rem" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(91,196,139,0.12)" }}>
                    <Users size={13} style={{ color: "#5bc48b" }} />
                  </div>
                  <span className="text-[#1a3d1f] font-medium text-[0.9rem] truncate">{c.nome}</span>
                </div>
                <div className="flex justify-end">
                  <span className="px-2.5 py-0.5 rounded-full text-[0.85rem] font-semibold" style={{ background: "rgba(0,61,4,0.07)", color: "#1a3d1f" }}>
                    {c.quantidade}
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="text-[#5a7a5e] font-medium text-[0.9rem]">{formatarMoeda(c.valorUnitario)}</span>
                </div>
                <div className="flex justify-end">
                  <span className="text-[#1a3d1f] font-bold text-[0.9rem]">{formatarMoeda(rowTotal)}</span>
                </div>
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(91,196,139,0.12)" }}>
                    <Users size={13} style={{ color: "#5bc48b" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#1a3d1f] font-medium text-sm truncate">{c.nome}</p>
                    <p className="text-[#9db89f] text-xs">{c.quantidade}x {formatarMoeda(c.valorUnitario)}</p>
                  </div>
                </div>
                <span className="text-[#1a3d1f] font-bold text-sm shrink-0">{formatarMoeda(rowTotal)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé totais */}
      <div
        className="px-4 md:px-5 py-4"
        style={{
          background: "linear-gradient(135deg, rgba(0,61,4,0.07), rgba(91,196,139,0.1))",
          borderTop: "2px solid rgba(91,196,139,0.3)",
        }}
      >
        {/* Desktop */}
        <div className="hidden md:grid items-center" style={{ gridTemplateColumns: "1fr 120px 130px 110px", gap: "0 1rem" }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, #003d04, #1b6112)" }}>
              <Receipt size={13} className="text-white" />
            </div>
            <span className="text-[#003d04] font-bold text-[0.85rem]">Totais</span>
          </div>
          <div className="flex justify-end">
            <span className="px-2.5 py-0.5 rounded-full text-[0.85rem] font-bold" style={{ background: "rgba(0,61,4,0.1)", color: "#003d04" }}>
              {totalQtd}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-[#5a7a5e] text-[0.85rem]">—</span>
          </div>
          <div className="flex justify-end">
            <span className="text-[#003d04] font-bold text-[0.95rem]">{formatarMoeda(totalGeral)}</span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, #003d04, #1b6112)" }}>
              <Receipt size={13} className="text-white" />
            </div>
            <span className="text-[#003d04] font-bold text-sm">Total — {totalQtd} un.</span>
          </div>
          <span className="text-[#003d04] font-bold text-base">{formatarMoeda(totalGeral)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Componente Principal ────────────────────────────────────── */
function ItemComercianteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, logout } = useAuth();

  const feiraId = searchParams.get("feiraId");

  const [itens, setItens] = useState<ItemAgrupado[]>([]);
  const [selected, setSelected] = useState<ItemAgrupado | null>(null);
  const [feiraData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Se não tivermos token ou feiraId, jogamos a atualização pro final da fila com setTimeout
    if (!token || !feiraId) {
      setTimeout(() => {
        if (isMounted) {
          setErro("Token ou identificador da feira não encontrados.");
          setItens([]);
          setLoading(false);
        }
      }, 0);

      return () => {
        isMounted = false;
      };
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchItensComComerciantes(token, feiraId);
        
        if (isMounted) {
          setItens(data);
          setErro(null);
        }
      } catch (error) {
        if (isMounted) {
          setErro("Erro ao carregar os dados. Verifique sua conexão e tente novamente.");
          setItens([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token, feiraId]);

  function handleLogout() { logout(); router.push("/login"); }

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
          <div className="flex items-center justify-center rounded-xl p-2" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-[1.1rem] tracking-tight">EcoFeira</span>
        </div>

        <div
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full relative z-10"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <Package size={13} className="text-[#a8e6c0]" />
          <ArrowRight size={11} className="text-white/40" />
          <Users size={13} className="text-[#a8e6c0]" />
          <span className="text-white/80 text-sm ml-1">Item → Comerciante</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-200 text-white/85 hover:text-white relative z-10"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", fontWeight: 600, fontSize: "0.875rem" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
        >
          <LogOut size={15} /><span>Sair</span>
        </button>
      </header>

      {/* Corpo */}
      <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto flex flex-col gap-6">

        {/* Voltar + título */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0"
            style={{ background: "white", boxShadow: "0 2px 10px rgba(0,61,4,0.12)", border: "1px solid rgba(0,61,4,0.1)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f0faf3"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
          >
            <ArrowLeft size={17} style={{ color: "#003d04" }} />
          </button>
          <div>
            <h1 className="text-[#1a3d1f] font-bold leading-tight" style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
              Item → Comerciante
            </h1>
            <p className="text-[#8aaa8d] text-xs">Veja quais comerciantes oferecem cada item cadastrado</p>
          </div>
        </div>

        {/* Aviso não bloqueante */}
        {erro && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
            {erro}
          </div>
        )}

        {/* Card feira + seletor */}
        <div className="rounded-2xl p-5 md:p-6 flex flex-col gap-5" style={{ background: "white", boxShadow: "0 2px 16px rgba(0,61,4,0.07), 0 0 0 1px rgba(0,61,4,0.06)" }}>

          {/* Banner feira */}
          <div
            className="flex items-center gap-3 md:gap-4 px-4 py-3 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(0,61,4,0.05), rgba(91,196,139,0.1))", border: "1.5px solid rgba(91,196,139,0.2)" }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ background: "linear-gradient(135deg, #003d04, #1b6112)" }}>
              <CalendarDays size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#5bc48b] text-[0.68rem] font-semibold tracking-widest uppercase">Feira Selecionada</p>
              <p className="text-[#1a3d1f] font-bold text-[0.95rem] truncate">
                {feiraData
                  ? new Date(feiraData).toLocaleDateString("pt-BR")
                  : feiraId ?? "Demonstração"}
              </p>
            </div>
            {loading && <Loader2 size={16} className="text-[#5bc48b] animate-spin shrink-0" />}
          </div>

          {/* Seletor de item */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: "linear-gradient(135deg, #003d04, #1b6112)" }}>
                <Package size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1a3d1f] font-bold text-[0.9rem]">Item</p>
                <p className="text-[#8aaa8d] text-[0.7rem]">Escolha o item para ver os comerciantes que o oferecem</p>
              </div>
              {selected && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
                  style={{ background: "rgba(91,196,139,0.12)", border: "1.5px solid rgba(91,196,139,0.3)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#5bc48b]" />
                  <span className="text-[#2d7a1f] text-xs font-semibold">
                    {selected.comerciantes.length} {selected.comerciantes.length === 1 ? "comerciante" : "comerciantes"}
                  </span>
                </div>
              )}
            </div>
            <ItemDropdown
              itens={itens}
              selected={selected}
              onSelect={setSelected}
              loading={loading}
            />
          </div>
        </div>

        {/* Tabela ou empty state */}
        {selected ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #c8deca, transparent)" }} />
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: "linear-gradient(135deg, #003d04, #1b6112)" }}>
                <Package size={13} className="text-white/80" />
                <span className="text-white font-bold text-[0.85rem]">{selected.nome}</span>
              </div>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, #c8deca, transparent)" }} />
            </div>
            <ComercianteTable item={selected} />
          </div>
        ) : (
          !loading && (
            <div
              className="rounded-2xl flex flex-col items-center justify-center py-16 gap-4"
              style={{ background: "white", boxShadow: "0 2px 16px rgba(0,61,4,0.07), 0 0 0 1px rgba(0,61,4,0.06)" }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(0,61,4,0.07), rgba(91,196,139,0.12))" }}>
                <Package size={28} style={{ color: "#5bc48b" }} />
              </div>
              <div className="text-center px-4">
                <p className="text-[#1a3d1f] font-bold text-base">Nenhum item selecionado</p>
                <p className="text-[#8aaa8d] text-[0.8rem] mt-1">
                  Selecione um item acima para ver os comerciantes que o oferecem
                </p>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={13} className="text-[#5bc48b]" />
          <p className="text-[#9db89f] text-xs">© 2026 EcoFeira · Associação Agroecológica</p>
        </div>
        <p className="text-[#b8ceba] text-[0.7rem] hidden sm:block">Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

// EXPORTAÇÃO PRINCIPAL COM O SUSPENSE
export default function ItemComerciantePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f6faf4]">
          <Loader2 className="animate-spin text-[#5bc48b]" size={32} />
        </div>
      }
    >
      <ItemComercianteContent />
    </Suspense>
  );
}