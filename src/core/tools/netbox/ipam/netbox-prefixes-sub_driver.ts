import {
  HTTPError,
  NetboxAvailablePrefix,
  NetboxPaginated,
  NetboxParams,
  NetboxPrefix,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox Prefixes Sub-Driver for managing IPAM Prefixes.
 * Provides methods to retrieve, create, update, and delete IP prefixes.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const prefixes = await netbox.prefixes.getPrefixes({ status: 'active', family: 4 });
 * ```
 */
export class NetboxPrefixesSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific IP prefix by its ID from NetBox.
   *
   * @param id - The unique identifier of the prefix to retrieve
   * @param params - Optional query parameters
   * @returns Promise resolving to the prefix data
   *
   * @example
   * ```typescript
   * const prefix = await netbox.prefixes.getPrefix(42);
   * ```
   *
   * @throws {HTTPError} When the prefix is not found (404) or other API errors occur
   */
  async getPrefix(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxPrefix> {
    const response = await this.get<NetboxPrefix>(
      this.config.baseURL +
        `/ipam/prefixes/${id}/` +
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
   * Retrieves a paginated list of IP prefixes from NetBox.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated prefix data
   *
   * @example
   * ```typescript
   * const prefixes = await netbox.prefixes.getPrefixes({ status: 'active', family: 4 });
   * ```
   *
   * @throws {HTTPError} When API errors occur
   */
  async getPrefixes(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxPrefix>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxPrefix>>(
        `/ipam/prefixes/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxPrefix>>(
      this.config.baseURL + `/ipam/prefixes/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieves available prefixes within a parent prefix.
   *
   * @param id - The unique identifier of the parent prefix
   * @param params - Optional query parameters
   * @returns Promise resolving to array of available prefixes
   *
   * @example
   * ```typescript
   * const available = await netbox.prefixes.getNextAvailablePrefix(42, { prefix_length: 24 });
   * ```
   *
   * @throws {HTTPError} When API errors occur
   */
  async getNextAvailablePrefix(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxAvailablePrefix[]> {
    // Get next available prefix with GET, id and optional params.
    const response = await this.get<NetboxAvailablePrefix[]>(
      this.config.baseURL +
        `/ipam/prefixes/${id}/available-prefixes/` +
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
   * Creates and allocates a new prefix from available space within a parent prefix.
   *
   * @param id - The unique identifier of the parent prefix
   * @param length - The prefix length for the new prefix
   * @param vlan_id - Optional VLAN ID
   * @param description - Optional description
   * @param json_fields - Optional additional fields
   * @param custom_fields - Optional custom fields
   * @param params - Optional query parameters
   * @returns Promise resolving to array with the newly created prefix
   *
   * @example
   * ```typescript
   * await netbox.prefixes.registerNextAvailablePrefix(42, 24, 100, 'Prod network');
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async registerNextAvailablePrefix(
    id: number,
    length: number,
    vlan_id: number | null = null,
    description?: string,
    json_fields?: { [key: string]: any },
    custom_fields?: { [key: string]: string },
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxPrefix[]> {
    const response = await this.post<NetboxPrefix[]>(
      this.config.baseURL +
        `/ipam/prefixes/${id}/available-prefixes/` +
        queryBuilderSync(params as any),
      {
        ...this.config,
        method: "POST",
        body: JSON.stringify({
          prefix_length: length,
          vlan: vlan_id,
          description: description,
          ...json_fields,
          custom_fields: custom_fields,
        }),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Creates a new prefix in NetBox.
   *
   * @param prefix - The prefix object to create
   * @param id - Optional ID for the prefix
   * @returns Promise resolving to the created prefix
   *
   * @example
   * ```typescript
   * await netbox.prefixes.addPrefix({ prefix: '192.168.100.0/24', status: 'active' });
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async addPrefix(prefix: NetboxPrefix, id?: number): Promise<NetboxPrefix> {
    const response = await this.post<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "POST", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a prefix from NetBox using a prefix object.
   *
   * @param prefix - The prefix object containing identification data
   * @returns Promise resolving to the deleted prefix data
   *
   * @example
   * ```typescript
   * await netbox.prefixes.deletePrefix({ prefix: '192.168.1.0/24' });
   * ```
   *
   * @throws {HTTPError} When the prefix is not found (404) or other API errors occur
   */
  async deletePrefix(prefix: Partial<NetboxPrefix>): Promise<NetboxPrefix> {
    const response = await this.delete<NetboxPrefix>(
      this.config.baseURL + `/ipam/prefixes/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(prefix),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a prefix from NetBox by its ID.
   *
   * @param id - The unique identifier of the prefix to delete
   * @returns Promise resolving to the deleted prefix data
   *
   * @example
   * ```typescript
   * await netbox.prefixes.deletePrefixById(42);
   * ```
   *
   * @throws {HTTPError} When the prefix is not found (404) or other API errors occur
   */
  async deletePrefixById(id: number): Promise<NetboxPrefix> {
    const response = await this.delete<NetboxPrefix>(
      this.config.baseURL + `/ipam/prefixes/${id}/`,
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
   * Partially updates a prefix in NetBox using PATCH method.
   *
   * @param prefix - Partial prefix object with fields to update
   * @param id - Optional ID of the prefix to update
   * @returns Promise resolving to the updated prefix
   *
   * @example
   * ```typescript
   * await netbox.prefixes.patchPrefix({ description: 'Updated network' }, 42);
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async patchPrefix(
    prefix: Partial<NetboxPrefix>,
    id?: number
  ): Promise<NetboxPrefix> {
    const response = await this.patch<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Completely updates a prefix in NetBox using PUT method.
   *
   * @param prefix - Complete prefix object for replacement
   * @param id - Optional ID of the prefix to update
   * @returns Promise resolving to the updated prefix
   *
   * @example
   * ```typescript
   * await netbox.prefixes.updatePrefix({ prefix: '192.168.200.0/24', status: 'active' }, 42);
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async updatePrefix(prefix: NetboxPrefix, id?: number): Promise<NetboxPrefix> {
    const response = await this.put<NetboxPrefix>(
      this.config.baseURL + (id ? `/ipam/prefixes/${id}/` : `/ipam/prefixes/`),
      { ...this.config, method: "PUT", body: JSON.stringify(prefix) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
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
   * const all = await this.next('/ipam/prefixes/', { status: 'active' });
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
