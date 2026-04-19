"use client";

import { useState } from "react";
import { forgotPassword } from "@/features/auth/services/auth.service";

export function useForgotPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await forgotPassword(username);
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
    username,
    setUsername,
    error,
    success,
    loading,
    handleSubmit,
  };
}
