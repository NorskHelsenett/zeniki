import {
  FortiOSFirewallAddress,
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
 * FortiOS IPv4 firewall address management sub-driver.
 * Provides CRUD operations for FortiOS IPv4 address objects including creation, retrieval,
 * updates, and deletion. Supports multi-VDOM environments with type-safe API operations
 * and automatic pagination for large address datasets.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const addressDriver = new FortiOSAddressSubDriver({
 *   baseURL: 'https://fortigate.example.com/api/v2',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * const address = await addressDriver.getAddress('web-server');
 * await addressDriver.addAddress({ name: 'app-server', type: 'ipmask', subnet: '10.0.1.0/24' });
 * ```
 */
export class FortiOSAddressSubDriver extends ZenikiCoreDriver {
  /**
   * Initialize FortiOS address sub-driver with request configuration.
   * @param config - Request configuration for FortiOS API connection
   * @example
   * ```typescript
   * new FortiOSAddressSubDriver({ baseURL: 'https://fortigate.example.com/api/v2' });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific IPv4 firewall address object by name.
   * @param name - The IPv4 firewall address name
   * @param params - Optional query parameters
   * @returns Promise resolving to FortiOS response with address object
   * @example
   * ```typescript
   * const address = await fortios.getAddress('web-server-01');
   * ```
   */
  async getAddress(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress>> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress>>(
      this.config.baseURL +
        `/cmdb/firewall/address/${encodeURIComponent(name)}/${queryBuilderSync(
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
   * Retrieve all IPv4 firewall address objects.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to FortiOS response with address array
   * @example
   * ```typescript
   * const addresses = await fortios.getAddresses({ vdom: 'production' });
   * ```
   */
  async getAddresses(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress>> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress>>(
      this.config.baseURL +
        `/cmdb/firewall/address/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Create a new IPv4 firewall address object.
   * @param address - IPv4 firewall address configuration
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * const result = await fortios.addAddress({
   *   name: 'web-server',
   *   type: 'ipmask',
   *   subnet: '192.168.100.0/24'
   * });
   * ```
   */
  async addAddress(
    address: FortiOSFirewallAddress,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(address) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Delete an IPv4 firewall address object.
   * @param name - The IPv4 firewall address name
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.deleteAddress('old-server-address');
   * ```
   */
  async deleteAddress(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address/${encodeURIComponent(name)}/${queryBuilderSync(
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
   * Update an existing IPv4 firewall address object.
   * @param name - The IPv4 firewall address name
   * @param address - Updated IPv4 firewall address configuration
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.updateAddress('web-server-01', { subnet: '192.168.1.101/32' });
   * ```
   */
  async updateAddress(
    name: string,
    address: FortiOSFirewallAddress,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(address) }
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
   * await this.next('/cmdb/firewall/address', { count: 100 });
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
