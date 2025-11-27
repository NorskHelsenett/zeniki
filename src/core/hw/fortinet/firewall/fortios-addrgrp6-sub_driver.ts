import {
  FortiOSFirewallAddrGrp6,
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
 * FortiOS IPv6 firewall address group management sub-driver.
 * Provides CRUD operations for FortiOS IPv6 address group objects including creation, retrieval,
 * updates, and deletion. Supports multi-VDOM environments with type-safe API operations
 * and automatic pagination for large address group datasets.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const addrgrp6Driver = new FortiOSAddrgrp6SubDriver({
 *   baseURL: 'https://fortigate.example.com/api/v2',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * const group = await addrgrp6Driver.getAddressGroup6('ipv6-servers');
 * await addrgrp6Driver.addAddressGroup6({ name: 'ipv6-apps', member: [{ name: 'ipv6-web' }] });
 * ```
 */
export class FortiOSAddrgrp6SubDriver extends ZenikiCoreDriver {
  /**
   * Initialize FortiOS IPv6 address group sub-driver with request configuration.
   * @param config - Request configuration for FortiOS API connection
   * @example
   * ```typescript
   * new FortiOSAddrgrp6SubDriver({ baseURL: 'https://fortigate.example.com/api/v2' });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific IPv6 firewall address group by name.
   * @param name - The IPv6 firewall address group name
   * @param params - Optional query parameters
   * @returns Promise resolving to FortiOS response with IPv6 address group
   * @example
   * ```typescript
   * const group = await fortios.getAddressGroup6('ipv6-servers');
   * ```
   */
  async getAddressGroup6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddrGrp6>> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddrGrp6>>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieve all IPv6 firewall address groups.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to FortiOS response with IPv6 address groups
   * @example
   * ```typescript
   * const groups = await fortios.getAddressGroups6({ vdom: 'production' });
   * ```
   */
  async getAddressGroups6(
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSResponse<FortiOSFirewallAddrGrp6>> {
    const response = await this.get<FortiOSResponse<FortiOSFirewallAddrGrp6>>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Create a new IPv6 firewall address group.
   * @param addressGroup - IPv6 firewall address group configuration
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.addAddressGroup6({ name: 'ipv6-servers', member: [{ name: 'ipv6-web' }] });
   * ```
   */
  async addAddressGroup6(
    addressGroup: FortiOSFirewallAddrGrp6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.post<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${queryBuilderSync(params as any)}`,
      { ...this.config, method: "POST", body: JSON.stringify(addressGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete an IPv6 firewall address group.
   * @param name - The IPv6 firewall address group name
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.deleteAddressGroup6('old-ipv6-group');
   * ```
   */
  async deleteAddressGroup6(
    name: string,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.delete<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update an existing IPv6 firewall address group.
   * @param name - The IPv6 firewall address group name
   * @param addressGroup - Updated IPv6 address group configuration
   * @param params - Optional parameters for VDOM and validation
   * @returns Promise resolving to FortiOS revision response
   * @example
   * ```typescript
   * await fortios.updateAddressGroup6('ipv6-servers', { member: [{ name: 'ipv6-web' }] });
   * ```
   */
  async updateAddressGroup6(
    name: string,
    addressGroup: FortiOSFirewallAddrGrp6,
    params?: { [key: string]: any } | FortiOSParams | URLSearchParams
  ): Promise<FortiOSRevisionResponse> {
    const response = await this.put<FortiOSRevisionResponse>(
      this.config.baseURL +
        `/cmdb/firewall/addrgrp6/${encodeURIComponent(name)}/${queryBuilderSync(
          params as any
        )}`,
      { ...this.config, method: "PUT", body: JSON.stringify(addressGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
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
   * await this.next('/cmdb/firewall/addrgrp6', { count: 100 });
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
