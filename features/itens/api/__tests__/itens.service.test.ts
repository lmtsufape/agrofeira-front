import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { itemService } from "../itens.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("itemService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar o endpoint correto para listar todos", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await itemService.getAll();
    expect(apiClient).toHaveBeenCalledWith("/api/itens");
  });

  it("deve chamar o endpoint correto para buscar por ID", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await itemService.getById("item-1");
    expect(apiClient).toHaveBeenCalledWith("/api/itens/item-1");
  });

  it("deve chamar o endpoint correto para criar", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const novoItem = { nome: "Banana", valor: "5.00", unidadeMedida: "kg" };
    await itemService.create(novoItem);
    expect(apiClient).toHaveBeenCalledWith(
      "/api/itens",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(novoItem),
      }),
    );
  });

  it("deve chamar o endpoint correto para atualizar", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const dados = { valor: "6.00" };
    await itemService.update("item-1", dados);
    expect(apiClient).toHaveBeenCalledWith(
      "/api/itens/item-1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(dados),
      }),
    );
  });

  it("deve chamar o endpoint correto para deletar", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await itemService.delete("item-1");
    expect(apiClient).toHaveBeenCalledWith(
      "/api/itens/item-1",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
