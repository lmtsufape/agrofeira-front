"use client";

interface DecorativeCirclesProps {
  className?: string;
  size?: number | string;
  color?: string;
  opacity?: number;
}

const sizeMap: Record<string | number, string> = {
  48: "w-12 h-12",
  80: "w-20 h-20",
  160: "w-40 h-40",
};

const colorMap: Record<string, string> = {
  "#003d04": "bg-[#003d04]",
  "#1b6112": "bg-[#1b6112]",
  "#2d7a1f": "bg-[#2d7a1f]",
  "#3d9428": "bg-[#3d9428]",
  "#5bc48b": "bg-[#5bc48b]",
  "#5BC48B": "bg-[#5BC48B]",
  white: "bg-white",
};

const opacityMap: Record<string | number, string> = {
  0.08: "opacity-[0.08]",
  0.1: "opacity-10",
  0.12: "opacity-[0.12]",
};

export function DecorativeCircle({
  size = 160,
  color = "#5BC48B",
  opacity = 0.1,
  className = "",
}: Readonly<DecorativeCirclesProps>) {
  const mappedSize = sizeMap[size] || "w-40 h-40";
  const mappedColor = colorMap[color] || "bg-[#5BC48B]";
  const mappedOpacity = opacityMap[opacity] || "opacity-10";

  return (
    <div
      className={`rounded-full pointer-events-none absolute ${mappedSize} ${mappedColor} ${mappedOpacity} ${className}`}
    />
  );
}
