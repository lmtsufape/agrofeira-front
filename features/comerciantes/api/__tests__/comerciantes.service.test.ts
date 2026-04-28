import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { comercianteService } from "../comerciantes.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("comercianteService", () => {
  const endpoint = "/api/v1/comerciantes";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar o endpoint correto para listar todos", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await comercianteService.getAll();
    expect(apiClient).toHaveBeenCalledWith(endpoint, {});
  });

  it("deve chamar o endpoint correto para buscar por ID", async () => {
    (apiClient as Mock).mockResolvedValue({});
    await comercianteService.getById("777");
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}/777`, {});
  });

  it("deve chamar o endpoint correto para criar um comerciante", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const data = { nome: "Jose", email: "j@m.com", telefone: "123" };
    await comercianteService.create(data);
    expect(apiClient).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("deve chamar o endpoint correto para atualizar um comerciante", async () => {
    (apiClient as Mock).mockResolvedValue({});
    const data = { nome: "Jose Silva" };
    await comercianteService.update("777", data);
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}/777`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("deve chamar o endpoint correto para deletar um comerciante", async () => {
    (apiClient as Mock).mockResolvedValue(undefined);
    await comercianteService.delete("777");
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}/777`, {
      method: "DELETE",
    });
  });
});
