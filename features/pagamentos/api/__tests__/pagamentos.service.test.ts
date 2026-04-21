import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { pagamentosService } from "../pagamentos.service";
import { apiClient } from "@/lib/api-client";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";

vi.mock("@/lib/api-client");
vi.mock("@/features/comerciantes/api/comerciantes.service");

describe("pagamentosService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Relatórios", () => {
    it("deve listar relatorios por mes", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);
      await pagamentosService.listarRelatoriosPorMes(2026);
      expect(apiClient).toHaveBeenCalledWith(
        "/api/relatorios/por-mes?ano=2026",
      );
    });

    it("deve listar relatorios por comerciante e mes", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);
      await pagamentosService.listarRelatoriosPorComercianteMes("c1", 2026, 4);
      expect(apiClient).toHaveBeenCalledWith(
        "/api/relatorios/por-comerciante/mes?comercianteId=c1&ano=2026&mes=4",
      );
    });

    it("deve listar relatorios por comerciante e ano", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);
      await pagamentosService.listarRelatoriosPorComercianteAno("c1", 2026);
      expect(apiClient).toHaveBeenCalledWith(
        "/api/relatorios/por-comerciante/ano?comercianteId=c1&ano=2026",
      );
    });
  });

  describe("Repasses", () => {
    it("deve listar repasses sem parametros", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);
      await pagamentosService.listarRepasses();
      expect(apiClient).toHaveBeenCalledWith("/api/repasses");
    });

    it("deve listar repasses com mes e ano", async () => {
      (apiClient as Mock).mockResolvedValueOnce([]);
      await pagamentosService.listarRepasses(4, 2026);
      expect(apiClient).toHaveBeenCalledWith("/api/repasses?mes=4&ano=2026");
    });

    it("deve confirmar pagamento", async () => {
      (apiClient as Mock).mockResolvedValueOnce({});
      await pagamentosService.confirmarPagamento("c1");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/repasses/comerciantes/c1/confirmar",
        { method: "PUT" },
      );
    });

    it("deve obter detalhes do repasse", async () => {
      (apiClient as Mock).mockResolvedValueOnce({});
      await pagamentosService.obterDetalhesRepasse("c1");
      expect(apiClient).toHaveBeenCalledWith("/api/repasses/comerciantes/c1");
    });
  });

  describe("Composição", () => {
    it("deve compor detalhes do pagamento (comerciante + repasse)", async () => {
      const mockComerciante = { id: "c1", nome: "Comerciante 1" };
      const mockRepasse = { id: "r1", valor: 100 };

      (comercianteService.getById as Mock).mockResolvedValueOnce(
        mockComerciante,
      );
      (apiClient as Mock).mockResolvedValueOnce(mockRepasse);

      const resultado = await pagamentosService.obterPagamentoDetalhes("c1");

      expect(resultado).toEqual({
        comerciante: mockComerciante,
        repasse: mockRepasse,
      });
      expect(comercianteService.getById).toHaveBeenCalledWith("c1");
      expect(apiClient).toHaveBeenCalledWith("/api/repasses/comerciantes/c1");
    });

    it("deve propagar erro se uma das chamadas falhar", async () => {
      (comercianteService.getById as Mock).mockRejectedValueOnce(
        new Error("Erro Comerciante"),
      );

      await expect(
        pagamentosService.obterPagamentoDetalhes("c1"),
      ).rejects.toThrow("Erro Comerciante");
    });
  });
});
