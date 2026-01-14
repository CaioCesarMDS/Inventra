import { z } from "zod";

export const AppErrorSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  code: z.string().optional(),
  field: z.string().optional(),
  details: z.unknown().optional(),
});

export const ValidationErrorSchema = z.object({
  message: z.string(),
  issues: z.array(
    z.object({
      path: z.string(),
      message: z.string(),
    }),
  ),
});

export const UnexpectedErrorSchema = z.object({
  message: z.string(),
});

export const ConflictErrorSchema = AppErrorSchema;
export const NotFoundErrorSchema = AppErrorSchema;
export const UnauthorizedErrorSchema = AppErrorSchema;
export const ForbiddenErrorSchema = AppErrorSchema;
