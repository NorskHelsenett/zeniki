import {
  HTTPError,
  NetboxPaginated,
  NetboxParams,
  NetboxSite,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox Sites Sub-Driver for managing DCIM Sites.
 * Provides methods to retrieve, create, update, and delete sites representing physical locations.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const sites = await netbox.sites.getSites({ status: 'active', limit: 10 });
 * ```
 */
export class NetboxSitesSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }
  /**
   * Retrieves a specific site by its ID from NetBox.
   *
   * @param id - The unique identifier of the site to retrieve
   * @param params - Optional query parameters
   * @returns Promise resolving to the site data
   *
   * @example
   * ```typescript
   * const site = await netbox.sites.getSite(1);
   * ```
   *
   * @throws {HTTPError} When the site is not found (404) or other API errors occur
   */
  async getSite(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxSite> {
    const response = await this.get<NetboxSite>(
      this.config.baseURL +
        `/dcim/sites/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of sites from NetBox.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to automatically follow pagination
   * @returns Promise resolving to paginated site data
   *
   * @example
   * ```typescript
   * const sites = await netbox.sites.getSites({ status: 'active' });
   * ```
   *
   * @throws {HTTPError} When API errors occur
   */
  async getSites(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxSite>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxSite>>(
        `/dcim/sites/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxSite>>(
      this.config.baseURL + `/dcim/sites/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates new site in NetBox.
   *
   * @param site - The site object to create
   * @param id - Optional ID for the site
   * @returns Promise resolving to the created site
   *
   * @example
   * ```typescript
   * await netbox.sites.addSite({ name: 'DC West', slug: 'dc-west', status: 'active' });
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async addSite(
    site: NetboxSite,
    id?: number
  ): Promise<NetboxSite> {
    const response = await this.post<NetboxSite>(
      this.config.baseURL + (id ? `/dcim/sites/${id}/` : `/dcim/sites/`),
      { ...this.config, method: "POST", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes site from NetBox using site object.
   *
   * @param site - The site object containing identification data
   * @returns Promise resolving to the deleted site data
   *
   * @example
   * ```typescript
   * await netbox.sites.deleteSite({ name: 'Old DC' });
   * ```
   *
   * @throws {HTTPError} When the site is not found (404) or other API errors occur
   */
  async deleteSite(site: Partial<NetboxSite>): Promise<NetboxSite> {
    const response = await this.delete<NetboxSite>(
      this.config.baseURL + `/dcim/sites/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(site),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes site from NetBox by its ID.
   *
   * @param id - The unique identifier of the site to delete
   * @returns Promise resolving to the deleted site data
   *
   * @example
   * ```typescript
   * await netbox.sites.deleteSiteById(5);
   * ```
   *
   * @throws {HTTPError} When the site is not found (404) or other API errors occur
   */
  async deleteSiteById(id: number): Promise<NetboxSite> {
    const response = await this.delete<NetboxSite>(
      this.config.baseURL + `/dcim/sites/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Partially updates site in NetBox using PATCH method.
   *
   * @param site - Partial site object with fields to update
   * @param id - Optional ID of the site to update
   * @returns Promise resolving to the updated site
   *
   * @example
   * ```typescript
   * await netbox.sites.patchSite({ description: 'Updated' }, 5);
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async patchSite(
    site: Partial<NetboxSite>,
    id?: number
  ): Promise<NetboxSite> {
    const response = await this.patch<NetboxSite>(
      this.config.baseURL + (id ? `/dcim/sites/${id}/` : `/dcim/sites/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(site) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates site in NetBox using PUT method.
   *
   * @param site - Complete site object for replacement
   * @param id - Optional ID of the site to update
   * @returns Promise resolving to the updated site
   *
   * @example
   * ```typescript
   * await netbox.sites.updateSite({ name: 'DC East', slug: 'dc-east', status: 'active' }, 5);
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async updateSite(
    site?: NetboxSite,
    id?: number
  ): Promise<NetboxSite> {
    const response = await this.put<NetboxSite>(
      this.config.baseURL + (id ? `/dcim/sites/${id}/` : `/dcim/sites/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !site ? undefined : JSON.stringify(site),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Handles automatic pagination for NetBox API responses.
   *
   * @template T - The expected response data type
   * @param path - The API endpoint path
   * @param params - Optional query parameters
   * @returns Promise resolving to response with all paginated results
   *
   * @example
   * ```typescript
   * const all = await this.next('/dcim/sites/', { status: 'active' });
   * ```
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
