"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/features/auth/services/auth.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export function useLoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser({ username, password });
      login(response.token, response.username);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    handleSubmit,
  };
}
