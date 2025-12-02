import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMNsxIntegrator,
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
 * NAM NSX Integrators Sub-Driver for managing NSX integrator configurations.
 * Provides methods to retrieve, create, update, and delete NSX integrators.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const integrators = await nam.nsx_integrators.getNsxIntegrators({ enabled: true });
 * ```
 */
export class NAMNsxIntegratorsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific NSX integrator by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMNsxIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.nsx_integrators.getNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getNsxIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxIntegrator> {
    const response = await this.get<NAMNsxIntegrator>(
      this.config.baseURL +
        `/vendors/fortinet/fortigate-nsx-integrators/${id}/` +
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
   * Retrieve paginated list of NSX integrators.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMNsxIntegrator collection
   * @example
   * ```typescript
   * const integrators = await nam.nsx_integrators.getNsxIntegrators({ enabled: true });
   * ```
   */
  async getNsxIntegrators(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMNsxIntegrator>> {
    const response = await this.get<NAMResponse<NAMNsxIntegrator>>(
      this.config.baseURL +
        `/vendors/fortinet/fortigate-nsx-integrators/` +
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
   * Create a new NSX integrator configuration.
   * @param integrator - NAMNsxIntegrator configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMNsxIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.nsx_integrators.addNsxIntegrator({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
  async addNsxIntegrator(
    integrator: NAMNsxIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxIntegrator> {
    const response = await this.post<NAMNsxIntegrator>(
      this.config.baseURL +
        `/vendors/fortinet/fortigate-nsx-integrators/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update existing NSX integrator with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Partial NAMNsxIntegrator object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMNsxIntegrator
   * @example
   * ```typescript
   * const updated = await nam.nsx_integrators.patchNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchNsxIntegrator(
    id: string | ObjectId,
    integrator: Partial<NAMNsxIntegrator>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxIntegrator> {
    const response = await this.patch<NAMNsxIntegrator>(
      this.config.baseURL +
        `/vendors/fortinet/fortigate-nsx-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Replace existing NSX integrator with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Complete NAMNsxIntegrator configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMNsxIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.nsx_integrators.updateNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   enabled: true
   * });
   * ```
   */
  async updateNsxIntegrator(
    id: string | ObjectId,
    integrator: NAMNsxIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxIntegrator> {
    const response = await this.put<NAMNsxIntegrator>(
      this.config.baseURL +
        `/vendors/fortinet/fortigate-nsx-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(integrator) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete NSX integrator configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMNsxIntegrator
   * @example
   * ```typescript
   * await nam.nsx_integrators.deleteNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteNsxIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxIntegrator> {
    const response = await this.delete<NAMNsxIntegrator>(
      this.config.baseURL +
        `/vendors/fortinet/fortigate-nsx-integrators/${id}/` +
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
