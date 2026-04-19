"use client";

import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoCard({
  icon: Icon,
  label,
  value,
}: Readonly<InfoCardProps>) {
  return (
    <div className="p-5 bg-white border border-[#EEF5EE] rounded-2xl shadow-[0_2px_10px_rgba(0,61,4,0.04)] flex items-start gap-4">
      <div className="w-10 h-10 bg-[#F0FAF3] rounded-full flex items-center justify-center shrink-0">
        <Icon size={20} className="text-[#5BC48B]" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.7rem] font-bold text-[#8AAA8D] uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-[1.05rem] font-bold text-[#1A3D1F] truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
