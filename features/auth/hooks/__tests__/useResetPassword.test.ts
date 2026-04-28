import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useResetPassword } from "../useResetPassword";
import { resetPassword } from "@/features/auth/api/auth.service";
import { useSearchParams } from "next/navigation";
import React from "react";

vi.mock("@/features/auth/api/auth.service");
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("useResetPassword hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
  });

  it("deve inicializar com token da URL e marcar hasTokenFromUrl como true", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue("token-123"),
    });

    const { result } = renderHook(() => useResetPassword());

    expect(result.current.token).toBe("token-123");
    expect(result.current.hasTokenFromUrl).toBe(true);
  });

  it("deve inicializar vazio se não houver token na URL", () => {
    const { result } = renderHook(() => useResetPassword());

    expect(result.current.token).toBe("");
    expect(result.current.hasTokenFromUrl).toBe(false);
  });

  it("deve processar redefinição com sucesso", async () => {
    (resetPassword as Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useResetPassword());

    act(() => {
      result.current.setToken("token-uuid");
      result.current.setNovaSenha("senha123");
      result.current.setConfirmarSenha("senha123");
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(resetPassword).toHaveBeenCalledWith("token-uuid", "senha123");
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe("");
  });

  it("deve validar senhas divergentes", async () => {
    const { result } = renderHook(() => useResetPassword());

    act(() => {
      result.current.setNovaSenha("senha123");
      result.current.setConfirmarSenha("senha456");
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(resetPassword).not.toHaveBeenCalled();
    expect(result.current.error).toBe("As senhas não coincidem");
  });

  it("deve validar comprimento mínimo da senha", async () => {
    const { result } = renderHook(() => useResetPassword());

    act(() => {
      result.current.setNovaSenha("123");
      result.current.setConfirmarSenha("123");
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.error).toBe(
      "A senha deve ter pelo menos 6 caracteres",
    );
  });
});
