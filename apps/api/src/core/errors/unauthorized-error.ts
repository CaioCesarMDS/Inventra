import { AppError } from "@/core/errors/app-error";

export class UnauthorizedError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 401, code);
  }
}
