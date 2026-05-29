import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMParams,
  NAMResponse,
  NAMVxlan,
} from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM Vxlans Sub-Driver for managing Vxlans configurations.
 * Provides methods to retrieve, create, update, and delete Vxlans.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const vxlans = await nam.vxlans.getVxlans({ name: 'vxlan1' });
 * ```
 */
export class NAMVxlansSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve specific vxlan by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMVxlan
   * @example
   * ```typescript
   * const vxlan = await nam.vxlans.getVxlan('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getVxlan(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVxlan> {
    const response = await this.get<NAMVxlan>(
      this.config.baseURL +
        `/ipam/vxlans/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Retrieve paginated list of Vxlans.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMVxlan collection
   * @example
   * ```typescript
   * const vxlans = await nam.vxlans.getVxlans({ name: 'vxlan1' });
   * ```
   */
  async getVxlans(
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMResponse<NAMVxlan>> {
    const response = await this.get<NAMResponse<NAMVxlan>>(
      this.config.baseURL + `/ipam/vxlans/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Create new vxlan configuration.
   * @param vxlan - NAMVxlan configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMVxlan
   * @example
   * ```typescript
   * const d = await nam.vxlans.addVxlan({
   *   name: 'test-vxlan',
   *   id: 3999,
   *   description: 'Test VXLAN created by Zeniki',
   *   redist_host_routes: false,
   *   containers: ['5ca6ffa08f1dc35c8b937a2a' as unknown as ObjectId],
   * });
   * ```
   */
  async addVxlan(
    vxlan: NAMVxlan,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVxlan> {
    const response = await this.post<NAMVxlan>(
      this.config.baseURL + `/ipam/vxlans/` + queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(vxlan) },
    );

    if (response.ok) {
      return await response.json();
    } else {
      // console.log("Failed to create vxlan:", await response.json());
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
      );
    }
  }

  /**
   * Update existing vxlan with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param vxlan - Partial NAMVxlan object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMVxlan
   * @example
   * ```typescript
   * const updated = await nam.vxlans.patchVxlan('674d7b2c8f1e4a1b2c3d4e5f', { description: 'Updated description' });
   * ```
   */
  async patchVxlan(
    id: string | ObjectId,
    vxlan: Partial<NAMVxlan>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVxlan> {
    const response = await this.patch<NAMVxlan>(
      this.config.baseURL +
        `/ipam/vxlans/${id}` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(vxlan) },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Replace existing vxlan with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param vxlan - Complete NAMVxlan configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMVxlan
   * @example
   * ```typescript
   * const vxlan = await nam.vxlans.updateVxlan('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'test-vxlan',
   *   id: 3999,
   *   description: 'Updated description for test VXLAN'
   * });
   * ```
   */
  async updateVxlan(
    id: string | ObjectId,
    vxlan: NAMVxlan,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVxlan> {
    const response = await this.put<NAMVxlan>(
      this.config.baseURL +
        `/ipam/vxlans/${id}` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(vxlan) },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Delete vxlan configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMVxlan
   * @example
   * ```typescript
   * await nam.vxlans.deleteVxlan('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteVxlan(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVxlan> {
    const response = await this.delete<NAMVxlan>(
      this.config.baseURL +
        `/ipam/vxlans/${id}` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" },
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
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
    params?: { [key: string]: any },
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
      { ...this.config, method: "GET" },
    );
    let data = await res.json();
    const size = data.count || 0;
    let index = params.count;
    tmp = data.results || [];
    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" },
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
