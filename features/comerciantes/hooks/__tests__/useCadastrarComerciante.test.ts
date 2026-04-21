import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCadastrarComerciante } from "../useCadastrarComerciante";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";
import { useRouter } from "next/navigation";
import React from "react";

vi.mock("@/features/comerciantes/api/comerciantes.service");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useCadastrarComerciante", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve validar campos obrigatórios (nome, telefone, email)", async () => {
    const { result } = renderHook(() => useCadastrarComerciante());

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.erro).toBe(
      "Nome, Telefone e Email são obrigatórios!",
    );
  });

  it("deve chamar comercianteService.create com o payload correto", async () => {
    (comercianteService.create as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCadastrarComerciante());

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "Banca do João" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "phone", value: "81999998888" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "email", value: "joao@banca.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(comercianteService.create).toHaveBeenCalledWith({
      nome: "Banca do João",
      telefone: "81999998888",
      email: "joao@banca.com",
    });
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
