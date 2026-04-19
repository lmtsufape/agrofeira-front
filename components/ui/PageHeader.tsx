"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
}: Readonly<PageHeaderProps>) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleBack}
        title="Voltar"
        aria-label="Voltar"
        className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shrink-0 bg-white border border-[rgba(0,61,4,0.1)] shadow-[0_2px_10px_rgba(0,61,4,0.12)] hover:bg-gray-50"
      >
        <ArrowLeft size={17} className="text-[#003d04]" />
      </button>
      <div>
        <h1 className="text-[#1a3d1f] font-bold text-[1.35rem] leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-[#8aaa8d] text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}
