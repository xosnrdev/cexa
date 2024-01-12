/**
 * Represents a runtime error.
 */
class TSRuntimeError {
  /**
   * The language of the error.
   */
  private language: string;

  /**
   * The error message.
   */
  private message: string;

  /**
   * The stack trace of the error.
   */
  private stack?: string;

  /**
   * Initializes a new instance of the `TSRuntimeError` class with the given error object.
   * @param error - The error object.
   */
  constructor(error: Error) {
    this.language = "Typescript";
    this.message = error.message;
    this.stack = error.stack;
  }

  /**
   * Converts the `TSRuntimeError` instance to a JSON object.
   * @returns The JSON object with the language, message, and stack fields.
   */
  public toJSON(): object {
    return {
      language: this.language,
      message: this.message,
      stack: this.stack,
    };
  }
}

try {
  eval("console.log('boy' / 2");
} catch (e) {
  if (e) {
    let error = new TSRuntimeError(e);
    console.log(JSON.stringify(error));
  }
}
