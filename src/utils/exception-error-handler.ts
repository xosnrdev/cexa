import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  ServiceUnavailableError,
  TimeLimitExceededError,
} from "./error-handler";


/**
 * Handles the exception error by mapping the error message to the corresponding error class and throwing the error.
 * If no matching error class is found, it throws an InternalServerError.
 * @param err The error object to handle.
 * @throws {BadRequestError} If the error message contains "SyntaxError" or "TSError".
 * @throws {InternalServerError} If the error message contains "ReferenceError" or "CompilationError".
 * @throws {NotFoundError} If the error message contains "TypeError" or "DesignError".
 * @throws {ServiceUnavailableError} If the error message contains "ResourceError".
 * @throws {TimeLimitExceededError} If the error message contains "TimeLimitExceededError".
 * @throws {InternalServerError} If no matching error class is found.
 */
function handleExceptionError(err: Error) {
  const errMsg = err.message;

  const errorMap = {
    SyntaxError: BadRequestError,
    ReferenceError: InternalServerError,
    TypeError: NotFoundError,
    ResourceError: ServiceUnavailableError,
    InterfaceError: BadRequestError,
    DesignError: NotFoundError,
    TimeLimitExceededError: TimeLimitExceededError,
    CompilationError: InternalServerError,
    TSError: BadRequestError,
  };

  for (const [errorType, ErrorClass] of Object.entries(errorMap)) {
    if (errMsg.includes(errorType)) {
      throw new ErrorClass(errMsg);
    }
  }

  throw new InternalServerError(errMsg);
}

export default handleExceptionError;
