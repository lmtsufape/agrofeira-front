"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

const TOKEN_KEY = "agrofeira_token";
const USERNAME_KEY = "agrofeira_username";

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Helpers de Cookies no Cliente
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState<string | null>(() => getCookie(TOKEN_KEY));
  const [username, setUsername] = useState<string | null>(() =>
    getCookie(USERNAME_KEY),
  );
  const [isInitialized] = useState(true);

  function login(token: string, username: string) {
    setCookie(TOKEN_KEY, token);
    setCookie(USERNAME_KEY, username);
    setToken(token);
    setUsername(username);
  }

  function logout() {
    deleteCookie(TOKEN_KEY);
    deleteCookie(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }

  const contextValue = useMemo(
    () => ({
      token,
      username,
      login,
      logout,
      isAuthenticated: !!token,
      isInitialized,
    }),
    [token, username, isInitialized],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
