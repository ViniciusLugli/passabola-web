/**
 * Configuração do Vitest
 * Setup para testes unitários e de integração
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: [
        "app/components/**/*.{js,jsx}",
        "app/context/**/*.{js,jsx}",
        "app/lib/**/*.{js,jsx}",
      ],
      exclude: [
        "node_modules/",
        ".next/",
        "app/components/**/index.{js,jsx}",
        "**/*.test.{js,jsx}",
        "**/*.spec.{js,jsx}",
      ],
      all: true,
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/app": path.resolve(__dirname, "./app"),
    },
  },
});
