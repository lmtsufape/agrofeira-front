import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCadastrarItem } from "../useCadastrarItem";
import { itemService } from "@/features/itens/api/itens.service";
import { useRouter } from "next/navigation";
import React from "react";

vi.mock("@/features/itens/api/itens.service");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useCadastrarItem", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve validar campos obrigatórios", async () => {
    const { result } = renderHook(() => useCadastrarItem());

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.erro).toBe("Todos os campos são obrigatórios!");
  });

  it("deve chamar itemService.create e redirecionar", async () => {
    (itemService.create as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCadastrarItem());

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "Tomate" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "unit", value: "kg" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "price", value: "5.50" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "categoriaId", value: "cat-1" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(itemService.create).toHaveBeenCalledWith({
      nome: "Tomate",
      unidadeMedida: "kg",
      categoriaId: "cat-1",
      valor: "5.50",
    });
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
