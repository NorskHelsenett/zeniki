import {
  ZenikiCoreDriver,
  RequestConfig,
  ResponseGeneric,
} from "../../base/zeniki-core-driver";
import { NetboxPaginated } from "../../../types/tools/netbox/shared/netbox-paginated";
import { queryBuilderSync } from "../../utils";
import { NetboxParams } from "../../../types/tools/netbox/shared/netbox-params";
import { HTTPError } from "../../../types";
import { NetboxCustomFieldsSubDriver } from "./extras/netbox-custom-fields-sub_driver";
import { NetboxPrefixesSubDriver } from "./ipam/netbox-prefixes-sub_driver";
import { NetboxTenantsSubDriver } from "./tenancy/netbox-tenants-sub_driver";
import { NetboxTagsSubDriver } from "./extras/netbox-tags-sub_driver";
import { NetboxVrfsSubDriver } from "./ipam/netbox-vrfs-sub_driver";
import { NetboxVlansSubDriver } from "./ipam/netbox-vlans-sub_driver";
import { NetboxDevicesSubDriver } from "./dcim/netbox-devices-sub_driver";
import { NetboxDeviceTypesSubDriver } from "./dcim/netbox-device-types_sub_driver";

/**
 * NetBox API driver providing type-safe interface for NetBox REST API.
 * Manages IPAM, DCIM, Tenancy, and Extras through specialized sub-drivers.
 * Supports flexible type system, pagination, and generic endpoint access.
 *
 * @class NetboxDriver
 * @extends ZenikiCoreDriver
 * @copyright Copyright 2025 Norsk Helsenett SF
 * @author Kevin Andre Vatn <kevin.vatn@nhn.no>
 *
 * @example
 * ```typescript
 * const netbox = new NetboxDriver({
 *   baseURL: 'https://netbox.example.com/api',
 *   headers: { 'Authorization': 'Token your-token' }
 * });
 * const prefix = await netbox.prefixes.addPrefix({
 *   prefix: '10.0.0.0/24',
 *   status: 'active',
 *   description: 'Production',
 *   site: 1,
 *   tenant: 5,
 *   vrf: 10
 * });
 * ```
 */
export class NetboxDriver extends ZenikiCoreDriver {
  public custom_fields: NetboxCustomFieldsSubDriver;
  public prefixes: NetboxPrefixesSubDriver;
  public tenants: NetboxTenantsSubDriver;
  public tags: NetboxTagsSubDriver;
  public vrfs: NetboxVrfsSubDriver;
  public vlans: NetboxVlansSubDriver;
  public devices: NetboxDevicesSubDriver;
  public device_types: NetboxDeviceTypesSubDriver;

  constructor(config: RequestConfig) {
    super(config);

    this.custom_fields = new NetboxCustomFieldsSubDriver(config);
    this.prefixes = new NetboxPrefixesSubDriver(config);
    this.tenants = new NetboxTenantsSubDriver(config);
    this.tags = new NetboxTagsSubDriver(config);
    this.vrfs = new NetboxVrfsSubDriver(config);
    this.vlans = new NetboxVlansSubDriver(config);
    this.devices = new NetboxDevicesSubDriver(config);
    this.device_types = new NetboxDeviceTypesSubDriver(config);

  }

  /**
   * Retrieves data from any NetBox API endpoint using full URL.
   *
   * @template T - Expected response data type
   * @param url - Full URL to NetBox API endpoint
   * @param params - Optional query parameters
   * @returns Promise resolving to requested data
   * @throws {HTTPError} When URL is invalid or API errors occur
   *
   * @example
   * ```typescript
   * const data = await netbox.getByUrl(
   *   'https://netbox.example.com/api/ipam/vlans/456/'
   * );
   * ```
   */
  async getByUrl<T>(
    url: string,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<T> {
    // If URL is already absolute, use it directly; otherwise prepend baseURL
    const fullUrl = url.startsWith("http") ? url : this.config.baseURL + url;
    const response = await this.get<T>(
      fullUrl + queryBuilderSync(params as any),
      {
        ...this.config,
        method: "GET",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieves paginated data from any NetBox API endpoint using full URL.
   *
   * @template T - Expected response data type
   * @param url - Full URL to NetBox API endpoint
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated data
   * @throws {HTTPError} When URL is invalid or API errors occur
   *
   * @example
   * ```typescript
   * const devices = await netbox.getPaginatedByUrl(
   *   'https://netbox.example.com/api/dcim/devices/',
   *   { status: 'active' }
   * );
   * ```
   */
  async getPaginatedByUrl<T>(
    url: string,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<T> {
    if (follow) {
      const response = await this.next<T>(url, params);

      return await response.json();
    }

    // If URL is already absolute, use it directly; otherwise prepend baseURL
    const fullUrl = url.startsWith("http") ? url : this.config.baseURL + url;
    const response = await this.get<T>(
      fullUrl + queryBuilderSync(params as any),
      {
        ...this.config,
        method: "GET",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Handles automatic pagination for API responses.
   *
   * @template T - Expected response data type
   * @param path - API endpoint path
   * @param params - Optional query parameters
   * @returns Promise resolving to response with all results
   */
  protected async next<T>(
    path: string,
    params?: { [key: string]: any }
  ): Promise<ResponseGeneric<T>> {
    let tmp: any[] = [];
    // If URL is already absolute, use it directly; otherwise prepend baseURL
    let res = await this.get<any>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    tmp = data.results || [];

    while (data.next) {
      res = await this.get<any>(data.next, { ...this.config, method: "GET" });
      data = await res.json();
      if (data.results && data.results.length > 0) {
        tmp = tmp.concat(data.results);
      }
    }

    // Create final aggregated response
    const finalData: any = {
      ...data,
      results: tmp,
      count: tmp.length,
    };

    return {
      ...res,
      json: async () => finalData,
    } as ResponseGeneric<T>;
  }
}
