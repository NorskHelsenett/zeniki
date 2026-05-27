import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMFagIntegrator,
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
 * NAM FortiGate Address Group (FAG) Integrators Sub-Driver for managing FAG integrator configurations.
 * Provides methods to retrieve, create, update, and delete FAG integrators.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const integrators = await nam.fag_integrators.getFagIntegrators({ enabled: true });
 * ```
 */
export class NAMFagIntegratorsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific FAG integrator by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMFagIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.fag_integrators.getFagIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getFagIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMFagIntegrator> {
    const response = await this.get<NAMFagIntegrator>(
      this.config.baseURL +
      `/vendors/fortinet/fortigate-address-group-integrators/${id}/` +
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
   * Retrieve paginated list of FAG integrators.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMFagIntegrator collection
   * @example
   * ```typescript
   * const integrators = await nam.fag_integrators.getFagIntegrators({ enabled: true });
   * ```
   */
  async getFagIntegrators(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMFagIntegrator>> {
    const response = await this.get<NAMResponse<NAMFagIntegrator>>(
      this.config.baseURL +
      `/vendors/fortinet/fortigate-address-group-integrators/` +
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
   * Create a new FAG integrator configuration.
   * @param integrator - NAMFagIntegrator configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMFagIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.fag_integrators.addFagIntegrator({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
  async addFagIntegrator(
    integrator: NAMFagIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMFagIntegrator> {
    const response = await this.post<NAMFagIntegrator>(
      this.config.baseURL +
      `/vendors/fortinet/fortigate-address-group-integrators/` +
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
   * Update existing FAG integrator with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Partial NAMFagIntegrator object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMFagIntegrator
   * @example
   * ```typescript
   * const updated = await nam.fag_integrators.patchFagIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchFagIntegrator(
    id: string | ObjectId,
    integrator: Partial<NAMFagIntegrator>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMFagIntegrator> {
    const response = await this.patch<NAMFagIntegrator>(
      this.config.baseURL +
      `/vendors/fortinet/fortigate-address-group-integrators/${id}/` +
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
   * Replace existing FAG integrator with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Complete NAMFagIntegrator configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMFagIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.fag_integrators.updateFagIntegrator('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   enabled: true
   * });
   * ```
   */
  async updateFagIntegrator(
    id: string | ObjectId,
    integrator: NAMFagIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMFagIntegrator> {
    const response = await this.put<NAMFagIntegrator>(
      this.config.baseURL +
      `/vendors/fortinet/fortigate-address-group-integrators/${id}/` +
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
   * Delete FAG integrator configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMFagIntegrator
   * @example
   * ```typescript
   * await nam.fag_integrators.deleteFagIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteFagIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMFagIntegrator> {
    const response = await this.delete<NAMFagIntegrator>(
      this.config.baseURL +
      `/vendors/fortinet/fortigate-address-group-integrators/${id}/` +
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
