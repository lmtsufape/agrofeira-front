"use client";

import {
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { useForgotPassword } from "../hooks/useForgotPassword";

export function ForgotPasswordForm() {
  const { username, setUsername, error, success, loading, handleSubmit } =
    useForgotPassword();

  if (success) {
    return (
      <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 border border-green-100">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#1a3d1f] mb-3">
          Solicitação Enviada!
        </h2>
        <p className="text-[#8aaa8d] text-sm leading-relaxed mb-8">
          Se o usuário{" "}
          <span className="font-semibold text-[#1a3d1f]">{username}</span>{" "}
          estiver cadastrado, você receberá um link de recuperação em seu e-mail
          em instantes.
        </p>
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm font-semibold text-[#1a4731] hover:underline"
        >
          <ArrowLeft size={16} />
          Voltar para o Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-[#1a3d1f] mb-2">
          Recuperar Senha
        </h2>
        <p className="text-[#8aaa8d] text-sm leading-relaxed">
          Informe seu nome de usuário para que possamos enviar as instruções de
          recuperação.
        </p>
      </div>

      <Input
        label="Usuário"
        placeholder="Digite seu usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        icon={<User size={18} />}
      />

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-red-700 text-sm animate-shake">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-[#1a4731] hover:bg-[#153d28] active:bg-[#0f2d1a] text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {loading ? (
          "Processando..."
        ) : (
          <>
            Enviar Instruções
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      <div className="flex justify-center mt-2">
        <Link
          href="/login"
          className="flex items-center gap-2 text-xs font-medium text-[#2d7a4f] hover:underline"
        >
          <ArrowLeft size={14} />
          Lembrei minha senha
        </Link>
      </div>
    </form>
  );
}
