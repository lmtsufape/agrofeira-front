import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { clienteService } from "../clientes.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("clienteService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar o endpoint correto para listar todos", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await clienteService.getAll();
    expect(apiClient).toHaveBeenCalledWith("/api/v1/clientes", {});
  });

  it("deve chamar o endpoint correto para buscar por ID", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await clienteService.getById("123");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/clientes/123", {});
  });

  it("deve chamar o endpoint correto para criar um cliente", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const newCliente = { nome: "João", email: "j@j.com" };
    await clienteService.create(newCliente);
    expect(apiClient).toHaveBeenCalledWith("/api/v1/clientes", {
      method: "POST",
      body: JSON.stringify(newCliente),
    });
  });

  it("deve chamar o endpoint correto para atualizar um cliente", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const updateData = { nome: "João Silva" };
    await clienteService.update("123", updateData);
    expect(apiClient).toHaveBeenCalledWith("/api/v1/clientes/123", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  });

  it("deve chamar o endpoint correto para deletar um cliente", async () => {
    (apiClient as Mock).mockResolvedValue(undefined);
    await clienteService.delete("123");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/clientes/123", {
      method: "DELETE",
    });
  });
});
