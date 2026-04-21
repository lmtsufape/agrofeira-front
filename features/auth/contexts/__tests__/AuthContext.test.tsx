import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import React from "react";

describe("AuthContext", () => {
  beforeEach(() => {
    // Limpa os cookies antes de cada teste
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    vi.clearAllMocks();
  });

  it("deve inicializar como não autenticado quando não há cookies", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBe(null);
  });

  it("deve realizar login e persistir nos cookies", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("token-123", "admin_user");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("token-123");
    expect(result.current.username).toBe("admin_user");
    expect(document.cookie).toContain("agrofeira_token=token-123");
    expect(document.cookie).toContain("agrofeira_username=admin_user");
  });

  it("deve realizar logout e remover cookies", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("token-123", "user");
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBe(null);
    expect(document.cookie).not.toContain("agrofeira_token=token-123");
  });

  it("deve lançar erro se useAuth for usado fora do AuthProvider", () => {
    // Suprime o log de erro do console para este teste específico
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth deve ser usado dentro de AuthProvider",
    );

    consoleSpy.mockRestore();
  });
});
