import { AppError } from "@/core/errors/app-error";

export class ConflictError extends AppError {
  constructor(message: string, code?: string, field?: string) {
    super(message, 409, code, field);
  }
}
