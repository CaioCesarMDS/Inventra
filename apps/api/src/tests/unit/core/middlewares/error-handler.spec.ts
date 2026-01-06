import type { FastifyInstance } from "fastify";
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { z } from "zod";
import { type AppError, ConflictError } from "@/core/errors";
import { createTestServer } from "@/tests/factories";
import { parseJsonBody } from "@/tests/utils/parseJsonBody";

describe("errorHandler", () => {
  let app: FastifyInstance;
  let logSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestServer();
    logSpy = vi.spyOn(app.log, "error");
  });

  describe("Domain Errors (AppError)", () => {
    it("should format ConflictError (409) with all custom fields", async () => {
      app.get("/error", async () => {
        throw new ConflictError("Domain conflict", "CONFLICT_CODE", "email");
      });

      const response = await app.inject({ method: "GET", url: "/error" });
      const body = parseJsonBody<AppError>(response);

      expect(response.statusCode).toBe(409);
      expect(body).toMatchObject({
        message: "Domain conflict",
        statusCode: 409,
        code: "CONFLICT_CODE",
        field: "email",
      });
    });
  });

  describe("Validation Errors (Zod)", () => {
    it("should format Fastify-Zod schema errors with unique issues", async () => {
      app.post(
        "/val",
        {
          schema: { body: z.object({ age: z.number() }) },
        },
        async () => ({}),
      );

      const response = await app.inject({
        method: "POST",
        url: "/val",
        payload: { age: "not-a-number" },
      });

      const body = parseJsonBody<AppError>(response);

      expect(response.statusCode).toBe(400);
      expect(body).toMatchObject({
        message: "Validation error",
        issues: expect.arrayContaining([
          expect.objectContaining({ path: "age" }),
        ]),
      });
    });

    it("should format manual ZodError (thrown inside service)", async () => {
      app.get("/manual", async () => {
        z.string().parse(123);
      });

      const response = await app.inject({ method: "GET", url: "/manual" });

      const body = parseJsonBody<AppError>(response);

      expect(response.statusCode).toBe(400);
      expect(body.message).toBe("Validation error");
    });
  });

  describe("System & Security Errors", () => {
    it("should handle response serialization mismatches and hide details", async () => {
      app.get(
        "/out",
        {
          schema: { response: { 200: z.object({ id: z.number() }) } },
        },
        async () => ({ id: "not-a-number" }),
      );

      const response = await app.inject({ method: "GET", url: "/out" });
      const body = parseJsonBody<AppError>(response);

      expect(response.statusCode).toBe(500);
      expect(body.message).toBe("Internal server error");
      expect(logSpy).toHaveBeenCalledWith(
        expect.anything(),
        "Response serialization error - Schema mismatch",
      );
    });

    it("should handle generic Errors and log the stack trace", async () => {
      app.get("/fatal", async () => {
        throw new Error("DB Crash");
      });

      const response = await app.inject({ method: "GET", url: "/fatal" });

      const body = parseJsonBody<AppError>(response);

      expect(response.statusCode).toBe(500);
      expect(body.message).toBe("Internal server error");
      expect(logSpy).toHaveBeenCalled();
    });

    it("should handle non-error (string) throws safely", async () => {
      app.get("/weird", async () => {
        throw "Surprise!";
      });

      const response = await app.inject({ method: "GET", url: "/weird" });
      const body = parseJsonBody<AppError>(response);

      expect(response.statusCode).toBe(500);
      expect(body.message).toBe("Internal server error");
    });
  });
});
