import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCliente } from "../useCliente";
import { useRouter } from "next/navigation";
import useSWR from "swr";

vi.mock("swr");

vi.mock("../../api/clientes.service", () => ({
  clienteService: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useCliente", () => {
  const mockId = "client-123";
  const mockPush = vi.fn();
  const mockCliente = {
    id: mockId,
    nome: "João Silva",
    telefone: "1199999999",
    cep: "01001000",
    rua: "Praça da Sé",
    numero: "S/N",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useSWR as Mock).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
  });

  it("deve carregar dados do cliente ao montar se o ID for fornecido", async () => {
    (useSWR as Mock).mockReturnValue({
      data: mockCliente,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useCliente(mockId));

    await waitFor(() => {
      expect(result.current.cliente).toEqual(mockCliente);
    });

    expect(result.current.formData.nome).toBe("João Silva");
  });

  it("deve lidar com erro ao carregar cliente", async () => {
    (useSWR as Mock).mockReturnValue({
      data: undefined,
      error: new Error("Não encontrado"),
      isLoading: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useCliente(mockId));

    await waitFor(() => {
      expect(result.current.error).toBe("Não encontrado");
    });
  });

  it("deve atualizar formData via handleFormChange", async () => {
    (useSWR as Mock).mockReturnValue({
      data: mockCliente,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
    const { result } = renderHook(() => useCliente(mockId));

    act(() => {
      result.current.handleFormChange("nome", "José Santos");
    });

    expect(result.current.formData.nome).toBe("José Santos");
  });

  it("deve inicializar com campos vazios se o ID não for fornecido", () => {
    (useSWR as Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useCliente());

    expect(result.current.loading).toBe(false);
    expect(result.current.cliente).toBe(null);
    expect(result.current.formData.nome).toBe("");
  });
});
