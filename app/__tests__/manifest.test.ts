import { describe, it, expect } from "vitest";
import manifest from "../manifest";

describe("Web App Manifest", () => {
  it("deve retornar a configuração correta do manifest", () => {
    const config = manifest();

    expect(config.name).toBe("Agro Feira");
    expect(config.short_name).toBe("AgroFeira");
    expect(config.start_url).toBe("/");
    expect(config.display).toBe("standalone");
    expect(config.background_color).toBe("#f6faf4");
    expect(config.theme_color).toBe("#003d04");
  });

  it("deve conter os ícones obrigatórios para PWA", () => {
    const config = manifest();
    expect(config.icons).toHaveLength(2);
    expect(config.icons?.[0].sizes).toBe("192x192");
    expect(config.icons?.[1].sizes).toBe("512x512");
  });
});
