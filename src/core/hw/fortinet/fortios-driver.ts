import {
  ZenikiCoreDriver,
  ResponseGeneric,
  RequestConfig,
} from "../../base/zeniki-core-driver";
import { FortiOSResponse } from "../../../types/hw/fortios/shared/fortios-response";
import {
  FortiOSFirewallAddress,
  FortiOSFirewallAddress6,
  FortiOSFirewallAddrGrp,
  FortiOSFirewallAddrGrp6,
  FortiOSParams,
  FortiOSSystemVDOM,
  HTTPError,
} from "../../../types";
import { FortiOSRevisionResponse } from "../../../types/hw/fortios/shared/fortios-revision-response";
import { queryBuilderSync } from "../../utils";
import { FortiOSAddressSubDriver } from "./firewall/fortios-address-sub_driver";
import { FortiOSAddress6SubDriver } from "./firewall/fortios-address6-sub_driver";
import { FortiOSAddrgrpSubDriver } from "./firewall/fortios-addrgrp-sub_driver";
import { FortiOSAddrgrp6SubDriver } from "./firewall/fortios-addrgrp6-sub_driver";
import { FortiOSVdomsSubDriver } from "./system/fortios-vdoms-sub_driver";

/**
 * FortiOS 7.4.x API driver for firewall management with IPv4/IPv6 dual-stack support.
 * Provides comprehensive CMDB operations via specialized sub-drivers for addresses, address groups,
 * and VDOMs. Supports multi-VDOM environments, Security Fabric, ZTNA integration, and automatic
 * pagination for enterprise firewall automation.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const fortios = new FortiOSDriver({
 *   baseURL: 'https://firewall.company.com',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * await fortios.address.getAddress('web-server');
 * await fortios.addrgrp.addAddressGroup({ name: 'servers', member: [{ name: 'web-01' }] });
 * await fortios.vdoms.getVdom('production');
 * ```
 */
export class FortiOSDriver extends ZenikiCoreDriver {
  public address: FortiOSAddressSubDriver;
  public address6: FortiOSAddress6SubDriver;
  public addrgrp: FortiOSAddrgrpSubDriver;
  public addrgrp6: FortiOSAddrgrp6SubDriver;
  public vdoms: FortiOSVdomsSubDriver;

  /**
   * Initialize FortiOS API driver with configuration.
   * @param config - Request configuration including base URL and headers
   * @example
   * ```typescript
   * new FortiOSDriver({
   *   baseURL: 'https://fortigate.company.com',
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
    this.address = new FortiOSAddressSubDriver(config);
    this.address6 = new FortiOSAddress6SubDriver(config);
    this.addrgrp = new FortiOSAddrgrpSubDriver(config);
    this.addrgrp6 = new FortiOSAddrgrp6SubDriver(config);
    this.vdoms = new FortiOSVdomsSubDriver(config);
  }

  /**
   * Retrieve data from any FortiOS API endpoint by URL.
   * @template T - Expected response data type
   * @param url - The FortiOS API endpoint URL
   * @param params - Optional query parameters
   * @returns Promise resolving to typed response
   * @example
   * ```typescript
   * const data = await fortios.getByUrl<CustomType>('/cmdb/system/global');
   * ```
   */
  async getByUrl<T>(
    url: string,
    params?: { [key: string]: any }
  ): Promise<T> {
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieve paginated data from FortiOS API endpoint with optional auto-follow.
   * @template T - Expected response data type
   * @param url - The FortiOS API endpoint URL
   * @param params - Optional query parameters
   * @param follow - Automatically follow pagination (default: false)
   * @returns Promise resolving to paginated response
   * @example
   * ```typescript
   * const all = await fortios.getPaginatedByUrl('/cmdb/firewall/address', {}, true);
   * ```
   */
  async getPaginatedByUrl<T>(
    url: string,
    params?: { [key: string]: any },
    follow = false
  ): Promise<T> {
    if (follow) {
      const response = await this.next<T>(url, params);
      if (response.ok) {
        return await response.json();
      } else {
        throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
      }
    }
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
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
