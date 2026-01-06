import { describe, expect, it } from "vitest";
import { buildApp } from "@/app";

describe("App bootstrap", () => {
  it("should build and initialize the fastify instance correctly", async () => {
    const app = buildApp();

    try {
      await app.ready();
      expect(app.server).toBeDefined();
      expect(app.validatorCompiler).toBeDefined();
    } finally {
      await app.close();
    }
  });
});
