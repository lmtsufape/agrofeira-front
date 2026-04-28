"use client";

import { useState } from "react";
import {
  KeyRound,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Fingerprint,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { useResetPassword } from "../hooks/useResetPassword";

export function ResetPasswordForm() {
  const {
    token,
    setToken,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    error,
    success,
    loading,
    hasTokenFromUrl,
    handleSubmit,
  } = useResetPassword();

  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  if (success) {
    return (
      <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 border border-green-100">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#1a3d1f] mb-3">
          Senha Redefinida!
        </h2>
        <p className="text-[#8aaa8d] text-sm leading-relaxed mb-8 px-4">
          Sua senha foi alterada com sucesso. Você já pode utilizar sua nova
          credencial para acessar o sistema.
        </p>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-gradient-to-br from-[#1a4731] to-[#2d7a4f] text-white shadow-lg hover:shadow-green-900/20 active:scale-[0.98]"
        >
          <ArrowLeft size={18} />
          Ir para o Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-[#1a3d1f] mb-2 tracking-tight">
          Nova Senha
        </h2>
        <p className="text-[#8aaa8d] text-sm leading-relaxed">
          {hasTokenFromUrl
            ? "Crie uma senha forte para sua conta."
            : "Informe o token e crie sua nova senha."}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Token de Verificação"
          placeholder="Digite o UUID recebido"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          readOnly={hasTokenFromUrl}
          className={
            hasTokenFromUrl
              ? "bg-gray-50/50 cursor-not-allowed text-gray-500"
              : ""
          }
          icon={<Fingerprint size={18} />}
        />

        <Input
          label="Sua Nova Senha"
          type={showNovaSenha ? "text" : "password"}
          placeholder="Digite a nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          icon={<KeyRound size={18} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowNovaSenha(!showNovaSenha)}
              className="text-gray-400 hover:text-[#1a4731] transition-colors p-1"
              tabIndex={-1}
            >
              {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Input
          label="Confirme a Senha"
          type={showConfirmarSenha ? "text" : "password"}
          placeholder="Repita a nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          icon={<KeyRound size={18} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              className="text-gray-400 hover:text-[#1a4731] transition-colors p-1"
              tabIndex={-1}
            >
              {showConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
          <AlertCircle size={18} className="shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-[#1a4731] to-[#2d7a4f] text-white font-bold text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(26,71,49,0.25)] hover:shadow-[0_6px_25px_rgba(26,71,49,0.35)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.98]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Salvar Nova Senha
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      <div className="flex justify-center border-t border-gray-100 pt-4">
        <Link
          href="/login"
          className="flex items-center gap-2 text-xs font-semibold text-[#2d7a4f] hover:underline"
        >
          <ArrowLeft size={14} />
          Voltar para o Login
        </Link>
      </div>
    </form>
  );
}
