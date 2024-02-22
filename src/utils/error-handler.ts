/**
 * Custom error handler class.
 */
export class ErrorHandler extends Error {
  statusCode: number;
  isOperational: boolean;

  /**
   * Creates an instance of ErrorHandler.
   * @param {number} statusCode - The HTTP status code.
   * @param {string} message - The error message.
   * @param {boolean} isOperational - Indicates if the error is operational.
   */
  constructor(statusCode: number, message: string, isOperational: boolean) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ErrorHandler {
  constructor(message: string) {
    super(400, message, true);
  }
}

export class UnauthorizedError extends ErrorHandler {
  constructor(message: string) {
    super(401, message, true);
  }
}

export class ForbiddenError extends ErrorHandler {
  constructor(message: string) {
    super(403, message, true);
  }
}

export class NotFoundError extends ErrorHandler {
  constructor(message: string) {
    super(404, message, true);
  }
}

export class InternalServerError extends ErrorHandler {
  constructor(message: string) {
    super(500, message, true);
  }
}

export class ServiceUnavailableError extends ErrorHandler {
  constructor(message: string) {
    super(503, message, true);
  }
}

export class TimeLimitExceededError extends ErrorHandler {
  constructor(message: string) {
    super(408, message, true);
  }
}
