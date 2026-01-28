import {
  HTTPError,
  VMwareAVIIpAddrGroup,
  VMwareAVIParams,
  VMwareAVIResponse,
} from "../../../../../types";
import { DefaultResponse } from "../../../../../types/shared/defaults/default-response";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * Sub-driver for VMware AVI IP Address Group operations.
 * Handles CRUD operations for IP address groups used in AVI policies.
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const driver = new VMwareAVIIpAddrGroupSubDriver({ baseURL: 'https://avi.example.com/api' });
 * const groups = await driver.getIpAddrGroups();
 * await driver.addIpAddrGroup({ name: 'test-group', prefixes: [...] });
 * ```
 */
export class VMwareAVIIpAddrGroupSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific IP address group by UUID.
   * @param uuid - IP address group UUID
   * @param params - Optional query parameters
   * @returns IP address group object
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const group = await driver.getIpAddrGroup('uuid-123');
   * ```
   */
  async getIpAddrGroup(
    uuid: string,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIIpAddrGroup> {
    const path = `/ipaddrgroup/${uuid}`;
    const response = await this.get<VMwareAVIIpAddrGroup>(
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
   * Retrieves all IP address groups with optional filtering.
   * @param params - Optional query parameters
   * @returns Paginated response with IP address groups
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const groups = await driver.getIpAddrGroups({ name: 'prod' });
   * ```
   */
  async getIpAddrGroups(
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIResponse<VMwareAVIIpAddrGroup>> {
    const path = `/ipaddrgroup/`;
    const response = await this.get<VMwareAVIResponse<VMwareAVIIpAddrGroup>>(
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
   * Creates a new IP address group.
   * @param group - IP address group configuration
   * @param params - Optional query parameters
   * @returns Created IP address group
   * @throws {HTTPError} When creation fails
   * @example
   * ```typescript
   * const group = await driver.addIpAddrGroup({ name: 'test' });
   * ```
   */
  async addIpAddrGroup(
    group: Partial<VMwareAVIIpAddrGroup>,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIIpAddrGroup> {
    const path = `/ipaddrgroup/`;
    const response = await this.post<VMwareAVIIpAddrGroup>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(group) },
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Updates an existing IP address group (full replacement).
   * @param uuid - IP address group UUID
   * @param group - Updated IP address group configuration
   * @param params - Optional query parameters
   * @returns Updated IP address group
   * @throws {HTTPError} When update fails
   * @example
   * ```typescript
   * const updated = await driver.updateIpAddrGroup('uuid', { name: 'new' });
   * ```
   */
  async updateIpAddrGroup(
    uuid: string,
    group: Partial<VMwareAVIIpAddrGroup>,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIIpAddrGroup> {
    const path = `/ipaddrgroup/${uuid}`;
    const response = await this.put<VMwareAVIIpAddrGroup>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(group) },
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Partially updates an existing IP address group.
   * @param uuid - IP address group UUID
   * @param group - Partial IP address group configuration
   * @param params - Optional query parameters
   * @returns Updated IP address group
   * @throws {HTTPError} When patch fails
   * @example
   * ```typescript
   * const patched = await driver.patchIpAddrGroup('uuid', { addrs: [...] });
   * ```
   */
  async patchIpAddrGroup(
    uuid: string,
    group: Partial<VMwareAVIIpAddrGroup>,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIIpAddrGroup> {
    const path = `/ipaddrgroup/${uuid}`;
    const response = await this.patch<VMwareAVIIpAddrGroup>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(group) },
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Deletes an IP address group.
   * @param uuid - IP address group UUID
   * @param params - Optional query parameters
   * @returns Response with status information
   * @throws {HTTPError} When deletion fails
   * @example
   * ```typescript
   * await driver.deleteIpAddrGroup('uuid-123');
   * ```
   */
  async deleteIpAddrGroup(
    uuid: string,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<DefaultResponse> {
    const path = `/ipaddrgroup/${uuid}`;
    const response = await this.delete<VMwareAVIIpAddrGroup>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" },
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
      };
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }
}
