import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../../api/auth.service";
import { setAuthCookies, clearAuthCookies } from "../../actions/auth.actions";
import { setClientToken } from "@/lib/api-client";
import React from "react";

vi.mock("jwt-decode");
vi.mock("../../api/auth.service");
vi.mock("../../actions/auth.actions");
vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual("@/lib/api-client");
  return {
    ...actual,
    setClientToken: vi.fn(),
  };
});

describe("AuthContext", () => {
  const emptyInitialData = {
    token: null,
    refreshToken: null,
    username: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock padrão para jwtDecode
    (jwtDecode as Mock).mockReturnValue({
      nome: "admin_user",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
  });

  it("deve sincronizar o token com o api-client IMEDIATAMENTE se fornecido na carga", () => {
    const authData = {
      token: "initial-tk",
      refreshToken: "initial-rf",
      username: "initial-un",
    };

    renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialData={authData}>{children}</AuthProvider>
      ),
    });

    expect(setClientToken).toHaveBeenCalledWith("initial-tk");
  });

  it("deve realizar login, chamar setAuthCookies e atualizar api-client", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialData={emptyInitialData}>{children}</AuthProvider>
      ),
    });

    await act(async () => {
      await result.current.login("token-123", "refresh-456");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(setAuthCookies).toHaveBeenCalledWith(
      "token-123",
      "refresh-456",
      "admin_user",
    );
    expect(setClientToken).toHaveBeenCalledWith("token-123");
  });

  it("deve realizar logout, limpar estado local e notificar servidor", async () => {
    (logoutUser as Mock).mockResolvedValue(undefined);
    const initialWithAuth = {
      token: "token-123",
      refreshToken: "refresh-456",
      username: "admin_user",
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialData={initialWithAuth}>{children}</AuthProvider>
      ),
    });

    const originalLocation = window.location;
    // @ts-expect-error - mock location
    delete window.location;
    window.location = { ...originalLocation, href: "" };

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(clearAuthCookies).toHaveBeenCalled();
    expect(setClientToken).toHaveBeenCalledWith(null);

    window.location = originalLocation;
  });
});
