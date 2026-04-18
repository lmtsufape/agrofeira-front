"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className="fixed top-0 z-50 w-full h-15"
      style={{
        background:
          "linear-gradient(135deg, #003D04 0%, #1B6112 60%, #2D7A1F 100%)",
        boxShadow: "0px 4px 24px rgba(0, 61, 4, 0.25)",
        overflow: "hidden",
      }}
    >
      {/* Círculos decorativos */}
      <div
        style={{
          width: "160px",
          height: "160px",
          left: "-40px",
          top: "-40px",
          position: "absolute",
          opacity: 0.1,
          background: "#5BC48B",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          width: "144px",
          height: "144px",
          left: "1000px",
          top: "-24px",
          position: "absolute",
          opacity: 0.1,
          background: "#5BC48B",
          borderRadius: "50%",
        }}
      />

      {/* Conteúdo */}
      <div className="relative h-full flex items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 z-10 transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            background: "none",
            border: "none",
            padding: "0",
          }}
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "8px",
            }}
          >
            <Image src="/logo.png" alt="Logo EcoFeira" width={32} height={32} />
          </div>
          <div
            style={{
              color: "white",
              fontSize: "18.4px",
              //fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              lineHeight: "18.4px",
            }}
          >
            EcoFeira
          </div>
        </button>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl z-10 transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.10)",
            border: "0.8px solid rgba(255, 255, 255, 0.18)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255, 255, 255, 0.20)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255, 255, 255, 0.10)";
          }}
        >
          <LogOut size={15} style={{ color: "rgba(255, 255, 255, 0.85)" }} />
          <span
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "14px",
              //fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
            }}
          >
            Sair
          </span>
        </button>
      </div>
    </header>
  );
}
