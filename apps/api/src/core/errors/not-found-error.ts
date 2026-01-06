import { AppError } from "@/core/errors/app-error";

export class NotFoundError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 404, code);
  }
}
