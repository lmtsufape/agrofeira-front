"use client";

import { useState, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Banknote, ChevronRight, ArrowLeft } from "lucide-react";

type PaymentCard = {
  label: string;
  icon: ElementType;
  description: string;
  accent: string;
  href: string;
};

const paymentCards: PaymentCard[] = [
  {
    label: "Relatórios Financeiros",
    icon: BarChart3,
    description:
      "Consulte os balanços detalhados de vendas, comissões, entradas e saídas do sistema.",
    accent: "#1b6112",
    href: "/pagamentos/relatorios",
  },
  {
    label: "Pagamento aos Comerciantes",
    icon: Banknote,
    description:
      "Gerencie e efetue o pagamento dos valores devidos aos produtores e comerciantes parceiros.",
    accent: "#2d7a1f",
    href: "/pagamentos/repasses",
  },
];

function PaymentCardComponent({
  card,
  index,
}: {
  card: PaymentCard;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const Icon = card.icon;

  return (
    <button
      onClick={() => router.push(card.href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-start text-left rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 flex-1 min-w-fit"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${card.accent} 0%, #5bc48b 100%)`
          : "white",
        boxShadow: hovered
          ? `0 20px 40px rgba(0,61,4,0.2), 0 0 0 1px ${card.accent}22`
          : "0 2px 12px rgba(0,61,4,0.07), 0 0 0 1px rgba(0,61,4,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Círculos decorativos */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: hovered ? "rgba(255,255,255,0.12)" : `${card.accent}10`,
        }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: hovered ? "rgba(255,255,255,0.08)" : `${card.accent}08`,
        }}
      />

      {/* Ícone */}
      <div
        className="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-all duration-300"
        style={{
          background: hovered ? "rgba(255,255,255,0.2)" : `${card.accent}12`,
        }}
      >
        <Icon
          size={28}
          style={{ color: hovered ? "white" : card.accent }}
          className="transition-colors duration-300"
        />
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1 w-full">
        <p
          className="font-bold text-lg leading-tight mb-2 transition-colors duration-300"
          style={{ color: hovered ? "white" : "#1a3d1f" }}
        >
          {card.label}
        </p>
        <p
          className="text-sm leading-relaxed transition-colors duration-300"
          style={{ color: hovered ? "rgba(255,255,255,0.75)" : "#8aaa8d" }}
        >
          {card.description}
        </p>
      </div>

      {/* Seta */}
      <div className="relative z-10 mt-4 self-end">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300"
          style={{
            background: hovered ? "rgba(255,255,255,0.2)" : `${card.accent}10`,
          }}
        >
          <ChevronRight
            size={16}
            style={{ color: hovered ? "white" : card.accent }}
            className="transition-colors duration-300"
          />
        </div>
      </div>
    </button>
  );
}

export function CentralPagamentos() {
  const router = useRouter();

  return (
    <div className="flex-1 px-6 py-6 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Voltar + Header */}
      <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-8 flex-1 relative pb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1a3d1f]">
                Central de Pagamentos
              </h2>
              <p className="text-sm text-[#8aaa8d]">
                Selecione o módulo financeiro que deseja acessar
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-60 right-0 h-px bg-gradient-to-r from-[#c8deca] to-transparent" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentCards.map((card, i) => (
          <PaymentCardComponent key={card.label} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
