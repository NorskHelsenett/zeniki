import { isDevMode } from "../utils/is-dev-mode";

/**
 * Abstract base class for all Zeniki API drivers providing standardized HTTP operations.
 * Implements common patterns for HTTP communication, authentication handling, and error management
 * using native fetch API. Derived classes should implement API-specific methods and override the
 * abstract `next()` method for pagination support.
 *
 * @abstract
 * @example
 * ```typescript
 * class MyAPIDriver extends ZenikiCoreDriver {
 *   async getUser(id: number) {
 *     return await this.get<User>(`/users/${id}`);
 *   }
 * }
 * const driver = new MyAPIDriver({
 *   baseURL: 'https://api.example.com',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * ```
 */

/**
 * Extended Response interface with typed JSON parsing for type-safe response handling.
 */
export interface ResponseGeneric<T> extends Response {
  json(): Promise<T>;
}

export interface RequestConfig extends RequestInit {
  baseURL: string;
}

export abstract class ZenikiCoreDriver {
  /** Original configuration passed to the driver */
  protected config: RequestConfig;

  /**
   * Creates a new core driver instance with the specified configuration.
   * @param config - Request configuration including base URL, headers, authentication, etc.
   * @example
   * ```typescript
   * super({
   *   baseURL: 'https://api.example.com',
   *   headers: { 'Authorization': 'Token key' }
   * });
   * ```
   */
  constructor(config: RequestConfig) {
    this.config = config;
  }  public getInstanceConfig(): RequestConfig {
    return this.config;
  }

  public setInstanceConfig(config: RequestConfig) {
    this.config = config;
  }

  /**
   * Disposes of the driver instance and cleans up resources.
   * @example
   * ```typescript
   * driver.dispose();
   * ```
   */
  public dispose(): void {
    (this.config as any) = null;
  }

  /**
   * Extracts the hostname from the base URL.
   * @returns The hostname from the base URL
   * @throws {Error} When baseURL is not configured or invalid
   * @example
   * ```typescript
   * const hostname = driver.getHostname(); // "netbox.example.com"
   * ```
   */
  public getHostname(): string {
    if (!this.config.baseURL) {
      throw new Error("Base URL is not configured");
    }

    try {
      const url = new URL(this.config.baseURL);
      return url.hostname;
    } catch (error) {
      throw new Error(`Invalid base URL: ${this.config.baseURL}`);
    }
  }

  /**
   * Performs an HTTP GET request with type safety.
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional additional request configuration
   * @returns Promise resolving to the typed Response
   * @example
   * ```typescript
   * const response = await this.get<User>('/users/123');
   * ```
   */
  protected async get<T>(
    url: string | URL | Request,
    config?: RequestConfig
  ): Promise<ResponseGeneric<T>> {
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs an HTTP POST request for creating new resources.
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional request configuration including body
   * @returns Promise resolving to the typed Response
   * @example
   * ```typescript
   * const response = await this.post<User>('/users', {
   *   body: JSON.stringify({ name: 'John' })
   * });
   * ```
   */
  protected async post<T>(
    url: string | URL | Request,
    config?: RequestInit
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "POST";
    }

    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs an HTTP PUT request for complete resource updates.
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional request configuration including body
   * @returns Promise resolving to the typed Response
   * @example
   * ```typescript
   * const response = await this.put<User>('/users/123', {
   *   body: JSON.stringify({ name: 'John', email: 'john@mail.com' })
   * });
   * ```
   */
  protected async put<T>(
    url: string | URL | Request,
    config?: RequestInit
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "PUT";
    }
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs an HTTP PATCH request for partial resource updates.
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional request configuration including body
   * @returns Promise resolving to the typed Response
   * @example
   * ```typescript
   * const response = await this.patch<User>('/users/123', {
   *   body: JSON.stringify({ email: 'new@mail.com' })
   * });
   * ```
   */
  protected async patch<T>(
    url: string | URL | Request,
    config?: RequestInit
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "PATCH";
    }

    return (await fetch(url, config)) as ResponseGeneric<T>;
  }
  /**
   * Performs an HTTP DELETE request for removing resources.
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional additional request configuration
   * @returns Promise resolving to the typed Response
   * @example
   * ```typescript
   * await this.delete('/users/123');
   * ```
   */
  protected async delete<T>(
    url: string | URL | Request,
    config?: RequestInit
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "DELETE";
    }
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs an HTTP GET request to a custom URL, must be implemented by derived classes.
   * @template T - Expected response data type
   * @param url - Complete or relative URL path to the API endpoint
   * @param params - Optional query parameters
   * @returns Promise resolving to the typed data
   * @example
   * ```typescript
   * const data = await driver.getByUrl<Item>('/items', { filter: 'active' });
   * ```
   */
  protected async getByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any }
  ): Promise<T> {
    throw new Error(
      "CustomDriver must implement getByUrl function for generic API access."
    );
  }

  /**
   * Performs a paginated HTTP GET request, must be implemented by derived classes.
   * @template T - Expected response data type
   * @param url - Complete or relative URL path
   * @param params - Optional query parameters
   * @param follow - Whether to automatically follow all pages (default: false)
   * @returns Promise resolving to the paginated data
   * @example
   * ```typescript
   * const all = await driver.getPaginatedByUrl<Item>('/items', {}, true);
   * ```
   */
  protected async getPaginatedByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
    follow = false
  ): Promise<T> {
    throw new Error(
      "CustomDriver must implement getPaginatedByUrl function for generic API access with pagination support."
    );
  }

  /**
   * Abstract method for pagination support, must be implemented by derived classes.
   * @abstract
   * @template T - Type of objects in paginated results
   * @param url - The API endpoint URL that supports pagination
   * @param params - Query parameters for pagination control
   * @returns Promise resolving to paginated response
   * @example
   * ```typescript
   * async next<T>(url: string) {
   *   return this.get<PaginatedResponse<T>>(url);
   * }
   * ```
   */
  protected async next<T>(
    url: string | URL | Request,
    params?: { [key: string]: any }
  ): Promise<ResponseGeneric<T>> {
    throw new Error(
      "CustomDriver must implement next function with pagination support."
    );
  }
}
