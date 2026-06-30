import { getReasonPhrase } from "http-status-codes";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string | undefined, statusCode: number = 500) {
    super(message ?? getReasonPhrase(statusCode));
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message?: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message?: string) {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message?: string) {
    super(message, 500);
  }
}

export class NotImplementedError extends AppError {
  constructor(message?: string) {
    super(message, 501);
  }
}
