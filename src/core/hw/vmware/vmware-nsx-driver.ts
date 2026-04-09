import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../base/zeniki-core-driver";
import { VMwareNSXResponse } from "../../../types/hw/vmware/nsx/shared/vmware-nsx-response";
import { VMwareNSXGroup } from "../../../types/hw/vmware/nsx/policy/groups/vmware-nsx-group";
import { VMwareNSXParams } from "../../../types/hw/vmware/nsx/shared/vmware-nsx-params";
import { VMwareNsxModifyResponse } from "../../../types";
import { queryBuilderSync } from "../../utils";
import { HTTPError } from "../../../types/shared/errors/http-error";
import { VMwareNSXGroupsSubDriver } from "./groups/vmware-nsx-groups-sub_driver";
import { VMwareNSXSearchSubDriver } from "./search/vmware-nsx-search-sub_driver";
import { VMwareNSXVirtualInterfacesSubDriver } from "./inventory/vmware-nsx-virtual-interfaces-sub_driver";
import { VMwareNSXSitesSubDriver } from "./sites/vmware-nsx-sites-sub_driver";
import { VMwareNSXVirtualMachinesSubDriver } from "./virtual-machines/vmware-nsx-virtual-machines-sub_driver";

/**
 * VMware NSX-T driver for policy-based network security and micro-segmentation.
 * Provides type-safe NSX Policy API operations via sub-drivers and generic methods.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const authString = btoa('admin:VMware123!');
 * const nsx = new VMwareNSXDriver({ baseURL: 'https://nsx.example.com', headers: { 'Authorization': `Basic ${authString}`, 'Content-Type': 'application/json' } });
 * const group = await nsx.groups.getGroup('web-servers', 'default');
 * await nsx.groups.addGroup('app-servers', 'default', { display_name: 'App Servers', resource_type: 'Group', expression: [{ resource_type: 'Condition', member_type: 'VirtualMachine', key: 'Tag', value: 'app' }] });
 * const domains = await nsx.getByUrl('/policy/api/v1/infra/domains');
 * ```
 */
export class VMwareNSXDriver extends ZenikiCoreDriver {
  public groups: VMwareNSXGroupsSubDriver;
  public search: VMwareNSXSearchSubDriver;
  public sites: VMwareNSXSitesSubDriver;
  public virtualInterfaces: VMwareNSXVirtualInterfacesSubDriver;
  public virtual_machines: VMwareNSXVirtualMachinesSubDriver;

  constructor(public config: RequestConfig) {
    super(config);
    this.groups = new VMwareNSXGroupsSubDriver(config);
    this.search = new VMwareNSXSearchSubDriver(config);
    this.sites = new VMwareNSXSitesSubDriver(config);
    this.virtualInterfaces = new VMwareNSXVirtualInterfacesSubDriver(config);
    this.virtual_machines = new VMwareNSXVirtualMachinesSubDriver(config);
  }

  /**
   * Execute HTTP GET request to any NSX Policy API endpoint.
   *
   * @template T - Expected response data type
   * @param path - NSX API endpoint URL
   * @param params - Optional query parameters
   * @returns Promise resolving to typed NSX response
   * @example
   * ```typescript
   * const domains = await nsx.getByUrl('/policy/api/v1/infra/domains', { page_size: 100 });
   * ```
   */
  async getByUrl<T>(
    path: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
  ): Promise<T> {
    const response = await this.get<T>(
      this.config.baseURL + path + queryBuilderSync(params as any),
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
   * Execute paginated HTTP GET request with optional automatic result aggregation.
   *
   * @template T - Expected response data type
   * @param path - NSX API endpoint URL
   * @param params - Optional query parameters (page_size, cursor)
   * @param follow - Enable automatic pagination
   * @default false
   * @returns Promise resolving to paginated NSX response
   * @example
   * ```typescript
   * const policies = await nsx.getPaginatedByUrl('/policy/api/v1/infra/domains/default/security-policies', { page_size: 50 }, true);
   * ```
   */
  async getPaginatedByUrl<T>(
    path: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    follow = false,
  ): Promise<T> {
    if (follow) {
      const response = await this.next<T>(
        path,
        params,
      );

      return await response.json();
    }

    const response = await this.get<T>(
      this.config.baseURL + path + queryBuilderSync(params as any),
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
   * Internal pagination handler for NSX API response aggregation.
   *
   * @template T - Expected response data type
   * @param path - NSX API endpoint URL
   * @param params - Optional pagination parameters (count, skip)
   * @returns Promise resolving to aggregated paginated response
   * @protected
   * @example
   * ```typescript
   * const response = await this.next('/policy/api/v1/infra/domains', { count: 100, skip: 1 });
   * ```
   */
  protected async next<T>(
    path: string | URL | Request,
    params?: { [key: string]: any } | VMwareNSXParams,
  ): Promise<ResponseGeneric<T>> {
    if (!params) {
      params = {
        cursor: 0,
      };
    }

    let tmp: any[] = [];
    const res = await this.get<any>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" },
    );

    if (!res.ok) {
      throw new HTTPError(res.statusText, res.status, res);
    }

    let data = await res.json();
    let result_count = data.result_count || 0;
    let cursor = data.cursor || 0;
    tmp = data.results || [];

    while (result_count > cursor) {
      if (params && !params?.cursor) {
        params["cursor"] = cursor;
      } else {
        params.cursor = cursor;
      }

      const res = await this.get<any>(
        this.config.baseURL + path + queryBuilderSync(params as any),
        { ...this.config, method: "GET" },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          tmp = tmp.concat(data.results);
          result_count = data.result_count || 0;
          cursor = data.cursor || 0;
        }
      } else {
        throw new HTTPError(res.statusText, res.status, res);
      }
    }

    const finalData: any = {
      ...data,
      results: tmp,
      result_count: tmp.length,
      cursor: tmp.length,
    };

    return {
      ...res,
      json: async () => finalData,
    } as ResponseGeneric<T>;
  }
}
