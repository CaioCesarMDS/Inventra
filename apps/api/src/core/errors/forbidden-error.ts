import { AppError } from "@/core/errors/app-error";

export class ForbiddenError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 403, code);
  }
}
