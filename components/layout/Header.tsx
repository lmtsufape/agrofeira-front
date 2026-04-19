"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";

import { DecorativeCircle } from "@/components/ui/DecorativeCircle";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <header className="fixed top-0 z-50 w-full h-15 shadow-[0px_4px_24px_rgba(0,61,4,0.25)] overflow-hidden bg-gradient-to-br from-[#003D04] via-[#1B6112] to-[#2D7A1F]">
      {/* Círculos decorativos */}
      <DecorativeCircle size={160} className="-left-10 -top-10" />
      <DecorativeCircle size={144} className="-right-6 -top-6" />

      {/* Conteúdo */}
      <div className="relative h-full flex items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-3 z-10 transition-all hover:scale-105"
        >
          <div className="flex items-center justify-center rounded-xl w-10 h-10 bg-white/15 p-2">
            <Image src="/logo.png" alt="Logo EcoFeira" width={32} height={32} />
          </div>
          <div className="text-white text-[18.4px] font-bold leading-[18.4px]">
            EcoFeira
          </div>
        </button>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl z-10 transition-all bg-white/10 border border-white/18 hover:bg-white/20"
        >
          <LogOut size={15} className="text-white/85" />
          <span className="text-white/85 text-sm font-semibold">Sair</span>
        </button>
      </div>
    </header>
  );
}
