import { describe, it, expect } from "vitest";
import { getStatusColor } from "../status";

describe("status utils", () => {
  describe("getStatusColor", () => {
    it("deve retornar cores verdes para status de sucesso (concluído, entregue, finalizado)", () => {
      const statusSucesso = ["concluído", "ENTREGUE", "Finalizado"];
      statusSucesso.forEach((status) => {
        const color = getStatusColor(status);
        expect(color.text).toBe("text-[#1B6112]");
        expect(color.bg).toBe("bg-[#E8F5EC]");
      });
    });

    it("deve retornar cores amarelas para status pendentes (aguardando, pendente)", () => {
      const statusPendentes = ["aguardando", "Pendente"];
      statusPendentes.forEach((status) => {
        const color = getStatusColor(status);
        expect(color.text).toBe("text-[#B38600]");
        expect(color.bg).toBe("bg-[#FFF8E6]");
      });
    });

    it("deve retornar cores vermelhas para status de erro/cancelamento (cancelado, recusado)", () => {
      const statusErro = ["cancelado", "Recusado"];
      statusErro.forEach((status) => {
        const color = getStatusColor(status);
        expect(color.text).toBe("text-[#C62828]");
        expect(color.bg).toBe("bg-[#FFEBEE]");
      });
    });

    it("deve retornar cores roxas para status desconhecidos", () => {
      const color = getStatusColor("desconhecido");
      expect(color.text).toBe("text-[#6A1B9A]");
      expect(color.bg).toBe("bg-[#F3E5F5]");
    });

    it("deve ser case-insensitive", () => {
      const color1 = getStatusColor("PENDENTE");
      const color2 = getStatusColor("pendente");
      expect(color1).toEqual(color2);
    });
  });
});
