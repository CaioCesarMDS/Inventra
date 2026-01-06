import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["src/tests/env.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
      exclude: [
        "src/tests/**",
        "src/core/db/**",
        "src/core/errors/**",
        "src/infra/**",
        "src/env.ts",
        "src/server.ts",
        "**/*.types.ts",
        "**/*.spec.ts",
      ],
    },
  },
});
