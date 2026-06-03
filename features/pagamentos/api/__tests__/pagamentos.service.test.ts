import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { pagamentosService } from "../pagamentos.service";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client");

const mockPage = <T>(items: T[]) => ({
  content: items,
  totalElements: items.length,
  totalPages: 1,
  number: 0,
});

describe("pagamentosService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listarRelatorios", () => {
    it("deve chamar o endpoint correto e retornar o content da página", async () => {
      const mockRelatorios = [{ id: "1", titulo: "Relatório Junho" }];
      (apiClient as Mock).mockResolvedValueOnce(mockPage(mockRelatorios));

      const result = await pagamentosService.listarRelatorios();

      expect(apiClient).toHaveBeenCalledWith("/api/v1/relatorios");
      expect(result).toEqual(mockRelatorios);
    });
  });

  describe("listarRepasses", () => {
    it("deve chamar o endpoint correto e retornar o content da página", async () => {
      const mockRepasses = [
        { id: "r1", comerciante: { id: "c1", nome: "João" } },
      ];
      (apiClient as Mock).mockResolvedValueOnce(mockPage(mockRepasses));

      const result = await pagamentosService.listarRepasses();

      expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses");
      expect(result).toEqual(mockRepasses);
    });
  });

  describe("listarRepassesPorComerciante", () => {
    it("deve chamar o endpoint correto com o id do comerciante", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);

      await pagamentosService.listarRepassesPorComerciante("c1");

      expect(apiClient).toHaveBeenCalledWith("/api/v1/repasses/comerciante/c1");
    });
  });

  describe("obterPagamentoDetalhes", () => {
    it("deve retornar o primeiro repasse do comerciante", async () => {
      const mockRepasse = {
        id: "r1",
        comerciante: { id: "c1", nome: "João", email: null, telefone: null },
        valorBruto: 100,
        valorLiquido: 100,
        status: "PAGO",
      };
      (apiClient as Mock).mockResolvedValueOnce([mockRepasse]);

      const resultado = await pagamentosService.obterPagamentoDetalhes("c1");

      expect(resultado).toEqual({ repasse: mockRepasse });
    });

    it("deve lançar erro se nenhum repasse for encontrado", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);

      await expect(
        pagamentosService.obterPagamentoDetalhes("c1"),
      ).rejects.toThrow("Nenhum repasse encontrado para este comerciante");
    });
  });
});
