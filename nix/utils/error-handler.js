/**
 * The `JSRuntimeError` class is a subclass of the `Error` class in JavaScript.
 * It is used to handle runtime errors in JavaScript code.
 */
class JSRuntimeError extends Error {
  /**
   * Initializes a new instance of the `JSRuntimeError` class with the error message and stack trace from the original error object.
   * @param {Error} error - The original error object.
   */
  constructor(error) {
    super(error.message);
    this.language = "Javascript";
    this.stack = error.stack;
  }

  /**
   * Returns a JSON representation of the error object, including the language, message, and stack trace.
   * @returns {Object} - The JSON representation of the error object.
   */
  toJSON() {
    return {
      language: this.language,
      message: this.message,
      stack: this.stack,
    };
  }
}

try {
} catch (e) {
  if (e) {
    let error = new JSRuntimeError(e);
    console.log(JSON.stringify(error));
  }
}
