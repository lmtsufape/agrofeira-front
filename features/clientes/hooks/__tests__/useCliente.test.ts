import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCliente } from "../useCliente";
import { clienteService } from "../../api/clientes.service";
import { useRouter } from "next/navigation";

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
  });

  it("deve carregar dados do cliente ao montar se o ID for fornecido", async () => {
    (clienteService.getById as Mock).mockResolvedValue(mockCliente);

    const { result } = renderHook(() => useCliente(mockId));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cliente).toEqual(mockCliente);
    expect(result.current.formData.nome).toBe("João Silva");
  });

  it("deve lidar com erro ao carregar cliente", async () => {
    (clienteService.getById as Mock).mockRejectedValue(
      new Error("Não encontrado"),
    );

    const { result } = renderHook(() => useCliente(mockId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Não encontrado");
  });

  it("deve atualizar formData via handleFormChange", async () => {
    (clienteService.getById as Mock).mockResolvedValue(mockCliente);
    const { result } = renderHook(() => useCliente(mockId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleFormChange("nome", "José Santos");
    });

    expect(result.current.formData.nome).toBe("José Santos");
  });

  it("deve chamar service.update e redirecionar ao salvar", async () => {
    (clienteService.getById as Mock).mockResolvedValue(mockCliente);
    (clienteService.update as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useCliente(mockId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.saveChanges();
    });

    expect(result.current.savingChanges).toBe(false);
    expect(clienteService.update).toHaveBeenCalledWith(
      mockId,
      result.current.formData,
    );
    expect(mockPush).toHaveBeenCalledWith("/clientes");
  });

  it("deve inicializar com campos vazios se o ID não for fornecido", () => {
    const { result } = renderHook(() => useCliente());

    expect(result.current.loading).toBe(false);
    expect(result.current.cliente).toBe(null);
    expect(result.current.formData.nome).toBe("");
  });
});
