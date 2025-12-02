import {
  FortiOSSystemVDOM,
  FortiOSParams,
  FortiOSResponse,
  FortiOSRevisionResponse,
  HTTPError,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * FortiOS system VDOM management sub-driver.
 * Provides CRUD operations for FortiOS system VDOM objects including creation, retrieval,
 * updates, and deletion. Supports multi-VDOM environments with type-safe API operations
 * and automatic pagination for large VDOM datasets.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const vdomDriver = new FortiOSVdomsSubDriver({
 *   baseURL: 'https://fortigate.example.com/api/v2',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * const vdom = await vdomDriver.getVdom('production');
 * await vdomDriver.addVdom({ name: 'development', 'short-name': 'dev' });
 * ```
 */
export class FortiOSVdomsSubDriver extends ZenikiCoreDriver {
  /**
   * Initialize FortiOS VDOM sub-driver with request configuration.
   * @param config - Request configuration for FortiOS API connection
   * @example
   * ```typescript
   * new FortiOSVdomsSubDriver({ baseURL: 'https://fortigate.example.com/api/v2' });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific system VDOM by name.
   * @param name - The system VDOM name
   * @param params - Optional query parameters
   * @returns Promise resolving to FortiOS response with VDOM configuration
   * @example
   * ```typescript
   * const vdom = await fortios.getVdom('production');
   * ```
   */
  async getVdom(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSSystemVDOM>> {
    const response = await this.get<FortiOSResponse<FortiOSSystemVDOM>>(
      this.config.baseURL +
        `/cmdb/system/vdom/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieve all system VDOMs.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to FortiOS response with VDOM configurations
   * @example
   * ```typescript
   * const vdoms = await fortios.getVdoms({ vdom: 'root' });
   * ```
   */
  async getVdoms(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSSystemVDOM>> {
    const response = await this.get<FortiOSResponse<FortiOSSystemVDOM>>(
      this.config.baseURL +
        `/cmdb/system/vdom/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Create a new system VDOM.
   * @param vdom - System VDOM configuration object
   * @param params - Optional parameters for validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.addVdom({ name: 'development', 'short-name': 'dev' });
   * ```
   */
  async addVdom(
    vdom: FortiOSSystemVDOM,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/system/vdom/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(vdom) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Delete a system VDOM.
   * @param name - The system VDOM name
   * @param params - Optional parameters for validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.deleteVdom('old-tenant-vdom');
   * ```
   */
  async deleteVdom(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/system/vdom/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Update an existing system VDOM.
   * @param name - The system VDOM name
   * @param vdom - Updated system VDOM configuration
   * @param params - Optional parameters for validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.updateVdom('production', { 'short-name': 'prod' });
   * ```
   */
  async updateVdom(
    name: string,
    vdom: FortiOSSystemVDOM,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/system/vdom/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(vdom) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Advanced pagination implementation for FortiOS API endpoints.
   * @protected
   * @template T - Expected response data type
   * @param url - The FortiOS API endpoint URL
   * @param params - Optional query parameters with pagination controls
   * @returns Promise resolving to complete paginated response
   * @example
   * ```typescript
   * await this.next('/cmdb/system/vdom', { count: 100 });
   * ```
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
    const size = data.results?.length || 0;
    let index = params.count;
    tmp = data.results || [];

    while (data.next || (size > 0 && index < size)) {
      if (data.next) {
        const response = await this.get<any>(data.next, {
          ...this.config,
          method: "GET",
        });
        data = await response.json();
      } else {
        params["skip"] = index;
        const response = await this.get<any>(
          this.config.baseURL + url + queryBuilderSync(params as any),
          { ...this.config, method: "GET" }
        );
        data = await response.json();
      }
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
