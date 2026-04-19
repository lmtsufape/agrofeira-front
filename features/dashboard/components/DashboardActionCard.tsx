"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CardItem } from "../constants/dashboard-cards";
import { DecorativeCircle } from "@/components/ui/DecorativeCircle";

interface ActionCardProps {
  card: CardItem;
  index: number;
}

const stylesMap: Record<
  string,
  { bg: string; shadow: string; iconBg: string; iconColor: string }
> = {
  "#003d04": {
    bg: "hover:bg-[linear-gradient(135deg,#003d04_0%,#5bc48b_100%)]",
    shadow: "hover:shadow-[0_20px_40px_rgba(0,61,4,0.2),0_0_0_1px_#003d0422]",
    iconBg: "bg-[#003d0412]",
    iconColor: "text-[#003d04]",
  },
  "#1b6112": {
    bg: "hover:bg-[linear-gradient(135deg,#1b6112_0%,#5bc48b_100%)]",
    shadow: "hover:shadow-[0_20px_40px_rgba(0,61,4,0.2),0_0_0_1px_#1b611222]",
    iconBg: "bg-[#1b611212]",
    iconColor: "text-[#1b6112]",
  },
  "#2d7a1f": {
    bg: "hover:bg-[linear-gradient(135deg,#2d7a1f_0%,#5bc48b_100%)]",
    shadow: "hover:shadow-[0_20px_40px_rgba(0,61,4,0.2),0_0_0_1px_#2d7a1f22]",
    iconBg: "bg-[#2d7a1f12]",
    iconColor: "text-[#2d7a1f]",
  },
  "#3d9428": {
    bg: "hover:bg-[linear-gradient(135deg,#3d9428_0%,#5bc48b_100%)]",
    shadow: "hover:shadow-[0_20px_40px_rgba(0,61,4,0.2),0_0_0_1px_#3d942822]",
    iconBg: "bg-[#3d942812]",
    iconColor: "text-[#3d9428]",
  },
  "#5bc48b": {
    bg: "hover:bg-[linear-gradient(135deg,#5bc48b_0%,#5bc48b_100%)]",
    shadow: "hover:shadow-[0_20px_40px_rgba(0,61,4,0.2),0_0_0_1px_#5bc48b22]",
    iconBg: "bg-[#5bc48b12]",
    iconColor: "text-[#5bc48b]",
  },
};

const delayClasses = [
  "[animation-delay:0ms]",
  "[animation-delay:60ms]",
  "[animation-delay:120ms]",
  "[animation-delay:180ms]",
  "[animation-delay:240ms]",
];

export function DashboardActionCard({
  card,
  index,
}: Readonly<ActionCardProps>) {
  const router = useRouter();
  const Icon = card.icon;
  const mapped = stylesMap[card.accent] || stylesMap["#5bc48b"];
  const delay = delayClasses[index] || "[animation-delay:0ms]";

  return (
    <button
      onClick={() => router.push(card.href)}
      className={`relative flex flex-col items-start text-left rounded-2xl p-5 md:p-6 cursor-pointer overflow-hidden transition-all duration-300 w-full group bg-white hover:-translate-y-1 shadow-[0_2px_12px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)] ${mapped.bg} ${mapped.shadow} ${delay}`}
    >
      {/* Círculos decorativos */}
      <DecorativeCircle
        size={80}
        color={card.accent}
        opacity={0.1}
        className="-top-6 -right-6 transition-all duration-300 group-hover:bg-white group-hover:opacity-[0.12]"
      />
      <DecorativeCircle
        size={48}
        color={card.accent}
        opacity={0.08}
        className="-bottom-4 -right-4 transition-all duration-300 group-hover:bg-white group-hover:opacity-[0.08]"
      />

      {/* Ícone */}
      <div
        className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-all duration-300 group-hover:bg-white/20 ${mapped.iconBg}`}
      >
        <Icon
          size={20}
          className={`transition-colors duration-300 group-hover:text-white ${mapped.iconColor}`}
        />
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1">
        <p className="text-[10px] mb-0.5 font-medium tracking-widest uppercase transition-colors duration-300 group-hover:text-white/75 text-[#7aaa80]">
          {card.label}
        </p>
        <p className="font-bold text-base leading-tight mb-1.5 transition-colors duration-300 group-hover:text-white text-[#1a3d1f]">
          {card.sublabel}
        </p>
        <p className="text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/65 text-[#8aaa8d]">
          {card.description}
        </p>
      </div>

      {/* Seta */}
      <div className="relative z-10 mt-3 self-end">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 group-hover:bg-white/20 bg-[rgba(0,61,4,0.1)]">
          <ChevronRight
            size={14}
            className={`transition-colors duration-300 group-hover:text-white ${mapped.iconColor}`}
          />
        </div>
      </div>
    </button>
  );
}
