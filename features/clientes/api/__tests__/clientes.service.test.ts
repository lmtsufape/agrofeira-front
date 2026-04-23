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
    expect(apiClient).toHaveBeenCalledWith("/api/clientes");
  });

  it("deve chamar o endpoint correto para buscar por ID", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await clienteService.getById("123");
    expect(apiClient).toHaveBeenCalledWith("/api/clientes/123");
  });

  it("deve chamar o endpoint correto para criar", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const novoCliente = {
      nome: "Teste",
      email: "teste@email.com",
      telefone: "123",
      cpf: "123",
    };
    await clienteService.create(novoCliente);
    expect(apiClient).toHaveBeenCalledWith(
      "/api/clientes",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(novoCliente),
      }),
    );
  });

  it("deve chamar o endpoint correto para atualizar", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const dados = { nome: "Atualizado" };
    await clienteService.update("123", dados);
    expect(apiClient).toHaveBeenCalledWith(
      "/api/clientes/123",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(dados),
      }),
    );
  });

  it("deve chamar o endpoint correto para deletar", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await clienteService.delete("123");
    expect(apiClient).toHaveBeenCalledWith(
      "/api/clientes/123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
