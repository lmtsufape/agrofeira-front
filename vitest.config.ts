import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    exclude: ["node_modules", ".next", "out", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // include: [
      //   "app/**/*.ts",
      //   "app/**/*.tsx",
      //   "components/**/*.ts",
      //   "components/**/*.tsx",
      //   "features/**/*.ts",
      //   "features/**/*.tsx",
      //   "hooks/**/*.ts",
      //   "hooks/**/*.tsx",
      //   "utils/**/*.ts",
      //   "utils/**/*.tsx",
      // ],
      // exclude: ['src/types.ts'],
    },
  },
});
