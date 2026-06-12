import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { repasseService } from "../repasses.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client");

describe("repasseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listar deve chamar o endpoint correto com paginação default", async () => {
    (apiClient as Mock).mockResolvedValue({ content: [] });
    await repasseService.listar();
    expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses?page=0&size=10");
  });

  it("listar deve chamar o endpoint correto com parâmetros customizados", async () => {
    (apiClient as Mock).mockResolvedValue({ content: [] });
    await repasseService.listar(2, 50);
    expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses?page=2&size=50");
  });

  it("listarPorFeira deve chamar o endpoint correto", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await repasseService.listarPorFeira("f123");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses/feira/f123");
  });

  it("totaisPorFeira deve chamar o endpoint correto", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await repasseService.totaisPorFeira("f123");
    expect(apiClient).toHaveBeenCalledWith(
      "/api/v1/repasses/feira/f123/totais",
    );
  });

  it("listarPorComerciante deve chamar o endpoint correto", async () => {
    (apiClient as Mock).mockResolvedValue([]);
    await repasseService.listarPorComerciante("c456");
    expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses/comerciante/c456");
  });

  it("registrar deve enviar POST com rateioResultadoId no corpo", async () => {
    (apiClient as Mock).mockResolvedValue({ id: "r789" });
    await repasseService.registrar("rr123");

    expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses", {
      method: "POST",
      body: JSON.stringify({ rateioResultadoId: "rr123" }),
    });
  });
});
