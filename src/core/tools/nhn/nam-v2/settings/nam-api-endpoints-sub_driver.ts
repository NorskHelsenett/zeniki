import { ObjectId } from "mongodb";
import { HTTPError, NAMAPIEndpoint, NAMParams, NAMResponse } from "../../../../../types";
import { RequestConfig, ResponseGeneric, ZenikiCoreDriver } from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM API Endpoints Sub-Driver for managing API endpoint configurations.
 * Provides methods to retrieve, create, update, and delete API endpoints.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const endpoints = await nam.api_endpoints.getApiEndpoints({ vendor_type: 'netbox' });
 * ```
 */
export class NAMAPIEndpointsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve specific API endpoint configuration by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMAPIEndpoint
   * @example
   * ```typescript
   * const endpoint = await nam.api_endpoints.getApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getApiEndpoint(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint> {
    const response = await this.get<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve paginated list of API endpoints.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMAPIEndpoint collection
   * @example
   * ```typescript
   * const endpoints = await nam.api_endpoints.getApiEndpoints({ vendor_type: 'netbox' });
   * ```
   */
  async getApiEndpoints(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMAPIEndpoint>> {
    const response = await this.get<NAMResponse<NAMAPIEndpoint>>(
      this.config.baseURL +
        `/settings/api-endpoints/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create new API endpoint configuration.
   * @param endpoint - NAMAPIEndpoint configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMAPIEndpoint
   * @example
   * ```typescript
   * const endpoint = await nam.api_endpoints.addApiEndpoint({
   *   name: 'netbox',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
  async addApiEndpoint(
    endpoint: NAMAPIEndpoint,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint> {
    const response = await this.post<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(endpoint) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update existing API endpoint with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param endpoint - Partial NAMAPIEndpoint object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMAPIEndpoint
   * @example
   * ```typescript
   * const updated = await nam.api_endpoints.patchApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchApiEndpoint(
    id: string | ObjectId,
    endpoint: Partial<NAMAPIEndpoint>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint> {
    const response = await this.patch<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(endpoint) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Replace existing API endpoint with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param endpoint - Complete NAMAPIEndpoint configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMAPIEndpoint
   * @example
   * ```typescript
   * const endpoint = await nam.api_endpoints.updateApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
  async updateApiEndpoint(
    id: string | ObjectId,
    endpoint: NAMAPIEndpoint,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint> {
    const response = await this.put<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(endpoint) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete API endpoint configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMAPIEndpoint
   * @example
   * ```typescript
   * await nam.api_endpoints.deleteApiEndpoint('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteApiEndpoint(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMAPIEndpoint> {
    const response = await this.delete<NAMAPIEndpoint>(
      this.config.baseURL +
        `/settings/api-endpoints/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Internal method for automatic pagination handling.
   * @protected
   * @template T - Expected response data type
   * @param url - API endpoint URL
   * @param params - Optional query parameters with count and skip
   * @returns Promise resolving to complete paginated response
   */
  protected async next<T>(
    url: string | URL | Request,
    params?: { [key: string]: any }
  ): Promise<ResponseGeneric<T>> {
    if (params && !params?.count) {
      params["count"] = 5;
      params["skip"] = 1;
    } else {
      params = {
        count: 5,
        skip: 1,
      };
    }

    let tmp: any[] = [];
    const res = await this.get<any>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    const size = data.count || 0;
    let index = params.count;
    tmp = data.results || [];
    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" }
      );
      data = await response.json();
      if (data.results && data.results.length > 0) {
        tmp = tmp.concat(data.results);
      }
      index += params.count;
    }
    // Return ResponseGeneric wrapper with aggregated data
    return {
      ...res,
      json: async () => ({
        ...data,
        results: tmp,
        count: tmp.length,
      }),
    } as ResponseGeneric<T>;
  }
}
