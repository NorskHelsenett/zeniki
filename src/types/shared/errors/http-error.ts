export class HTTPError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly code: number;
  public readonly response?: Response;
  /**
   * HTTP error class for handling failed fetch API responses.
   * Extends the native Error class with HTTP-specific properties.
   * 
   * @param message - HTTP status text or custom error message describing what went wrong
   * @param code - HTTP status code (e.g., 404, 500, 403)
   * @param response - Optional fetch Response object for additional context
   * @param name - Optional error type identifier (e.g., "GET_RESPONSE_ERROR", "POST_FAILED")
   * 
   * @example
   * ```typescript
   * if (!response.ok) {
   *   throw new HTTPError(
   *     response.statusText,
   *     response.status,
   *     response,
   *     "API_REQUEST_FAILED"
   *   );
   * }
   * ```
   */
  constructor(
    message: string,
    code: number,
    response?: Response,
    name: string = ""
  ) {
    super(message);

    this.message = message;
    this.code = code;
    this.response = response;
    this.name = name;

    Error.captureStackTrace(this, HTTPError);
    Object.setPrototypeOf(this, new.target.prototype); // Lastly restore prototype chain.
  }
}
