"use client";

import { useState } from "react";
import { forgotPassword } from "@/features/auth/api/auth.service";

export function useForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await forgotPassword(identifier);
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
    identifier,
    setIdentifier,
    error,
    success,
    loading,
    handleSubmit,
  };
}
