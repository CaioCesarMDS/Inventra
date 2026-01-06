import type { FastifyInstance } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { AppError } from "@/core/errors/app-error";

export const errorHandler: FastifyInstance["errorHandler"] = (
  error,
  request,
  reply,
) => {
  const isObject = typeof error === "object" && error !== null;

  if (isObject && hasZodFastifySchemaValidationErrors(error)) {
    const uniqueIssues = new Map<
      string,
      { path: string; message: string | undefined }
    >();

    error.validation.forEach((issue) => {
      const path = issue.instancePath;
      if (!uniqueIssues.has(path)) {
        uniqueIssues.set(path, {
          path: path.replace(/^\//, ""),
          message: issue.message,
        });
      }
    });

    return reply.status(400).send({
      message: "Validation error",
      issues: Array.from(uniqueIssues.values()),
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      field: error.field,
      details: error.details,
    });
  }

  if (isObject && isResponseSerializationError(error)) {
    request.log.error(
      {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
      "Response serialization error - Schema mismatch",
    );

    return reply.status(500).send({
      message: "Internal server error",
    });
  }

  request.log.error(
    {
      err: error instanceof Error ? error : new Error(String(error)),
      method: request.method,
      url: request.url,
    },
    "Unexpected error",
  );

  return reply.status(500).send({
    message: "Internal server error",
  });
};
