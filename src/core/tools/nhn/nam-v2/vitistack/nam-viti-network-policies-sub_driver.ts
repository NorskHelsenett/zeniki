import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMVitiNetworkPolicy,
  NAMParams,
  NAMResponse,
} from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM Vitistack Network Policies Sub-Driver for managing Vitistack Network Policy configurations.
 * Provides methods to retrieve, create, update, and delete Vitistack Network Policies.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const policies = await nam.viti_networkpolicies.getVitiNetworkPolicies({ enabled: true });
 * ```
 */
export class NAMVitiNetworkPoliciesSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific Vitistack Network Policy by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMVitiNetworkPolicy
   * @example
   * ```typescript
   * const policy = await nam.viti_networkpolicies.getVitiNetworkPolicy('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getVitiNetworkPolicy(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVitiNetworkPolicy> {
    const response = await this.get<NAMVitiNetworkPolicy>(
      this.config.baseURL +
        `/vitistack/network-policies/${id}/` +
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
   * Retrieve paginated list of Vitistack Network Policies.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMVitiNetworkPolicy collection
   * @example
   * ```typescript
   * const policies = await nam.viti_networkpolicies.getVitiNetworkPolicies({ enabled: true });
   * ```
   */
  async getVitiNetworkPolicies(
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMResponse<NAMVitiNetworkPolicy>> {
    const response = await this.get<NAMResponse<NAMVitiNetworkPolicy>>(
      this.config.baseURL +
        `/vitistack/network-policies/` +
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
   * Create a new Vitistack Network Policy configuration.
   * @param policy - NAMVitiNetworkPolicy configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMVitiNetworkPolicy
   * @example
   * ```typescript
   * const policy = await nam.viti_networkpolicies.addVitiNetworkPolicy({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
  async addVitiNetworkPolicy(
    policy: NAMVitiNetworkPolicy,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVitiNetworkPolicy> {
    const response = await this.post<NAMVitiNetworkPolicy>(
      this.config.baseURL +
        `/vitistack/network-policies/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(policy) },
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
   * Update existing Vitistack Network Policy with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param policy - Partial NAMVitiNetworkPolicy object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMVitiNetworkPolicy
   * @example
   * ```typescript
   * const updated = await nam.viti_networkpolicies.patchVitiNetworkPolicy('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchVitiNetworkPolicy(
    id: string | ObjectId,
    policy: Partial<NAMVitiNetworkPolicy>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVitiNetworkPolicy> {
    const response = await this.patch<NAMVitiNetworkPolicy>(
      this.config.baseURL +
        `/vitistack/network-policies/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(policy) },
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
   * Replace existing Vitistack Network Policy with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param policy - Complete NAMVitiNetworkPolicy configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMVitiNetworkPolicy
   * @example
   * ```typescript
   * const policy = await nam.viti_networkpolicies.updateVitiNetworkPolicy('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   enabled: true
   * });
   * ```
   */
  async updateVitiNetworkPolicy(
    id: string | ObjectId,
    policy: NAMVitiNetworkPolicy,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVitiNetworkPolicy> {
    const response = await this.put<NAMVitiNetworkPolicy>(
      this.config.baseURL +
        `/vitistack/network-policies/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(policy) },
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
   * Delete Vitistack Network Policy configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMVitiNetworkPolicy
   * @example
   * ```typescript
   * await nam.viti_networkpolicies.deleteVitiNetworkPolicy('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteVitiNetworkPolicy(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMVitiNetworkPolicy> {
    const response = await this.delete<NAMVitiNetworkPolicy>(
      this.config.baseURL +
        `/vitistack/network-policies/${id}/` +
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
