import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMParams,
  NAMPassIntegrator,
  NAMResponse,
} from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM ROR Integrators Sub-Driver for managing ROR integrator configurations.
 * Provides methods to retrieve, create, update, and delete ROR integrators.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const integrators = await nam.ror_integrators.getPassIntegrators({ enabled: true });
 * ```
 */
export class NAMPassIntegratorsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific ROR integrator by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMPassIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.ror_integrators.getPassIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getPassIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMPassIntegrator> {
    const response = await this.get<NAMPassIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/pass-integrators/${id}/` +
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
   * Retrieve paginated list of ROR integrators.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMPassIntegrator collection
   * @example
   * ```typescript
   * const integrators = await nam.ror_integrators.getPassIntegrators({ enabled: true });
   * ```
   */
  async getPassIntegrators(
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMResponse<NAMPassIntegrator>> {
    const response = await this.get<NAMResponse<NAMPassIntegrator>>(
      this.config.baseURL +
        `/vendors/nhn/pass-integrators/` +
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
   * Create a new ROR integrator configuration.
   * @param integrator - NAMPassIntegrator configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMPassIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.ror_integrators.addPassIntegrator({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
  async addPassIntegrator(
    integrator: NAMPassIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMPassIntegrator> {
    const response = await this.post<NAMPassIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/pass-integrators/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(integrator) },
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
   * Update existing ROR integrator with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Partial NAMPassIntegrator object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMPassIntegrator
   * @example
   * ```typescript
   * const updated = await nam.ror_integrators.patchPassIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchPassIntegrator(
    id: string | ObjectId,
    integrator: Partial<NAMPassIntegrator>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMPassIntegrator> {
    const response = await this.patch<NAMPassIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/pass-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(integrator) },
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
   * Replace existing ROR integrator with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Complete NAMPassIntegrator configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMPassIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.ror_integrators.updatePassIntegrator('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   enabled: true
   * });
   * ```
   */
  async updatePassIntegrator(
    id: string | ObjectId,
    integrator: NAMPassIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMPassIntegrator> {
    const response = await this.put<NAMPassIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/pass-integrators/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(integrator) },
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
   * Delete ROR integrator configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMPassIntegrator
   * @example
   * ```typescript
   * await nam.ror_integrators.deletePassIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deletePassIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMPassIntegrator> {
    const response = await this.delete<NAMPassIntegrator>(
      this.config.baseURL +
        `/vendors/nhn/pass-integrators/${id}/` +
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
