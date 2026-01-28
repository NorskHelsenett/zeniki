import { XCSRFTokenKeys } from "../../types";
import { isDevMode } from "../utils/is-dev-mode";

/**
 * Abstract base class for Zeniki API drivers providing standardized HTTP operations.
 * Implements common patterns for HTTP communication, authentication, and error handling.
 * Derived classes should implement API-specific methods and pagination support.
 * @abstract
 * @example
 * ```typescript
 * class MyAPIDriver extends ZenikiCoreDriver {
 *   async getUser(id: number) {
 *     return await this.get<User>(`/users/${id}`);
 *   }
 * }
 * ```
 */

/**
 * Response interface with typed JSON parsing.
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
  #authenticated = false;
  #initial_config: RequestConfig;

  /**
   * Creates a new driver instance.
   * @param config - Request configuration including base URL and headers
   * @example
   * ```typescript
   * super({ baseURL: 'https://api.example.com' });
   * ```
   */
  constructor(config: RequestConfig) {
    this.config = config;
    this.#initial_config = config;
  }

  /**
   * Gets the current request configuration.
   * @returns Current RequestConfig
   * @example
   * ```typescript
   * const config = driver.getInstanceConfig();
   * ```
   */
  public getInstanceConfig(): RequestConfig {
    return this.config;
  }

  /**
   * Updates the request configuration.
   * @param config - New RequestConfig to set
   * @example
   * ```typescript
   * driver.setInstanceConfig({ baseURL: 'https://new-url.com' });
   * ```
   */
  public setInstanceConfig(config: RequestConfig) {
    this.config = config;
  }

  /**
   * Sets cookies and CSRF token from response headers.
   * @param headers - Response headers containing cookies
   * @param csrf_token_key - CSRF token header key
   * @throws {Error} When setting cookies fails
   * @example
   * ```typescript
   * await driver.setCookies(response.headers, 'X-CSRFToken');
   * ```
   */
  public async setCookies(headers: Headers, csrf_token_key?: XCSRFTokenKeys) {
    try {
      const cookies = headers.getSetCookie();
      const csrfTokenCookie = cookies.find((c) => c.includes("csrftoken="));
      const csrfToken = csrfTokenCookie?.match(/csrftoken=([^;]+)/)?.[1] || "";
      const key: string = csrf_token_key?.toString() + "";

      const cfg: RequestConfig = {
        ...this.config,
        headers: {
          ...this.config.headers,
          [key]: csrfToken ? csrfToken : undefined,
          Cookie: cookies.join("; "),
        },
        credentials: this.config.credentials
          ? this.config.credentials
          : "same-origin",
      };

      this.#authenticated = true;
      this.config = cfg;
    } catch (error) {
      this.#authenticated = false;
      throw new Error("zeniki-core: Failed setting cookie(s)");
    }
  }

  /**
   * Clears cookies and resets configuration to initial state.
   * @example
   * ```typescript
   * await driver.unsetCookies();
   * ```
   */
  public async unsetCookies() {
    this.#authenticated = false;
    this.config = this.#initial_config;
  }

  /**
   * Returns authentication status.
   * @returns True if authenticated
   * @example
   * ```typescript
   * if (driver.is_authenticated) { // do stuff  }
   * ```
   */
  public get is_authenticated() {
    return this.#authenticated;
  }

  /**
   * Disposes driver instance and cleans up resources.
   * @example
   * ```typescript
   * driver.dispose();
   * ```
   */
  public dispose(): void {
    (this.config as any) = null;
  }

  /**
   * Extracts hostname from base URL.
   * @returns Hostname from base URL
   * @throws {Error} When baseURL is invalid
   * @example
   * ```typescript
   * const hostname = driver.getHostname();
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
   * Performs HTTP GET request.
   * @template T - Expected response data type
   * @param url - Request URL
   * @param config - Optional request configuration
   * @returns Typed Response promise
   * @example
   * ```typescript
   * const res = await this.get<User>('/users/123');
   * ```
   */
  protected async get<T>(
    url: string | URL | Request,
    config?: RequestConfig,
  ): Promise<ResponseGeneric<T>> {
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs HTTP POST request.
   * @template T - Expected response data type
   * @param url - Request URL
   * @param config - Optional request configuration
   * @returns Typed Response promise
   * @example
   * ```typescript
   * const res = await this.post<User>('/users', { body });
   * ```
   */
  protected async post<T>(
    url: string | URL | Request,
    config?: RequestInit,
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "POST";
    }

    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs HTTP PUT request.
   * @template T - Expected response data type
   * @param url - Request URL
   * @param config - Optional request configuration
   * @returns Typed Response promise
   * @example
   * ```typescript
   * const res = await this.put<User>('/users/123', { body });
   * ```
   */
  protected async put<T>(
    url: string | URL | Request,
    config?: RequestInit,
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "PUT";
    }
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs HTTP PATCH request.
   * @template T - Expected response data type
   * @param url - Request URL
   * @param config - Optional request configuration
   * @returns Typed Response promise
   * @example
   * ```typescript
   * const res = await this.patch<User>('/users/123', { body });
   * ```
   */
  protected async patch<T>(
    url: string | URL | Request,
    config?: RequestInit,
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "PATCH";
    }

    return (await fetch(url, config)) as ResponseGeneric<T>;
  }
  /**
   * Performs HTTP DELETE request.
   * @template T - Expected response data type
   * @param url - Request URL
   * @param config - Optional request configuration
   * @returns Typed Response promise
   * @example
   * ```typescript
   * await this.delete('/users/123');
   * ```
   */
  protected async delete<T>(
    url: string | URL | Request,
    config?: RequestInit,
  ): Promise<ResponseGeneric<T>> {
    if (config?.method) {
      config.method = "DELETE";
    }
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs GET request to custom URL (must be implemented by derived classes).
   * @template T - Expected response data type
   * @param url - Request URL
   * @param params - Optional query parameters
   * @returns Typed data promise
   * @example
   * ```typescript
   * const data = await driver.getByUrl<Item>('/items');
   * ```
   */
  protected async getByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
  ): Promise<T> {
    throw new Error(
      "CustomDriver must implement getByUrl function for generic API access.",
    );
  }

  /**
   * Performs paginated GET request (must be implemented by derived classes).
   * @template T - Expected response data type
   * @param url - Request URL
   * @param params - Optional query parameters
   * @param follow - Whether to follow all pages
   * @returns Paginated data promise
   * @example
   * ```typescript
   * const all = await driver.getPaginatedByUrl<Item>('/items', {}, true);
   * ```
   */
  protected async getPaginatedByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
    follow = false,
  ): Promise<T> {
    throw new Error(
      "CustomDriver must implement getPaginatedByUrl function for generic API access with pagination support.",
    );
  }

  /**
   * Abstract pagination method (must be implemented by derived classes).
   * @abstract
   * @template T - Type of paginated objects
   * @param url - API endpoint URL
   * @param params - Query parameters
   * @returns Paginated response promise
   * @example
   * ```typescript
   * return this.get<Page<T>>(url);
   * ```
   */
  protected async next<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
  ): Promise<ResponseGeneric<T>> {
    throw new Error(
      "CustomDriver must implement next function with pagination support.",
    );
  }
}
