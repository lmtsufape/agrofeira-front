import { describe, it, expect } from "vitest";
import manifest from "../manifest";

describe("Web App Manifest", () => {
  it("deve retornar a configuração correta do manifest", () => {
    const config = manifest();

    expect(config.name).toBe("Agro Feira");
    expect(config.short_name).toBe("Agro Feira");
    expect(config.start_url).toBe("/");
    expect(config.display).toBe("standalone");
    expect(config.background_color).toBe("#f6faf4");
    expect(config.theme_color).toBe("#003d04");
  });

  it("deve conter os ícones obrigatórios para PWA (any e maskable)", () => {
    const config = manifest();
    expect(config.icons).toHaveLength(4);

    const sizes = config.icons?.map((i) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");

    const purposes = config.icons?.map((i) => i.purpose);
    expect(purposes).toContain("any");
    expect(purposes).toContain("maskable");
  });
});
