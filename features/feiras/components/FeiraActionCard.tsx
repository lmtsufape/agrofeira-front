"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DecorativeCircle } from "@/components/ui/DecorativeCircle";

interface ActionOption {
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  description: string;
  accent: string;
  href?: string;
}

interface FeiraActionCardProps {
  option: ActionOption;
  disabled: boolean;
  feiraId: string | null;
}

const stylesMap: Record<
  string,
  { bg: string; iconBg: string; iconColor: string; arrowColor: string }
> = {
  "#003d04": {
    bg: "bg-[linear-gradient(135deg,#003d04_0%,#5bc48b_100%)]",
    iconBg: "bg-[#003d0412]",
    iconColor: "text-[#003d04]",
    arrowColor: "text-[#003d04]",
  },
  "#1b6112": {
    bg: "bg-[linear-gradient(135deg,#1b6112_0%,#5bc48b_100%)]",
    iconBg: "bg-[#1b611212]",
    iconColor: "text-[#1b6112]",
    arrowColor: "text-[#1b6112]",
  },
  "#2d7a1f": {
    bg: "bg-[linear-gradient(135deg,#2d7a1f_0%,#5bc48b_100%)]",
    iconBg: "bg-[#2d7a1f12]",
    iconColor: "text-[#2d7a1f]",
    arrowColor: "text-[#2d7a1f]",
  },
  "#3d9428": {
    bg: "bg-[linear-gradient(135deg,#3d9428_0%,#5bc48b_100%)]",
    iconBg: "bg-[#3d942812]",
    iconColor: "text-[#3d9428]",
    arrowColor: "text-[#3d9428]",
  },
  "#5bc48b": {
    bg: "bg-[linear-gradient(135deg,#5bc48b_0%,#5bc48b_100%)]",
    iconBg: "bg-[#5bc48b12]",
    iconColor: "text-[#5bc48b]",
    arrowColor: "text-[#5bc48b]",
  },
};

export default function FeiraActionCard({
  option,
  disabled,
  feiraId,
}: Readonly<FeiraActionCardProps>) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const active = !disabled && hovered;

  function handleClick() {
    if (disabled || !option.href) return;
    const url = feiraId ? `${option.href}?feiraId=${feiraId}` : option.href;
    router.push(url);
  }

  const Icon = option.icon;
  const mapped = stylesMap[option.accent] || stylesMap["#5bc48b"];

  let cardClasses = "";
  if (active) {
    cardClasses = `shadow-[0_20px_40px_rgba(0,61,4,0.22)] -translate-y-1.25 ${mapped.bg}`;
  } else if (disabled) {
    cardClasses =
      "bg-[#f8f9f8] opacity-45 cursor-not-allowed shadow-[0_1px_4px_rgba(0,61,4,0.04)]";
  } else {
    cardClasses =
      "bg-white shadow-[0_2px_16px_rgba(0,61,4,0.08)] border border-[rgba(0,61,4,0.06)]";
  }

  return (
    <button
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      disabled={disabled}
      className={`relative flex flex-col items-start text-left rounded-2xl p-5 md:p-6 overflow-hidden transition-all duration-300 w-full group ${cardClasses}`}
    >
      {/* Círculos decorativos */}
      <DecorativeCircle
        size={80}
        color={active ? "white" : option.accent}
        opacity={active ? 0.12 : 0.1}
        className="-top-6 -right-6 transition-all duration-300"
      />
      <DecorativeCircle
        size={48}
        color={active ? "white" : option.accent}
        opacity={active ? 0.07 : 0.08}
        className="-bottom-4 -right-4 transition-all duration-300"
      />

      {/* Ícone */}
      <div
        className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-all duration-300 ${
          active ? "bg-white/20" : mapped.iconBg
        }`}
      >
        <Icon
          size={22}
          className={`transition-colors duration-300 ${active ? "text-white" : mapped.iconColor}`}
        />
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1">
        <p
          className={`text-[10px] mb-0.5 font-medium tracking-widest uppercase transition-colors duration-300 ${
            active ? "text-white/75" : "text-[#7aaa80]"
          }`}
        >
          {option.label}
        </p>
        {option.sublabel && (
          <p
            className={`font-bold text-base leading-tight mb-1.5 transition-colors duration-300 ${
              active ? "text-white" : "text-[#1a3d1f]"
            }`}
          >
            {option.sublabel}
          </p>
        )}
        <p
          className={`text-xs leading-relaxed transition-colors duration-300 ${
            active ? "text-white/65" : "text-[#8aaa8d]"
          }`}
        >
          {option.description}
        </p>
      </div>

      {/* Seta — só se tiver rota */}
      {option.href && (
        <div className="relative z-10 mt-3 self-end">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
              active ? "bg-white/20" : "bg-[rgba(0,61,4,0.1)]"
            }`}
          >
            <ChevronRight
              size={14}
              className={`transition-colors duration-300 ${active ? "text-white" : mapped.arrowColor}`}
            />
          </div>
        </div>
      )}
    </button>
  );
}
