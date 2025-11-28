import {
  FortiOSFirewallAddress6,
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
 * FortiOS IPv6 firewall address management sub-driver.
 * Provides CRUD operations for FortiOS IPv6 address objects including creation, retrieval,
 * updates, and deletion. Supports multi-VDOM environments with type-safe API operations
 * and automatic pagination for large address datasets.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const address6Driver = new FortiOSAddress6SubDriver({
 *   baseURL: 'https://fortigate.example.com/api/v2',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * const address = await address6Driver.getAddress6('ipv6-server');
 * await address6Driver.addAddress6({ name: 'ipv6-app', ip6: '2001:db8::/64' });
 * ```
 */
export class FortiOSAddress6SubDriver extends ZenikiCoreDriver {
  /**
   * Initialize FortiOS IPv6 address sub-driver with request configuration.
   * @param config - Request configuration for FortiOS API connection
   * @example
   * ```typescript
   * new FortiOSAddress6SubDriver({ baseURL: 'https://fortigate.example.com/api/v2' });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific IPv6 firewall address object by name.
   * @param name - The IPv6 firewall address name
   * @param params - Optional query parameters
   * @returns Promise resolving to FortiOS response with IPv6 address
   * @example
   * ```typescript
   * const address = await fortios.getAddress6('ipv6-web-server');
   * ```
   */
  async getAddress6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress6>> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress6>>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${encodeURIComponent(name)}/${queryBuilderSync(
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
   * Retrieve all IPv6 firewall address objects.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to FortiOS response with IPv6 addresses
   * @example
   * ```typescript
   * const addresses = await fortios.getAddresses6({ vdom: 'production' });
   * ```
   */
  async getAddresses6(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddress6>> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddress6>>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Create a new IPv6 firewall address object.
   * @param address - IPv6 firewall address configuration
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.addAddress6({ name: 'ipv6-server', ip6: '2001:db8::/64' });
   * ```
   */
  async addAddress6(
    address: FortiOSFirewallAddress6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(address) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Delete an IPv6 firewall address object.
   * @param name - The IPv6 firewall address name
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.deleteAddress6('old-ipv6-server');
   * ```
   */
  async deleteAddress6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${encodeURIComponent(name)}/${queryBuilderSync(
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
   * Update an existing IPv6 firewall address object.
   * @param name - The IPv6 firewall address name
   * @param address - Updated IPv6 firewall address configuration
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.updateAddress6('ipv6-server', { ip6: '2001:db8::100/128' });
   * ```
   */
  async updateAddress6(
    name: string,
    address: FortiOSFirewallAddress6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/address6/${encodeURIComponent(name)}/${queryBuilderSync(
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
   * await this.next('/cmdb/firewall/address6', { count: 100 });
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
