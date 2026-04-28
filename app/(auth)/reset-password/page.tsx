"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { DecorativeCircle } from "@/components/ui/DecorativeCircle";

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#f6faf4_0%,#edf5eb_100%)] px-4">
      {/* Elementos Decorativos (estilo 404) */}
      <DecorativeCircle
        size={160}
        color="#003d04"
        opacity={0.05}
        className="-top-20 -left-20"
      />
      <DecorativeCircle
        size={240}
        color="#5bc48b"
        opacity={0.05}
        className="-bottom-24 -right-24"
      />

      <div className="relative z-10 w-full max-w-sm">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4731]"></div>
            </div>
          }
        >
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,61,4,0.06)] animate-in fade-in zoom-in duration-500">
            <ResetPasswordForm />
          </div>
        </Suspense>

        {/* Rodapé simples (estilo 404) */}
        <div className="text-center mt-8 text-[10px] font-medium text-[#aacaad] uppercase tracking-[0.2em]">
          Agro Feira · Plataforma Agroecológica
        </div>
      </div>
    </div>
  );
}
