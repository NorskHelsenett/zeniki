import {
  ZenikiCoreDriver,
  RequestConfig,
  ResponseGeneric,
} from "../../base/zeniki-core-driver";
import { VMwareNSXResponse } from "../../../types/hw/vmware/nsx/shared/vmware-nsx-response";
import { VMwareNSXGroup } from "../../../types/hw/vmware/nsx/policy/groups/vmware-nsx-group";
import { VMwareNSXParams } from "../../../types/hw/vmware/nsx/shared/vmware-nsx-params";
import { VMwareNsxModifyResponse } from "../../../types";
import { queryBuilderSync } from "../../utils";
import { HTTPError } from "../../../types/shared/errors/http-error";
import { VMWareNSXGroupsSubDriver } from "./groups/vmware-nsx-groups-sub_driver";

/**
 * VMware NSX-T driver for policy-based network security and micro-segmentation.
 * Provides type-safe NSX Policy API operations via sub-drivers (groups) and generic methods.
 * Supports local/global manager deployments, multi-domain environments, automatic pagination,
 * and comprehensive CRUD operations. Access groups via `nsx.groups.*` or use generic methods
 * `getByUrl()` and `getPaginatedByUrl()` for direct Policy API access.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const nsx = new VMWareNSXDriver({
 *   baseURL: 'https://nsx.example.com',
 *   auth: { username: 'admin', password: 'pass' },
 *   timeout: 30000
 * });
 * const group = await nsx.groups.getGroup('web-servers', 'default');
 * await nsx.groups.addGroup('app-servers', 'default', {
 *   display_name: 'App Servers',
 *   expression: [{ resource_type: 'Condition', member_type: 'VirtualMachine', value: 'app' }]
 * });
 * const domains = await nsx.getByUrl('/policy/api/v1/infra/domains');
 * ```
 */
export class VMWareNSXDriver extends ZenikiCoreDriver {
  public groups: VMWareNSXGroupsSubDriver;
  /**
   * Initialize VMware NSX driver with connection configuration.
   * @param config - Request configuration for NSX manager connection
   * @example
   * ```typescript
   * new VMWareNSXDriver({
   *   baseURL: 'https://nsx.example.com',
   *   auth: { username: 'admin', password: 'pass' }
   * });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
    this.groups = new VMWareNSXGroupsSubDriver(config);
  }

  /**
   * Execute HTTP GET request to any NSX Policy API endpoint.
   * @template T - Expected response data type
   * @param url - NSX API endpoint URL
   * @param params - Optional query parameters
   * @returns Promise resolving to typed NSX response
   * @example
   * ```typescript
   * await nsx.getByUrl('/policy/api/v1/infra/domains');
   * ```
   */
  async getByUrl<T>(url: string, params?: { [key: string]: any }): Promise<T> {
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Execute paginated HTTP GET request with optional automatic result aggregation.
   * @template T - Expected response data type
   * @param url - NSX API endpoint URL
   * @param params - Optional query parameters (page_size, cursor)
   * @param follow - Enable automatic pagination (default: false)
   * @returns Promise resolving to paginated NSX response
   * @example
   * ```typescript
   * await nsx.getPaginatedByUrl('/policy/api/v1/infra/domains', { page_size: 50 }, true);
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
        throw new HTTPError(response.statusText, response.status, response);
      }
    }
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Internal pagination handler for NSX API response aggregation.
   * @template T - Expected response data type
   * @param url - NSX API endpoint URL
   * @param params - Optional pagination parameters (count, skip)
   * @returns Promise resolving to aggregated paginated response
   * @protected
   * @example
   * ```typescript
   * await this.next('/policy/api/v1/infra/domains', { count: 100 });
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

    if (!res.ok) {
      throw new HTTPError(res.statusText, res.status, res);
    }

    let data = await res.json();
    const size = data.result_count || 0;
    let index = params.count;
    tmp = data.results || [];

    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" }
      );
      if (res.ok) {
        const pageData = await response.json();
        if (pageData.results && pageData.results.length > 0) {
          tmp = tmp.concat(pageData.results);
        }
        index += params.count;
      } else {
        throw new HTTPError(res.statusText, res.status, res);
      }
    }
    // Return ResponseGeneric wrapper with aggregated data
    return {
      ...res,
      json: async () => ({
        ...data,
        results: tmp,
        result_count: tmp.length,
      }),
    } as ResponseGeneric<T>;
  }
}
