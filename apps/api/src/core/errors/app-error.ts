export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly field?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 400,
    code?: string,
    field?: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    this.details = details;
    this.name = "AppError";
  }
}
