import { ObjectId } from "mongodb";
import { HTTPError, NAMContainer, NAMParams, NAMResponse } from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM Containers Sub-Driver for managing Containers configurations.
 * Provides methods to retrieve, create, update, and delete Containers.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const containers = await nam.containers.getContainers({ name: 'container1' });
 * ```
 */
export class NAMContainersSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve specific container by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMContainer
   * @example
   * ```typescript
   * const container = await nam.containers.getContainer('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getContainer(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMContainer> {
    const response = await this.get<NAMContainer>(
      this.config.baseURL +
        `/dcim/containers/${id}/` +
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
   * Retrieve paginated list of Containers.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMContainer collection
   * @example
   * ```typescript
   * const containers = await nam.containers.getContainers({ name: 'container1' });
   * ```    
   */
  async getContainers(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMContainer>> {
    const response = await this.get<NAMResponse<NAMContainer>>(
      this.config.baseURL + `/dcim/containers/` + queryBuilderSync(params as any),
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
   * Create new container configuration.
   * @param container - NAMContainer configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMContainer 
   * @example
   * ```typescript
   * const d = await nam.containers.addContainer({
   *   name: 'netbox',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
    // async addContainer(
    //     container: NAMContainer,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMContainer> {
    //     const response = await this.post<NAMContainer>(
    //     this.config.baseURL + `/dcim/containers/` + queryBuilderSync(params as any),
    //     { ...this.config, method: "POST", body: JSON.stringify(container) }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );
    //     }
    // }

  /**
   * Update existing container with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param container - Partial NAMContainer object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMContainer
   * @example
   * ```typescript
   * const updated = await nam.containers.patchContainer('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
    // async patchContainer(
    //     id: string | ObjectId,
    //     container: Partial<NAMContainer>,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMContainer> {
    //     const response = await this.patch<NAMContainer>(
    //     this.config.baseURL +
    //         `/dcim/containers/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "PATCH", body: JSON.stringify(container) }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );
    //     }
    // }

  /**
   * Replace existing container with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param container - Complete NAMContainer configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMContainer
   * @example
   * ```typescript
   * const container = await nam.containers.updateContainer('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
    // async updateContainer(
    //     id: string | ObjectId,
    //     container: NAMContainer,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMContainer> {
    //     const response = await this.put<NAMContainer>(
    //     this.config.baseURL +
    //         `/dcim/containers/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "PUT", body: JSON.stringify(container) }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );
    //     }
    // }

  /**
   * Delete container configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMContainer
   * @example
   * ```typescript
   * await nam.containers.deleteContainer('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
    //   async deleteContainer(
    //     id: string | ObjectId,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    //   ): Promise<NAMContainer> {
    //     const response = await this.delete<NAMContainer>(
    //       this.config.baseURL +
    //         `/dcim/containers/${id}/` +
    //         queryBuilderSync(params as any),
    //       { ...this.config, method: "DELETE" }
    //     );

    //     if (response.ok) {
    //       return await response.json();
    //     } else {
    //       throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //       );
    //     }
    //   }

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
