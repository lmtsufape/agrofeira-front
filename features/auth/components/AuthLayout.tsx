import { LoginSidePanel } from "./LoginSidePanel";
import { LoginLogo } from "./LoginLogo";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0faf4]">
      {/* Lado esquerdo — visível só em md+ */}
      <LoginSidePanel />

      {/* Lado direito — formulário */}
      <div className="flex-1 md:w-[520px] md:flex-none flex items-center justify-center px-6 py-12 md:px-10">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <LoginLogo />

          {/* Formulário/Conteúdo Dinâmico */}
          {children}

          <p className="text-center text-xs text-gray-400 mt-8">
            {`© ${new Date().getFullYear()} Agro Feira · Associação Agroecológica · Todos os direitos`}
            reservados
          </p>
        </div>
      </div>
    </div>
  );
}
