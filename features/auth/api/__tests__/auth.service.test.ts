import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginUser, forgotPassword } from "../auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("loginUser", () => {
    it("deve autenticar com sucesso usuários válidos", async () => {
      const loginPromise = loginUser({ username: "admin", password: "123456" });

      // Avança o timer do setTimeout simulado
      vi.runAllTimers();

      const response = await loginPromise;
      expect(response.username).toBe("admin");
      expect(response.token).toBeDefined();
    });

    it("deve lançar erro para credenciais inválidas", async () => {
      const loginPromise = loginUser({ username: "wrong", password: "wrong" });
      vi.runAllTimers();

      await expect(loginPromise).rejects.toThrow("Usuário ou senha inválidos");
    });
  });

  describe("forgotPassword", () => {
    it("deve processar recuperação para usuário existente", async () => {
      const promise = forgotPassword("admin");
      vi.runAllTimers();

      await expect(promise).resolves.toBeUndefined();
    });

    it("deve lançar erro para usuário inexistente", async () => {
      const promise = forgotPassword("non_existent");
      vi.runAllTimers();

      await expect(promise).rejects.toThrow(
        "Usuário não encontrado em nossa base de dados",
      );
    });
  });
});
