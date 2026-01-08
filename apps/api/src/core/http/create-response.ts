import {
  ConflictErrorSchema,
  ForbiddenErrorSchema,
  NotFoundErrorSchema,
  UnauthorizedErrorSchema,
  UnexpectedErrorSchema,
  ValidationErrorSchema,
} from "@inventra/shared";
import type { z } from "zod";

type HttpErrorStatus = "400" | "401" | "403" | "404" | "409";

export const createResponseSchema = (
  successSchema: z.ZodObject,
  options: {
    status?: number;
    includeErrors?: HttpErrorStatus[];
  } = {},
) => {
  const { status = 200, includeErrors = ["400"] } = options;

  const responses: Record<string, z.ZodObject> = {
    [String(status)]: successSchema,
    "500": UnexpectedErrorSchema.describe("Internal server error"),
  };

  if (includeErrors.includes("400")) {
    responses["400"] = ValidationErrorSchema.describe("Validation error");
  }
  if (includeErrors.includes("401")) {
    responses["401"] = UnauthorizedErrorSchema.describe("Unauthorized access");
  }
  if (includeErrors.includes("403")) {
    responses["403"] = ForbiddenErrorSchema.describe("Forbidden access");
  }
  if (includeErrors.includes("404")) {
    responses["404"] = NotFoundErrorSchema.describe("Resource not found");
  }
  if (includeErrors.includes("409")) {
    responses["409"] = ConflictErrorSchema.describe("Conflict error");
  }

  return responses;
};
