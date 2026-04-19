"use client";

import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Usuário"
        placeholder="Digite seu usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        icon={<User size={18} />}
      />

      <Input
        label="Senha"
        type={showPassword ? "text" : "password"}
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        icon={<Lock size={18} />}
        rightElement={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-400 hover:text-gray-600 transition"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <div className="flex justify-end -mt-2">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-[#2d7a4f] hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

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
          "Entrando..."
        ) : (
          <>
            Entrar
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>
    </form>
  );
}
