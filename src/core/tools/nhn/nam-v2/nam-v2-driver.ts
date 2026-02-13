import {
  ZenikiCoreDriver,
  RequestConfig,
  ResponseGeneric,
} from "../../../base/zeniki-core-driver";
import { NAMResponse } from "../../../../types/tools/nhn/nam-v2/shared/nam-response";
import { HTTPError } from "../../../../types";
import { NAMParams } from "../../../../types/tools/nhn/nam-v2/shared/nam-params";
import { ObjectId } from "mongodb";
import { queryBuilderSync } from "../../../utils";
import { NAMNetboxIntegratorsSubDriver } from "./vendors/nam-netbox-integrators-sub_driver";
import { NAMRorIntegratorsSubDriver } from "./vendors/nam-ror-integrators-sub_driver";
import { NAMNsxIntegratorsSubDriver } from "./vendors/nam-nsx-integrators-sub_driver";
import { NAMAPIEndpointsSubDriver } from "./settings/nam-api-endpoints-sub_driver";
import { NAMDomainsSubDriver } from "./ipam/nam-domains-sub_driver";
import { NAMNsxSecurityGroupsSubDriver } from "./vendors/nam-nsx-security-groups-sub_driver";
import { NAMVitiNetworkPoliciesSubDriver } from "./vitistack/nam-viti-network-policies-sub_driver";
import { NAMAviIntegratorsSubDriver } from "./vendors/nam-avi-integrators-sub_driver";
import { NAMBigIPIntegratorsSubDriver } from "./vendors/nam-bigip-integrators-sub_driver";

/**
 * NAM v2 driver for network architecture management with specialized sub-drivers.
 * Manages NetBox integrators, ROR integrators, NSX integrators, and API endpoints through dedicated
 * sub-drivers. Supports MongoDB ObjectId operations, automated pagination, and enterprise-grade
 * network orchestration.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const nam = new NAMv2Driver({
 *   baseURL: 'https://nam.company.com/api/v2',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * await nam.netbox_integrators.getNetboxIntegrators();
 * await nam.ror_integrators.getRorIntegrators();
 * await nam.nsx_integrators.getNsxIntegrators();
 * await nam.api_endpoints.getApiEndpoints();
 * ```
 */
export class NAMv2Driver extends ZenikiCoreDriver {
  public netbox_integrators: NAMNetboxIntegratorsSubDriver;
  public ror_integrators: NAMRorIntegratorsSubDriver;
  public nsx_integrators: NAMNsxIntegratorsSubDriver;
  public api_endpoints: NAMAPIEndpointsSubDriver;
  public nsx_security_groups: NAMNsxSecurityGroupsSubDriver;
  public domains: NAMDomainsSubDriver;
  public viti_networkpolicies: NAMVitiNetworkPoliciesSubDriver;
  public avi_integrators: NAMAviIntegratorsSubDriver;
  public bigip_integrators: NAMBigIPIntegratorsSubDriver;

  /**
   * Initialize NAM v2 driver with request configuration.
   * @param config - Request configuration including base URL and headers
   * @example
   * ```typescript
   * new NAMv2Driver({
   *   baseURL: 'https://nam.company.com/api/v2',
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
    this.netbox_integrators = new NAMNetboxIntegratorsSubDriver(config);
    this.ror_integrators = new NAMRorIntegratorsSubDriver(config);
    this.nsx_integrators = new NAMNsxIntegratorsSubDriver(config);
    this.api_endpoints = new NAMAPIEndpointsSubDriver(config);
    this.nsx_security_groups = new NAMNsxSecurityGroupsSubDriver(config);
    this.domains = new NAMDomainsSubDriver(config);
    this.viti_networkpolicies = new NAMVitiNetworkPoliciesSubDriver(config);
    this.avi_integrators = new NAMAviIntegratorsSubDriver(config);
    this.bigip_integrators = new NAMBigIPIntegratorsSubDriver(config);
  }

  /**
   * Retrieve data from custom NAM v2 API URL.
   * @template T - Expected response data type
   * @param url - Custom API endpoint URL
   * @param params - Optional query parameters
   * @returns Promise resolving to typed data
   * @example
   * ```typescript
   * const data = await nam.getByUrl<CustomType>('/custom/endpoint');
   * ```
   */
  async getByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
  ): Promise<T> {
    const fullUrl =
      typeof url === "string" && !url.startsWith("http")
        ? this.config.baseURL + url + queryBuilderSync(params as any)
        : url;
    const response = await this.get<T>(fullUrl, {
      ...this.config,
      method: "GET",
    });

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
   * Retrieve paginated data from custom URL with optional auto-pagination.
   * @template T - Expected response data type
   * @param url - Custom API endpoint URL
   * @param params - Optional query parameters
   * @param follow - Automatically follow all pages (default: false)
   * @returns Promise resolving to paginated data
   * @example
   * ```typescript
   * const all = await nam.getPaginatedByUrl<DataType>('/api/data', {}, true);
   * ```
   */
  async getPaginatedByUrl<T>(
    url: string | URL | Request,
    params?: { [key: string]: any },
    follow = false,
  ): Promise<T> {
    if (follow) {
      const response = await this.next<T>(url as string, params);
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
    const fullUrl =
      typeof url === "string" && !url.startsWith("http")
        ? this.config.baseURL + url + queryBuilderSync(params as any)
        : url;
    const response = await this.get<T>(fullUrl, {
      ...this.config,
      method: "GET",
    });

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
