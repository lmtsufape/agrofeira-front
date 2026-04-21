import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useForgotPassword } from "../useForgotPassword";
import { forgotPassword } from "@/features/auth/api/auth.service";
import React from "react";

vi.mock("@/features/auth/api/auth.service");

describe("useForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve processar solicitação de recuperação com sucesso", async () => {
    (forgotPassword as Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useForgotPassword());

    act(() => {
      result.current.setUsername("user_test");
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(forgotPassword).toHaveBeenCalledWith("user_test");
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe("");
  });

  it("deve lidar com falha na recuperação", async () => {
    (forgotPassword as Mock).mockRejectedValue(
      new Error("Usuário inexistente"),
    );
    const { result } = renderHook(() => useForgotPassword());

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Usuário inexistente");
  });
});
