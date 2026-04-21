import { describe, it, expect } from "vitest";
import { formatarData, formatarHora, formatarMoeda } from "../formatters";

describe("formatters", () => {
  describe("formatarData", () => {
    it("deve formatar uma string de data corretamente no padrão pt-BR", () => {
      const data = "2024-12-25T10:00:00Z";
      // O resultado depende do timezone do ambiente, mas o formato deve ser DD/MM/AAAA
      const resultado = formatarData(data);
      expect(resultado).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("deve lidar com datas inválidas retornando 'Invalid Date' (comportamento padrão do Date)", () => {
      expect(formatarData("data-invalida")).toBe("Invalid Date");
    });
  });

  describe("formatarHora", () => {
    it("deve formatar uma string de data para extrair a hora corretamente", () => {
      const data = "2024-12-25T14:30:00Z";
      const resultado = formatarHora(data);
      expect(resultado).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("formatarMoeda", () => {
    it("deve formatar um número para o padrão de moeda Real (BRL)", () => {
      const valor = 1250.5;
      const resultado = formatarMoeda(valor);
      // O NBSP (\u00a0) é comumente usado entre o símbolo e o valor
      expect(resultado).toMatch(/R\$\s?1\.250,50/);
    });

    it("deve formatar zero corretamente", () => {
      const resultado = formatarMoeda(0);
      expect(resultado).toMatch(/R\$\s?0,00/);
    });

    it("deve formatar valores negativos", () => {
      const resultado = formatarMoeda(-50);
      expect(resultado).toMatch(/-R\$\s?50,00/);
    });
  });
});
