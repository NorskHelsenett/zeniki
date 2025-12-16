import {
  HTTPError,
  VMwareNSXEnforcementPoint,
  VMwareNsxModifyResponse,
  VMwareNSXParams,
  VMwareNSXResponse,
} from "../../../../types";
import { VMwareNSXSite } from "../../../../types/hw/vmware/nsx/policy/sites/vmware-nsx-site";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

export class VMWareNSXSitesSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific NSX site.
   * @param site_id - Unique site identifier
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to site details
   * @example
   * ```typescript
   * const site = await nsx.getSite('site-1', false);
   * ```
   */
  async getSite(
    site_id: string,
    global_manager: boolean = false
  ): Promise<VMwareNSXSite> {
    const path = global_manager
      ? `/api/v1/global-infra/sites/${site_id}`
      : `/api/v1/infra/sites/${site_id}`;
    const response = await this.get<VMwareNSXSite>(this.config.baseURL + path, {
      ...this.config,
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Retrieves all NSX sites with optional filtering.
   * @param params - Optional query parameters (cursor, page_size)
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to paginated sites response
   * @example
   * ```typescript
   * const sites = await nsx.getSites({ page_size: 50 });
   * ```
   */
  async getSites(
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams
    // global_manager: boolean = false
  ): Promise<VMwareNSXResponse<VMwareNSXSite>> {
    // const path = global_manager
    //   ? `/global-manager/api/v1/global-infra/sites/`
    //   : `/api/v1/infra/sites/`;

    const response = await this.get<VMwareNSXResponse<VMwareNSXSite>>(
      this.config.baseURL +
        `/global-manager/api/v1/global-infra/sites/` +
        queryBuilderSync(params as any),
      {
        ...this.config,
        method: "GET",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Creates a new NSX site or updates existing site using PUT operation.
   * @param site_id - Unique site identifier
   * @param site - Complete site configuration
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.addSite('site-1', { display_name: 'Site 1' });
   * ```
   */
  async addSite(
    site_id: string,
    site: VMwareNSXSite,
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
    const path = global_manager
      ? `/api/v1/global-infra/sites/${site_id}`
      : `/api/v1/infra/sites/${site_id}`;
    const response = await this.patch<VMwareNsxModifyResponse>(
      this.config.baseURL + path,
      { ...this.config, method: "PATCH", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Updates an existing NSX site using PUT operation.
   * @param site_id - Unique site identifier
   * @param site - Complete site configuration
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.updateSite('site-1', { display_name: 'Updated' });
   * ```
   */
  async updateSite(
    site_id: string,
    site: VMwareNSXSite,
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
    const path = global_manager
      ? `/api/v1/global-infra/sites/${site_id}`
      : `/api/v1/infra/sites/${site_id}`;
    const response = await this.put<VMwareNsxModifyResponse>(
      this.config.baseURL + path,
      { ...this.config, method: "PUT", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Updates an existing NSX site with partial modifications using PATCH operation.
   * @param site_id - Unique security group identifier
   * @param site - Partial site object with fields to modify
   * @param params - Optional query parameters
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.patchSite('site-1', { description: 'Updated' });
   * ```
   */
  async patchSite(
    site_id: string,
    site: Partial<VMwareNSXSite>,
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
    const path = global_manager
      ? `/api/v1/global-infra/sites/${site_id}`
      : `/api/v1/infra/sites/${site_id}`;
    const response = await this.patch<VMwareNsxModifyResponse>(
      this.config.baseURL + path,
      { ...this.config, method: "PATCH", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Deletes an existing NSX site from the specified domain.
   * @param site_id - Unique site identifier
   * @param params - Optional query parameters
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to deletion status
   * @example
   * ```typescript
   * await nsx.deleteSite('old-site-1');
   * ```
   */
  async deleteSite(
    site_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
    const path = global_manager
      ? `/api/v1/global-infra/sites/${site_id}`
      : `/api/v1/infra/sites/${site_id}`;
    const response = await this.delete<VMwareNsxModifyResponse>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }

  /**
   * Retrieves enforcement points for a specific NSX site.
   * Applies to only Global Manager API.
   * @param site_id - Unique site identifier
   * @returns Promise resolving to site details
   * @example
   * ```typescript
   * const site = await nsx.getSite('site-1', false);
   * ```
   */
  async getSiteEnforcementPoints(
    site_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams
  ): Promise<VMwareNSXResponse<VMwareNSXEnforcementPoint>> {
    const path = `/global-manager/api/v1/global-infra/sites/${site_id}/enforcement-points`;
    const response = await this.get<
      VMwareNSXResponse<VMwareNSXEnforcementPoint>
    >(this.config.baseURL + path + queryBuilderSync(params as any), {
      ...this.config,
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response
      );
    }
  }
}
