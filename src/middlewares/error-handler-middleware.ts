import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/error-handler";
import sendResponse from "../utils/send-response";
import logger from "../utils/logger";

/**
 * Middleware function to handle errors thrown in an Express application.
 * If the error is an instance of the ErrorHandler class, it logs the error message and stack trace,
 * and sends a user-friendly error response with the appropriate status code.
 * If the error is not an instance of ErrorHandler, it passes the error to the next middleware in the chain.
 * @param err - The error object thrown in the application.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ErrorHandler) {
    logger.error(err.stack);
    const userFriendlyMessage = err.isOperational
      ? err.message
      : "An unexpected error occurred. Please try again later.";
    sendResponse(res, err.statusCode, userFriendlyMessage);
  } else {
    next(err);
  }
}

export default errorHandlerMiddleware;
