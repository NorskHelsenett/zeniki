import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMBigIPIntegrator,
  NAMParams,
  NAMResponse,
} from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

export class NAMBigIPIntegratorsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific F5 Integrator by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMF5Integrator
   * @example
   * ```typescript
   * const integrator = await nam.getF5Integrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getBigIPIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMBigIPIntegrator> {
    const response = await this.get<NAMBigIPIntegrator>(
      this.config.baseURL +
        `/vendors/f5/bigip-integrators/${id}/` +
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
   * Retrieve paginated list of BigIP Integrators.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMBigIPIntegrator collection
   * @example
   * ```typescript
   * const integrators = await nam.getBigIPIntegrators({ enabled: true });
   * ```
   */
  async getBigIPIntegrators(
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMResponse<NAMBigIPIntegrator>> {
    const response = await this.get<NAMResponse<NAMBigIPIntegrator>>(
      this.config.baseURL +
        `/vendors/f5/bigip-integrators` +
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
   * Create a new BigIP Integrator configuration.
   * @param integrator - NAMBigIPIntegrator configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMBigIPIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.addBigIPIntegrator({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
  async addBigIPIntegrator(
    integrator: NAMBigIPIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMBigIPIntegrator> {
    const response = await this.post<NAMBigIPIntegrator>(
      this.config.baseURL +
        `/vendors/f5/bigip-integrators` +
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
   * Update existing BigIP Integrator with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Partial NAMBigIPIntegrator object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMBigIPIntegrator
   * @example
   * ```typescript
   * const updated = await nam.patchBigIPIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchBigIPIntegrator(
    id: string | ObjectId,
    integrator: Partial<NAMBigIPIntegrator>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMBigIPIntegrator> {
    const response = await this.patch<NAMBigIPIntegrator>(
      this.config.baseURL +
        `/vendors/f5/bigip-integrators/${id}/` +
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
   * Replace existing BigIP Integrator with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Complete NAMBigIPIntegrator configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMBigIPIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.updateBigIPIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { name: 'updated' });
   * ```
   */
  async updateBigIPIntegrator(
    id: string | ObjectId,
    integrator: NAMBigIPIntegrator,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMBigIPIntegrator> {
    const response = await this.put<NAMBigIPIntegrator>(
      this.config.baseURL +
        `/vendors/f5/bigip-integrators/${id}/` +
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
   * Delete BigIP Integrator configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMBigIPIntegrator
   * @example
   * ```typescript
   * await nam.deleteBigIPIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteBigIPIntegrator(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams,
  ): Promise<NAMBigIPIntegrator> {
    const response = await this.delete<NAMBigIPIntegrator>(
      this.config.baseURL +
        `/vendors/f5/bigip-integrators/${id}/` +
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
