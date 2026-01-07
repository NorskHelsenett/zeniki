import { ObjectId } from "mongodb";
import { HTTPError, NAMParams, NAMResponse } from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";
import { NAMDomain } from "../../../../../types/tools/nhn/nam-v2/ipam/nam-domain";

/**
 * NAM Domains Sub-Driver for managing Domains configurations.
 * Provides methods to retrieve, create, update, and delete Domains.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const domains = await nam.domains.getDomains({ name: 'domain1' });
 * ```
 */
export class NAMDomainsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve specific domain by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMDomain
   * @example
   * ```typescript
   * const domain = await nam.domains.getDomain('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getDomain(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMDomain> {
    const response = await this.get<NAMDomain>(
      this.config.baseURL +
        `/ipam/domains/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Retrieve paginated list of Domains.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMDomain collection
   * @example
   * ```typescript
   * const domains = await nam.domains.getDomains({ name: 'domain1' });
   * ```
   */
  async getDomains(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMDomain>> {
    const response = await this.get<NAMResponse<NAMDomain>>(
      this.config.baseURL + `/ipam/domains/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Create new domain configuration.
   * @param domain - NAMDomain configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMDomain
   * @example
   * ```typescript
   * const d = await nam.domains.addDomain({
   *   name: 'netbox',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
  async addDomain(
    domain: NAMDomain,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMDomain> {
    const response = await this.post<NAMDomain>(
      this.config.baseURL + `/ipam/domains/` + queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(domain) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Update existing domain with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param domain - Partial NAMDomain object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMDomain
   * @example
   * ```typescript
   * const updated = await nam.domains.patchDomain('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchDomain(
    id: string | ObjectId,
    domain: Partial<NAMDomain>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMDomain> {
    const response = await this.patch<NAMDomain>(
      this.config.baseURL +
        `/ipam/domains/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(domain) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Replace existing domain with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param domain - Complete NAMDomain configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMDomain
   * @example
   * ```typescript
   * const domain = await nam.domains.updateDomain('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
  async updateDomain(
    id: string | ObjectId,
    domain: NAMDomain,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMDomain> {
    const response = await this.put<NAMDomain>(
      this.config.baseURL +
        `/ipam/domains/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(domain) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Delete domain configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMDomain
   * @example
   * ```typescript
   * await nam.domains.deleteDomain('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteDomain(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMDomain> {
    const response = await this.delete<NAMDomain>(
      this.config.baseURL +
        `/ipam/domains/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
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
