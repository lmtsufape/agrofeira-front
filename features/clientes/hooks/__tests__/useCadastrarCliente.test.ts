import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCadastrarCliente } from "../useCadastrarCliente";
import { clienteService } from "@/features/clientes/api/clientes.service";
import { useRouter } from "next/navigation";
import React from "react";

vi.mock("@/features/clientes/api/clientes.service");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useCadastrarCliente", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve inicializar com campos vazios", () => {
    const { result } = renderHook(() => useCadastrarCliente());
    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.email).toBe("");
  });

  it("deve validar campos obrigatórios", async () => {
    const { result } = renderHook(() => useCadastrarCliente());

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.erro).toBe(
      "Nome, Telefone, Email e CPF são obrigatórios!",
    );
    expect(clienteService.create).not.toHaveBeenCalled();
  });

  it("deve cadastrar cliente com sucesso e redirecionar", async () => {
    (clienteService.create as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCadastrarCliente());

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "João" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "phone", value: "1199999999" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "email", value: "joao@email.com" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "cpf", value: "12345678900" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(clienteService.create).toHaveBeenCalledWith({
      nome: "João",
      telefone: "1199999999",
      email: "joao@email.com",
      cpf: "12345678900",
    });
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
