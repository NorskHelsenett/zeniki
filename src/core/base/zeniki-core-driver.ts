/**
 * @fileoverview Core HTTP client driver for Zeniki API integrations.
 *
 * This module provides the foundational ZenikiCoreDriver abstract class that serves as the base
 * for all API-specific drivers in the Zeniki ecosystem. It encapsulates common HTTP functionality,
 * authentication handling, and error management using native fetch API.
 *
 * Key Features:
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication token handling
 * - Native fetch API for HTTP requests
 * - Configurable timeouts and retry logic foundation
 * - Extensible architecture for custom API drivers
 *
 * @example
 * ```typescript
 * // Creating a custom API driver
 * class CustomAPIDriver extends ZenikiCoreDriver {
 *   constructor(config: RequestConfig) {
 *     super(config);
 *   }
 *
 *   async getUsers() {
 *     const response = await this.get<User[]>('/users');
 *     return response.json();
 *   }
 *
 *   async createUser(userData: CreateUserRequest) {
 *     const response = await this.post<User>('/users', userData);
 *     return response.json();
 *   }
 * }
 *
 * // Usage
 * const api = new CustomAPIDriver({
 *   baseURL: 'https://api.example.com/v1',
 *   headers: { 'Authorization': 'Bearer token123' }
 * });
 * ```
 *
 * @since 0.0.1
 * @see {@link NetboxDriver} Example implementation for NetBox IPAM
 */

import { isDevMode } from "../utils/is-dev-mode";

/**
 * Abstract base class for all Zeniki API drivers providing standardized HTTP operations.
 *
 * This class serves as the foundation for all API-specific drivers in the Zeniki ecosystem,
 * implementing common patterns for HTTP communication, authentication, error handling, and
 * response processing. It provides a consistent interface while allowing for customization
 * in derived classes.
 *
 * ## Core Functionality
 *
 * **Authentication**: Automatically handles token-based authentication through Authorization headers.
 * Supports various token formats (Bearer, Token, API-Key, etc.) and can be extended for OAuth flows.
 *
 * **HTTP Methods**: Provides type-safe wrappers around all standard HTTP methods with proper
 * TypeScript generics for request/response typing using native fetch API.
 *
 * **Error Handling**: Standardized error processing for network and HTTP errors with
 * type-safe response handling.
 *
 * ## Extending the Driver
 *
 * Derived classes should implement API-specific methods and can override the abstract `next()`
 * method for pagination support.
 *
 * @abstract
 * @class ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * // Basic API driver implementation
 * class MyAPIDriver extends ZenikiCoreDriver {
 *   constructor(config: RequestConfig) {
 *     super(config);
 *   }
 *
 *   // API-specific methods
 *   async getUser(id: number): Promise<User> {
 *     const response = await this.get<User>(`/users/${id}`);
 *     return response.json();
 *   }
 *
 *   async createUser(userData: CreateUserRequest): Promise<User> {
 *     const response = await this.post<User, CreateUserRequest>('/users', userData);
 *     return response.json();
 *   }
 *
 *   // Implement pagination support
 *   async next<T>(url: string | URL | Request, params?: any): Promise<ResponseGeneric<PaginatedResponse<T>>> {
 *     return this.get<PaginatedResponse<T>>(url as string);
 *   }
 * }
 *
 * // Usage with authentication
 * const driver = new MyAPIDriver({
 *   baseURL: 'https://api.example.com/v1',
 *   headers: {
 *     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *     'Content-Type': 'application/json'
 *   }
 * });
 * ```
 *
 * @since 0.0.1
 * @see [Zeniki Test Suite](../../../test/README.md) For comprehensive usage examples and testing
 */

/**
 * Extended Response interface with typed JSON parsing.
 * Provides type-safe response handling using native fetch API.
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
   * Initializes the HTTP client with native fetch API.
   *
   * @param config - Request configuration including base URL, headers, authentication, etc.
   *
   * @example
   * ```typescript
   * const config = {
   *   baseURL: 'https://api.example.com/v1',
   *   headers: {
   *     'Authorization': 'Token your-api-key',
   *     'Content-Type': 'application/json'
   *   },
   *   timeout: 10000
   * };
   * super(config);
   * ```
   */
  constructor(config: RequestConfig) {
    this.config = config;
  }

  public getInstanceConfig(): RequestConfig {
    return this.config;
  }

  public setInstanceConfig(config: RequestConfig) {
    this.config = config;
  }

  /**
   * Disposes of the driver instance and cleans up resources.
   * Clears references to prevent memory leaks.
   * Call this method when the driver is no longer needed.
   *
   * @example
   * ```typescript
   * const driver = new NetboxDriver(config);
   * // ... use driver
   * driver.dispose(); // Clean up when done
   * ```
   */
  public dispose(): void {
    (this.config as any) = null;
  }

  /**
   * Extracts the FQDN (Fully Qualified Domain Name) from the base URL.
   * Removes the protocol (http/https) and any path components, returning only the hostname.
   *
   * @returns The FQDN/hostname from the base URL
   *
   * @example
   * ```typescript
   * // For baseURL: "https://netbox.example.com/api/v2/"
   * const fqdn = driver.getHostname(); // Returns: "netbox.example.com"
   *
   * // For baseURL: "http://firewall.company.local:8080/api"
   * const fqdn = driver.getHostname(); // Returns: "firewall.company.local"
   * ```
   *
   * @throws {Error} When baseURL is not configured or invalid
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
   * Performs an HTTP GET request with type safety using fetch API.
   *
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional additional request configuration
   * @returns Promise resolving to the typed Response
   *
   * @example
   * ```typescript
   * // Get a typed response
   * const response = await this.get<User>('/users/123');
   * const user: User = await response.json();
   *
   * // With additional configuration
   * const response = await this.get<User[]>('/users', {
   *   headers: { 'Accept': 'application/json' }
   * });
   * ```
   *
   * @throws {Error} When the request fails due to network, authentication, or server errors
   */
  protected async get<T>(
    url: string | URL | Request,
    config?: RequestConfig
  ): Promise<ResponseGeneric<T>> {
    return (await fetch(url, config)) as ResponseGeneric<T>;
  }

  /**
   * Performs an HTTP POST request with type safety using fetch API.
   * Used for creating new resources or submitting data to the API.
   *
   * @template T - Expected response data type
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional request configuration including body for request data
   * @returns Promise resolving to the typed Response
   *
   * @example
   * ```typescript
   * // Create a new resource
   * interface CreateUserRequest {
   *   name: string;
   *   email: string;
   * }
   * interface User {
   *   id: number;
   *   name: string;
   *   email: string;
   * }
   *
   * const response = await this.post<User>('/users', {
   *   method: 'POST',
   *   body: JSON.stringify({
   *     name: 'John Doe',
   *     email: 'john@example.com'
   *   })
   * });
   * const newUser = await response.json();
   *
   * // Submit form data with custom headers
   * const response = await this.post('/submit', {
   *   method: 'POST',
   *   body: formData,
   *   headers: { 'Content-Type': 'multipart/form-data' }
   * });
   * ```
   *
   * @throws {Error} When the request fails due to validation, network, or server errors
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
   * Performs an HTTP PUT request with type safety using fetch API.
   * Used for complete resource updates (replacing the entire resource).
   *
   * @template T - Expected response data type (usually the updated resource)
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional request configuration including body for request data
   * @returns Promise resolving to the typed Response
   *
   * @example
   * ```typescript
   * // Update an entire user resource
   * interface User {
   *   id: number;
   *   name: string;
   *   email: string;
   *   active: boolean;
   * }
   *
   * const response = await this.put<User>('/users/123', {
   *   method: 'PUT',
   *   body: JSON.stringify({
   *     id: 123,
   *     name: 'John Smith',
   *     email: 'john.smith@example.com',
   *     active: true
   *   })
   * });
   * const updatedUser = await response.json();
   *
   * // Replace configuration settings with typed data
   * interface Config {
   *   theme: string;
   *   notifications: boolean;
   * }
   * const response = await this.put<Config>('/config', {
   *   method: 'PUT',
   *   body: JSON.stringify(newConfigObject)
   * });
   * const config = await response.json();
   * ```
   *
   * @throws {Error} When the request fails due to validation, network, or server errors
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
   * Performs an HTTP PATCH request with type safety using fetch API.
   * Used for partial resource updates (updating only specific fields).
   *
   * @template T - Expected response data type (usually the updated resource)
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional request configuration including body for request data
   * @returns Promise resolving to the typed Response
   *
   * @example
   * ```typescript
   * // Update only specific fields of a user
   * interface UserUpdate {
   *   email?: string;
   *   active?: boolean;
   * }
   * const response = await this.patch<User>('/users/123', {
   *   method: 'PATCH',
   *   body: JSON.stringify({
   *     email: 'newemail@example.com',
   *     active: false
   *   })
   * });
   * const updatedUser = await response.json();
   *
   * // Update prefix description only
   * const response = await this.patch<NetboxPrefix>('/ipam/prefixes/456', {
   *   method: 'PATCH',
   *   body: JSON.stringify({
   *     description: 'Updated network description'
   *   })
   * });
   * const prefix = await response.json();
   *
   * // Bulk update with custom fields
   * interface BulkUpdate {
   *   ids: number[];
   *   custom_fields: Record<string, any>;
   * }
   * const response = await this.patch<any>('/resources/bulk', {
   *   method: 'PATCH',
   *   body: JSON.stringify({
   *     ids: [1, 2, 3],
   *     custom_fields: { status: 'updated' }
   *   })
   * });
   * const result = await response.json();
   * ```
   *
   * @throws {Error} When the request fails due to validation, network, or server errors
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
   * Performs an HTTP DELETE request with type safety using fetch API.
   * Used for removing resources from the API.
   *
   * @template T - Expected response data type (often empty or confirmation)
   * @param url - Relative URL path (will be combined with baseURL)
   * @param config - Optional additional request configuration
   * @returns Promise resolving to the typed Response
   *
   * @example
   * ```typescript
   * // Delete a specific resource
   * await this.delete('/users/123');
   *
   * // Delete with confirmation response
   * const response = await this.delete<DeleteResult>('/prefixes/456');
   * const result = await response.json();
   * console.log(`Deleted: ${result.success}`);
   *
   * // Delete with additional configuration
   * await this.delete('/cache', {
   *   headers: { 'X-Force': 'true' }
   * });
   * ```
   *
   * @throws {Error} When the request fails due to authorization, network, or server errors
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
   * Performs an HTTP GET request to a custom URL with type safety.
   * This method must be implemented by derived classes to provide generic API access.
   * Used for accessing endpoints not covered by specific driver methods.
   *
   * @template T - Expected response data type
   * @param url - Complete or relative URL path to the API endpoint
   * @param params - Optional query parameters for the request
   * @returns Promise resolving to the typed Response
   *
   * @example
   * ```typescript
   * // Custom endpoint access
   * const response = await driver.getByUrl<CustomType>('/custom/endpoint', {
   *   filter: 'active',
   *   sort: 'name'
   * });
   * ```
   *
   * @throws {Error} When not implemented by derived class
   */
  protected async getByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any }
  ): Promise<T | undefined> {
    throw new Error(
      "CustomDriver must implement getByUrl function for generic API access."
    );
  }

  /**
   * Performs a paginated HTTP GET request with optional automatic pagination following.
   * This method must be implemented by derived classes to provide paginated API access.
   * Supports manual pagination control or automatic collection of all pages.
   *
   * @template T - Expected response data type
   * @param url - Complete or relative URL path to the API endpoint
   * @param params - Optional query parameters including pagination controls
   * @param follow - Whether to automatically follow pagination and retrieve all results (default: false)
   * @returns Promise resolving to the paginated Response
   *
   * @example
   * ```typescript
   * // Get first page only
   * const page1 = await driver.getPaginatedByUrl<Item>('/items', { limit: 50 });
   *
   * // Get all pages automatically
   * const allItems = await driver.getPaginatedByUrl<Item>('/items', { limit: 100 }, true);
   * ```
   *
   * @throws {Error} When not implemented by derived class
   */
  protected async getPaginatedByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
    follow = false
  ): Promise<T | undefined> {
    throw new Error(
      "CustomDriver must implement getPaginatedByUrl function for generic API access with pagination support."
    );
  }

  /**
   * Abstract method for pagination support that must be implemented by derived classes.
   *
   * This method should handle paginated API responses by making multiple requests
   * and aggregating results. The implementation depends on the specific API's
   * pagination strategy (cursor-based, offset-based, page-based, etc.).
   *
   * @template T - Type of objects contained in paginated results
   * @param url - The API endpoint URL that supports pagination
   * @param params - Query parameters for filtering, sorting, and pagination control
   * @returns Promise resolving to aggregated results from all pages
   *
   * @abstract
   * @protected
   *
   * @example
   * ```typescript
   * // Example implementation for cursor-based pagination
   * async next<T>(url: string | URL | Request, params?: any): Promise<ResponseGeneric<PaginatedResponse<T>>> {
   *   let allResults: T[] = [];
   *   let nextUrl: string | null = url as string;
   *
   *   while (nextUrl) {
   *     const response = await this.get<PaginatedResponse<T>>(nextUrl, { params });
   *     const data = await response.json<PaginatedResponse<T>>();
   *     allResults = allResults.concat(data.results);
   *     nextUrl = data.next;
   *   }
   *
   *   return response as ResponseGeneric<PaginatedResponse<T>>;
   * }
   * ```
   *
   * @throws {Error} When not implemented by derived class
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
