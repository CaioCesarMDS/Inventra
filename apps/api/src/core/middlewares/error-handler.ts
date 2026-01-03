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
  if (hasZodFastifySchemaValidationErrors(error)) {
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
      code: error.statusCode,
      message: error.message,
    });
  }

  if (isResponseSerializationError(error)) {
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

  if (error instanceof Error) {
    request.log.error(
      { err: error, method: request.method, url: request.url },
      "Unexpected error",
    );
  } else {
    request.log.error(
      { thrown: error, method: request.method, url: request.url },
      "Unexpected non-error thrown",
    );
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
};
