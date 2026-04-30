"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/features/auth/api/auth.service";

export function useResetPassword() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") ?? "";

  const [token, setToken] = useState(tokenParam);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasTokenFromUrl] = useState(!!tokenParam);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, novaSenha);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar solicitação",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}
