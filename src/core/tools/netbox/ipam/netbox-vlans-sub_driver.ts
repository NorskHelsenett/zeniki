import {
  HTTPError,
  NetboxPaginated,
  NetboxParams,
  NetboxVlan,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox VLANs sub-driver for managing VLAN resources in the IPAM application.
 * Provides CRUD operations for Layer 2 network segments.
 *
 * @class NetboxVlansSubDriver
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const vlan = await netbox.vlans.addVlan({
 *   name: 'Production VLAN',
 *   vid: 100,
 *   site: 1,
 *   tenant: 5,
 *   status: 'active'
 * });
 * ```
 */
export class NetboxVlansSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific VLAN by ID.
   *
   * @param id - VLAN ID
   * @param params - Optional query parameters
   * @returns Promise resolving to VLAN data
   * @throws {HTTPError} When VLAN is not found or API errors occur
   *
   * @example
   * ```typescript
   * const vlan = await netbox.vlans.getVlan(100);
   * ```
   */
  async getVlan(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxVlan> {
    const response = await this.get<NetboxVlan>(
      this.config.baseURL +
        `/ipam/vlans/${id}/` +
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
   * Retrieves paginated list of VLANs.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated VLANs
   *
   * @example
   * ```typescript
   * const vlans = await netbox.vlans.getVlans({ site: 1 });
   * ```
   */
  async getVlans(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxVlan>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxVlan>>(
        `/ipam/vlans/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxVlan>>(
      this.config.baseURL + `/ipam/vlans/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new VLAN.
   *
   * @param vlan - VLAN object to create
   * @param id - Optional ID for the VLAN
   * @returns Promise resolving to created VLAN
   * @throws {HTTPError} When validation or API errors occur
   *
   * @example
   * ```typescript
   * const vlan = await netbox.vlans.addVlan({
   *   name: 'Production',
   *   vid: 100,
   *   site: 1
   * });
   * ```
   */
  async addVlan(vlan: NetboxVlan, id?: number): Promise<NetboxVlan> {
    const response = await this.post<NetboxVlan>(
      this.config.baseURL + (id ? `/ipam/vlans/${id}/` : `/ipam/vlans/`),
      { ...this.config, method: "POST", body: JSON.stringify(vlan) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a VLAN using object data.
   *
   * @param vlan - VLAN object with identification data
   * @returns Promise resolving to deleted VLAN
   * @throws {HTTPError} When VLAN is not found or API errors occur
   *
   * @example
   * ```typescript
   * // Delete a VLAN using object data
   * const vlanToDelete = { id: 100 };
   * const response = await netbox.vlans.deleteVlan(vlanToDelete);
   *
   * // Delete multiple VLANs using object data
   * const vlanObjects = [{ id: 98 }, { id: 99 }, { id: 100 }];
   * for (const vlanObj of vlanObjects) {
   *   await netbox.vlans.deleteVlan(vlanObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const vlanWithCriteria = {
   *   name: 'Production',
   *   vid: 100,
   *   site: 1
   * };
   * const response = await netbox.vlans.deleteVlan(vlanWithCriteria);
   * ```
   *
   * @throws {Error} When the VLAN is not found (404) or other API errors occur
   * @see {@link NetboxVlan} For the VLAN type definition
   * @see {@link deleteVlanById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteVlan(vlan: Partial<NetboxVlan>): Promise<NetboxVlan> {
    const response = await this.delete<NetboxVlan>(
      this.config.baseURL + `/ipam/vlans/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(vlan),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a VLAN by ID.
   *
   * @param id - VLAN ID to delete
   * @returns Promise resolving to deleted VLAN
   * @throws {HTTPError} When VLAN is not found or API errors occur
   *
   * @example
   * ```typescript
   * await netbox.vlans.deleteVlanById(100);
   * ```
   */
  async deleteVlanById(id: number): Promise<NetboxVlan> {
    const response = await this.delete<NetboxVlan>(
      this.config.baseURL + `/ipam/vlans/${id}/`,
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
   * Partially updates a VLAN using PATCH.
   *
   * @param vlan - Partial VLAN object with fields to update
   * @param id - Optional VLAN ID
   * @returns Promise resolving to updated VLAN
   * @throws {HTTPError} When VLAN is not found or validation errors occur
   *
   * @example
   * ```typescript
   * const vlan = await netbox.vlans.patchVlan({ description: 'Updated' }, 100);
   * ```
   */
  async patchVlan(
    vlan: Partial<NetboxVlan>,
    id?: number
  ): Promise<NetboxVlan> {
    const response = await this.patch<NetboxVlan>(
      this.config.baseURL + (id ? `/ipam/vlans/${id}/` : `/ipam/vlans/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(vlan) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a VLAN using PUT.
   *
   * @param vlan - Complete VLAN object for replacement
   * @param id - Optional VLAN ID
   * @returns Promise resolving to updated VLAN
   * @throws {HTTPError} When VLAN is not found or validation errors occur
   *
   * @example
   * ```typescript
   * const vlan = await netbox.vlans.updateVlan({
   *   name: 'Production',
   *   vid: 101,
   *   site: 1
   * }, 100);
   * ```
   */
  async updateVlan(
    vlan?: NetboxVlan,
    id?: number
  ): Promise<NetboxVlan> {
    const response = await this.put<NetboxVlan>(
      this.config.baseURL + (id ? `/ipam/vlans/${id}/` : `/ipam/vlans/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !vlan ? undefined : JSON.stringify(vlan),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
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
