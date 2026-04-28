"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { refreshAuthToken, logoutUser } from "../api/auth.service";
import { setAuthCookies, clearAuthCookies } from "../actions/auth.actions";
import { setClientToken } from "@/lib/api-client";

interface JwtPayload {
  id: string;
  nome: string;
  email: string;
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

interface AuthInitialData {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
}

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialData,
}: Readonly<{ children: ReactNode; initialData: AuthInitialData }>) {
  const [token, setToken] = useState<string | null>(initialData.token);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    initialData.refreshToken,
  );
  const [username, setUsername] = useState<string | null>(initialData.username);
  const [isInitialized] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * SINCRONIZAÇÃO IMEDIATA
   * useLayoutEffect roda de forma síncrona após todas as mutações do DOM,
   * mas antes da pintura da tela e ANTES dos useEffects dos componentes filhos.
   */
  useLayoutEffect(() => {
    setClientToken(initialData.token);
  }, [initialData.token]);

  // Mantém sincronizado em mudanças posteriores (login/refresh)
  useEffect(() => {
    setClientToken(token);
  }, [token]);

  const clearAuthData = useCallback(async () => {
    await clearAuthCookies();
    setClientToken(null);
    setToken(null);
    setRefreshToken(null);
    setUsername(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("agrofeira_itens_opcoes");
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token;
    const currentRefreshToken = refreshToken;

    await clearAuthData();

    if (currentToken && currentRefreshToken) {
      logoutUser(currentToken, currentRefreshToken).catch((err) => {
        console.warn("Falha ao notificar logout no servidor:", err.message);
      });
    }

    window.location.href = "/login";
  }, [token, refreshToken, clearAuthData]);

  const login = useCallback(
    async (newToken: string, newRefreshToken: string) => {
      try {
        const decoded = jwtDecode<JwtPayload>(newToken);
        await setAuthCookies(newToken, newRefreshToken, decoded.nome);

        setToken(newToken);
        setRefreshToken(newRefreshToken);
        setUsername(decoded.nome);
        setClientToken(newToken);
      } catch (err) {
        console.error("Erro ao decodificar novo token:", err);
      }
    },
    [],
  );

  const scheduleTokenRefresh = useCallback(
    (authToken: string) => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      try {
        const decoded = jwtDecode<JwtPayload>(authToken);
        const expiresIn = decoded.exp * 1000 - Date.now();
        const refreshTime = Math.max(expiresIn - 60 * 1000, 0);

        refreshTimeoutRef.current = setTimeout(async () => {
          if (refreshToken) {
            try {
              const response = await refreshAuthToken(refreshToken);
              await login(response.token, response.refreshToken);
            } catch (err) {
              console.error("Falha no refresh do token:", err);
              await logout();
            }
          }
        }, refreshTime);
      } catch (err) {
        console.error("Erro ao decodificar token para agendamento:", err);
      }
    },
    [refreshToken, logout, login],
  );

  useEffect(() => {
    if (token) {
      scheduleTokenRefresh(token);
    }
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [token, scheduleTokenRefresh]);

  const contextValue = useMemo(
    () => ({
      token,
      refreshToken,
      username,
      login,
      logout,
      isAuthenticated: !!token,
      isInitialized,
    }),
    [token, refreshToken, username, login, logout, isInitialized],
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
