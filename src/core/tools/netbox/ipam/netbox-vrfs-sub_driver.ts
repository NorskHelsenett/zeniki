import {
  HTTPError,
  NetboxPaginated,
  NetboxParams,
  NetboxVrf,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox VRFs sub-driver for managing VRF resources in the IPAM application.
 * Provides CRUD operations for Virtual Routing and Forwarding instances.
 *
 * @class NetboxVrfsSubDriver
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const vrf = await netbox.vrfs.addVrf({
 *   name: 'PRODUCTION_VRF',
 *   rd: '65000:100',
 *   tenant: 1,
 *   enforce_unique: true,
 *   description: 'Production environment'
 * });
 * ```
 */
export class NetboxVrfsSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific VRF by ID.
   *
   * @param id - VRF ID
   * @param params - Optional query parameters
   * @returns Promise resolving to VRF data
   * @throws {HTTPError} When VRF is not found or API errors occur
   *
   * @example
   * ```typescript
   * const vrf = await netbox.vrfs.getVrf(10);
   * ```
   */
  async getVrf(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxVrf> {
    const response = await this.get<NetboxVrf>(
      this.config.baseURL +
        `/ipam/vrfs/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieves paginated list of VRFs.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated VRFs
   *
   * @example
   * ```typescript
   * const vrfs = await netbox.vrfs.getVrfs({ tenant: 5 });
   * ```
   */
  async getVrfs(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxVrf>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxVrf>>(
        `/ipam/vrfs/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxVrf>>(
      this.config.baseURL + `/ipam/vrfs/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Creates a new VRF.
   *
   * @param vrf - VRF object to create
   * @param id - Optional ID for the VRF
   * @returns Promise resolving to created VRF
   * @throws {HTTPError} When validation or API errors occur
   *
   * @example
   * ```typescript
   * const vrf = await netbox.vrfs.addVrf({
   *   name: 'PROD_VRF',
   *   rd: '65000:100',
   *   tenant: 1
   * });
   * ```
   */
  async addVrf(vrf: NetboxVrf, id?: number): Promise<NetboxVrf> {
    const response = await this.post<NetboxVrf>(
      this.config.baseURL + (id ? `/ipam/vrfs/${id}/` : `/ipam/vrfs/`),
      { ...this.config, method: "POST", body: JSON.stringify(vrf) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a VRF using object data.
   *
   * @param vrf - VRF object with identification data
   * @returns Promise resolving to deleted VRF
   * @throws {HTTPError} When VRF is not found or API errors occur
   *
   * @example
   * ```typescript
   * await netbox.vrfs.deleteVrf({ id: 10 });
   * ```
   */
  async deleteVrf(vrf: Partial<NetboxVrf>): Promise<NetboxVrf> {
    const response = await this.delete<NetboxVrf>(
      this.config.baseURL + `/ipam/vrfs/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(vrf),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a VRF by ID.
   *
   * @param id - VRF ID to delete
   * @returns Promise resolving to deleted VRF
   * @throws {HTTPError} When VRF is not found or API errors occur
   *
   * @example
   * ```typescript
   * await netbox.vrfs.deleteVrfById(10);
   * ```
   */
  async deleteVrfById(id: number): Promise<NetboxVrf> {
    const response = await this.delete<NetboxVrf>(
      this.config.baseURL + `/ipam/vrfs/${id}/`,
      {
        ...this.config,
        method: "DELETE",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Partially updates a VRF using PATCH.
   *
   * @param vrf - Partial VRF object with fields to update
   * @param id - Optional VRF ID
   * @returns Promise resolving to updated VRF
   * @throws {HTTPError} When VRF is not found or validation errors occur
   *
   * @example
   * ```typescript
   * const vrf = await netbox.vrfs.patchVrf({ description: 'Updated' }, 10);
   * ```
   */
  async patchVrf(
    vrf: Partial<NetboxVrf>,
    id?: number
  ): Promise<NetboxVrf> {
    const response = await this.patch<NetboxVrf>(
      this.config.baseURL + (id ? `/ipam/vrfs/${id}/` : `/ipam/vrfs/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(vrf) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Completely updates a VRF using PUT.
   *
   * @param vrf - Complete VRF object for replacement
   * @param id - Optional VRF ID
   * @returns Promise resolving to updated VRF
   * @throws {HTTPError} When VRF is not found or validation errors occur
   *
   * @example
   * ```typescript
   * const vrf = await netbox.vrfs.updateVrf({
   *   name: 'PROD_VRF',
   *   rd: '65000:200',
   *   tenant: 1
   * }, 10);
   * ```
   */
  async updateVrf(
    vrf?: NetboxVrf,
    id?: number
  ): Promise<NetboxVrf> {
    const response = await this.put<NetboxVrf>(
      this.config.baseURL + (id ? `/ipam/vrfs/${id}/` : `/ipam/vrfs/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !vrf ? undefined : JSON.stringify(vrf),
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