"use client";

import { LoginSidePanel } from "@/features/auth/components/LoginSidePanel";
import { LoginLogo } from "@/features/auth/components/LoginLogo";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0faf4]">
      {/* Lado esquerdo — visível só em md+ */}
      <LoginSidePanel />

      {/* Lado direito — formulário */}
      <div className="flex-1 md:w-[520px] md:flex-none flex items-center justify-center px-6 py-12 md:px-10">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <LoginLogo />

          {/* Formulário */}
          <ForgotPasswordForm />

          <p className="text-center text-xs text-gray-400 mt-8">
            {`© ${new Date().getFullYear()} EcoFeira · Associação Agroecológica · Todos os direitos`}
            reservados
          </p>
        </div>
      </div>
    </div>
  );
}
