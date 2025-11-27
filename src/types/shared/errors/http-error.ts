export class HTTPError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly code: number;
  public readonly response?: Response;
  /**
   * HTTP error for failed fetch API responses.
   * 
   * @param message - HTTP status text or error message
   * @param code - HTTP status code
   * @param response - Optional fetch Response object
   * @param name - Optional error type identifier
   * 
   * @example
   * ```typescript
   * if (!response.ok) {
   *   throw new HTTPError(response.statusText, response.status, response);
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
