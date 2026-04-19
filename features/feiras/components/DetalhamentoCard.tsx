"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, ArrowRight, LucideIcon } from "lucide-react";
import { DecorativeCircle } from "@/components/ui/DecorativeCircle";

export type DetOption = {
  label: string;
  leftIcon: LucideIcon;
  rightIcon: LucideIcon | null;
  description: string;
  accent: string;
  href?: string;
};

interface DetalhamentoCardProps {
  option: DetOption;
  feiraId: string | null;
}

const stylesMap: Record<
  string,
  {
    bg: string;
    iconBg1: string;
    iconBg2: string;
    iconColor: string;
    borderHover: string;
  }
> = {
  "#003d04": {
    bg: "hover:bg-[linear-gradient(135deg,#003d04_0%,#5bc48b_100%)]",
    iconBg1: "bg-[#003d0412]",
    iconBg2: "bg-[#003d0409]",
    iconColor: "text-[#003d04]",
    borderHover: "hover:border-[#003d0422]",
  },
  "#1b6112": {
    bg: "hover:bg-[linear-gradient(135deg,#1b6112_0%,#5bc48b_100%)]",
    iconBg1: "bg-[#1b611212]",
    iconBg2: "bg-[#1b611209]",
    iconColor: "text-[#1b6112]",
    borderHover: "hover:border-[#1b611222]",
  },
  "#2d7a1f": {
    bg: "hover:bg-[linear-gradient(135deg,#2d7a1f_0%,#5bc48b_100%)]",
    iconBg1: "bg-[#2d7a1f12]",
    iconBg2: "bg-[#2d7a1f09]",
    iconColor: "text-[#2d7a1f]",
    borderHover: "hover:border-[#2d7a1f22]",
  },
  "#3d9428": {
    bg: "hover:bg-[linear-gradient(135deg,#3d9428_0%,#5bc48b_100%)]",
    iconBg1: "bg-[#3d942812]",
    iconBg2: "bg-[#3d942809]",
    iconColor: "text-[#3d9428]",
    borderHover: "hover:border-[#3d942822]",
  },
  "#5bc48b": {
    bg: "hover:bg-[linear-gradient(135deg,#5bc48b_0%,#5bc48b_100%)]",
    iconBg1: "bg-[#5bc48b12]",
    iconBg2: "bg-[#5bc48b09]",
    iconColor: "text-[#5bc48b]",
    borderHover: "hover:border-[#5bc48b22]",
  },
};

export function DetalhamentoCard({
  option,
  feiraId,
}: Readonly<DetalhamentoCardProps>) {
  const router = useRouter();
  const LeftIcon = option.leftIcon;
  const RightIcon = option.rightIcon;

  function handleClick() {
    if (!option.href) return;
    const url = feiraId ? `${option.href}?feiraId=${feiraId}` : option.href;
    router.push(url);
  }

  const mapped = stylesMap[option.accent] || stylesMap["#5bc48b"];

  return (
    <button
      onClick={handleClick}
      className={`relative flex flex-col items-start text-left rounded-2xl p-5 md:p-6 overflow-hidden transition-all duration-300 w-full group shadow-md hover:shadow-2xl hover:-translate-y-1 border border-[rgba(0,61,4,0.06)] bg-white ${mapped.bg} ${mapped.borderHover}`}
    >
      {/* Círculos decorativos */}
      <DecorativeCircle
        size={80}
        color={option.accent}
        opacity={0.1}
        className="-top-6 -right-6 transition-all duration-300 group-hover:bg-white group-hover:opacity-10"
      />
      <DecorativeCircle
        size={48}
        color={option.accent}
        opacity={0.08}
        className="-bottom-4 -right-4 transition-all duration-300 group-hover:bg-white group-hover:opacity-5"
      />

      {/* Ícones */}
      <div className="relative z-10 flex items-center gap-2 mb-5">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:bg-white/20 ${mapped.iconBg1}`}
        >
          <LeftIcon
            size={20}
            className={`transition-colors duration-300 group-hover:text-white ${mapped.iconColor}`}
          />
        </div>
        {RightIcon && (
          <>
            <ArrowRight
              size={13}
              className="transition-colors duration-300 shrink-0 text-[#aacaad] group-hover:text-white/50"
            />
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:bg-white/15 ${mapped.iconBg2}`}
            >
              <RightIcon
                size={20}
                className={`transition-colors duration-300 group-hover:text-white/85 ${mapped.iconColor}`}
              />
            </div>
          </>
        )}
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1">
        <p className="transition-colors duration-300 mb-1 font-bold text-base leading-tight tracking-tight text-[#1a3d1f] group-hover:text-white">
          {option.label}
        </p>
        <p className="transition-colors duration-300 leading-relaxed text-xs text-[#8aaa8d] group-hover:text-white/65">
          {option.description}
        </p>
      </div>

      {/* Seta */}
      <div className="relative z-10 mt-4 self-end">
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 group-hover:bg-white/20 ${mapped.iconBg1}`}
        >
          <ChevronRight
            size={14}
            className={`transition-colors duration-300 group-hover:text-white ${mapped.iconColor}`}
          />
        </div>
      </div>
    </button>
  );
}
