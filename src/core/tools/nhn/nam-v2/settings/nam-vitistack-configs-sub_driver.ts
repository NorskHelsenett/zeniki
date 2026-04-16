import { ObjectId } from "mongodb";
import { HTTPError, NAMAPIEndpoint, NAMParams, NAMResponse, NAMVitistackConfig } from "../../../../../types";
import { RequestConfig, ResponseGeneric, ZenikiCoreDriver } from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM Vitistack Configs Sub-Driver for managing Vitistack configurations.
 * Provides methods to retrieve, create, update, and delete Vitistack configurations.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const configs = await nam.vitistack_configs.getVitistackConfigs({ vendor_type: 'netbox' });
 * ```
 */
export class NAMVitistackConfigsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve specific Vitistack configuration by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMVitistackConfig
   * @example
   * ```typescript
   * const config = await nam.vitistack_configs.getVitistackConfig('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getVitistackConfig(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMVitistackConfig> {
    const response = await this.get<NAMVitistackConfig>(
      this.config.baseURL +
        `/settings/vitistack-configs/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieve paginated list of Vitistack configurations.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMVitistackConfig collection
   * @example
   * ```typescript
   * const configs = await nam.vitistack_configs.getVitistackConfigs({ vendor_type: 'netbox' });
   * ```
   */
  async getVitistackConfigs(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMVitistackConfig>> {
    const response = await this.get<NAMResponse<NAMVitistackConfig>>(
      this.config.baseURL +
        `/settings/vitistack-configs/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Create new Vitistack configuration.
   * @param config - NAMVitistackConfig configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMVitistackConfig
   * @example
   * ```typescript
   * const config = await nam.vitistack_configs.addVitistackConfig({
   *   name: 'netbox',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
    // async addVitistackConfig(
    //   config: NAMVitistackConfig,
    //   params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMVitistackConfig > {
    //   const response = await this.post<NAMVitistackConfig>(
    //     this.config.baseURL +
    //       `/settings/vitistack-configs/` +
    //       queryBuilderSync(params as any),
    //     { ...this.config, method: "POST", body: JSON.stringify(config) }
    //   );

    //   if (response.ok) {
    //     return await response.json();
    //   } else {
    //     throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    //   }
    // }

  /**
   * Update existing Vitistack configuration with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param config - Partial NAMVitistackConfig object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMVitistackConfig
   * @example
   * ```typescript
   * const updated = await nam.vitistack_configs.patchVitistackConfig('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
    // async patchVitistackConfig(
    //   id: string | ObjectId,
    //   config: Partial<NAMVitistackConfig>,
    //   params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMVitistackConfig> {
    //   const response = await this.patch<NAMVitistackConfig>(
    //     this.config.baseURL +
    //       `/settings/vitistack-configs/${id}/` +
    //       queryBuilderSync(params as any),
    //     { ...this.config, method: "PATCH", body: JSON.stringify(config) }
    //   );

    //   if (response.ok) {
    //     return await response.json();
    //   } else {
    //     throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    //   }
    // }

  /**
   * Replace existing Vitistack configuration with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param config - Complete NAMVitistackConfig configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMVitistackConfig
   * @example
   * ```typescript
   * const updated = await nam.vitistack_configs.updateVitistackConfig('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
    // async updateVitistackConfig(
    //   id: string | ObjectId,
    //   config: NAMVitistackConfig,
    //   params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMVitistackConfig > {
    //   const response = await this.put<NAMVitistackConfig>(
    //     this.config.baseURL +
    //       `/settings/vitistack-configs/${id}/` +
    //       queryBuilderSync(params as any),
    //     { ...this.config, method: "PUT", body: JSON.stringify(config) }
    //   );

    //   if (response.ok) {
    //     return await response.json();
    //   } else {
    //     throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    //   }
    // }

  /**
   * Delete Vitistack configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMVitistackConfig
   * @example
   * ```typescript
   * await nam.vitistack_configs.deleteVitistackConfig('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
    // async deleteVitistackConfig(
    //   id: string | ObjectId,
    //   params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMVitistackConfig> {
    //   const response = await this.delete<NAMVitistackConfig>(
    //     this.config.baseURL +
    //       `/settings/vitistack-configs/${id}/` +
    //       queryBuilderSync(params as any),
    //     { ...this.config, method: "DELETE" }
    //   );

    //   if (response.ok) {
    //     return await response.json();
    //   } else {
    //     throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    //   }
    // }

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
