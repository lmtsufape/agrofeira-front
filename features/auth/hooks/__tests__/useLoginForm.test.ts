import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useLoginForm } from "../useLoginForm";
import { loginUser } from "@/features/auth/api/auth.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

vi.mock("@/features/auth/api/auth.service");
vi.mock("@/features/auth/contexts/AuthContext");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useLoginForm", () => {
  const mockPush = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useAuth as Mock).mockReturnValue({ login: mockLogin });
  });

  it("deve inicializar com campos vazios", () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.username).toBe("");
    expect(result.current.password).toBe("");
  });

  it("deve alternar a visibilidade da senha", () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.showPassword).toBe(false);
    act(() => {
      result.current.togglePasswordVisibility();
    });
    expect(result.current.showPassword).toBe(true);
  });

  it("deve realizar login com sucesso e redirecionar", async () => {
    (loginUser as Mock).mockResolvedValue({
      token: "tk-123",
      username: "admin",
    });
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setUsername("admin");
      result.current.setPassword("123456");
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(loginUser).toHaveBeenCalledWith({
      username: "admin",
      password: "123456",
    });
    expect(mockLogin).toHaveBeenCalledWith("tk-123", "admin");
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
    expect(result.current.loading).toBe(false);
  });

  it("deve capturar erro ao falhar o login", async () => {
    (loginUser as Mock).mockRejectedValue(new Error("Credenciais inválidas"));
    const { result } = renderHook(() => useLoginForm());

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.error).toBe("Credenciais inválidas");
    expect(result.current.loading).toBe(false);
  });
});
