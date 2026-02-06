import {
  F5BigIPFirewallAddressList,
  F5BigIPItemsResponse,
  HTTPError,
} from "../../../../../types";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * Sub-driver for F5 BIG-IP security firewall operations.
 * Provides CRUD operations for firewall address lists.
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const subDriver = new F5BigIPFirewallSubDriver(config);
 * const list = await subDriver.getAddressList('trusted-hosts');
 * ```
 */
export class F5BigIPFirewallSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific firewall address list by name.
   * @param name - Address list name
   * @param partition - Configuration partition
   * @param params - Optional query parameters
   * @returns Firewall address list object
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const list = await subDriver.getAddressList('trusted-hosts');
   * ```
   */
  async getAddressList(
    name: string,
    partition = "Common",
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPFirewallAddressList> {
    const path =
      `/mgmt/tm/security/firewall/address-list/~${partition}~${name}`;
    const response = await this.get<F5BigIPFirewallAddressList>(
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
   * Retrieves all firewall address lists.
   * @param params - Optional query parameters
   * @returns Collection of firewall address lists
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const lists = await subDriver.getAddressLists();
   * ```
   */
  async getAddressLists(
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPItemsResponse<F5BigIPFirewallAddressList>> {
    const path = `/mgmt/tm/security/firewall/address-list/`;
    const response = await this.get<
      F5BigIPItemsResponse<F5BigIPFirewallAddressList>
    >(
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
   * Creates a new firewall address list.
   * @param data - Address list configuration
   * @param params - Optional query parameters
   * @returns Created firewall address list
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const list = await subDriver.addAddressList({ name: 'trusted-hosts' });
   * ```
   */
  async addAddressList(
    data: Partial<F5BigIPFirewallAddressList>,
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPFirewallAddressList> {
    const path = `/mgmt/tm/security/firewall/address-list/`;
    const response = await this.post<F5BigIPFirewallAddressList>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(data) },
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
   * Partially updates a firewall address list.
   * @param name - Address list name
   * @param data - Partial address list configuration
   * @param partition - Configuration partition
   * @param params - Optional query parameters
   * @returns Updated firewall address list
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const list = await subDriver.patchAddressList('trusted-hosts', { description: 'Updated' });
   * ```
   */
  async patchAddressList(
    name: string,
    data: Partial<F5BigIPFirewallAddressList>,
    partition = "Common",
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPFirewallAddressList> {
    const path =
      `/mgmt/tm/security/firewall/address-list/~${partition}~${name}`;
    const response = await this.patch<F5BigIPFirewallAddressList>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(data) },
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
   * Fully replaces a firewall address list configuration.
   * @param name - Address list name
   * @param data - Complete address list configuration
   * @param partition - Configuration partition
   * @param params - Optional query parameters
   * @returns Updated firewall address list
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const list = await subDriver.updateAddressList('trusted-hosts', { name: 'trusted-hosts', addresses: [] });
   * ```
   */
  async updateAddressList(
    name: string,
    data: Partial<F5BigIPFirewallAddressList>,
    partition = "Common",
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPFirewallAddressList> {
    const path =
      `/mgmt/tm/security/firewall/address-list/~${partition}~${name}`;
    const response = await this.put<F5BigIPFirewallAddressList>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(data) },
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
   * Deletes a firewall address list.
   * @param name - Address list name
   * @param partition - Configuration partition
   * @param params - Optional query parameters
   * @returns Deleted firewall address list
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * await subDriver.deleteAddressList('old-list');
   * ```
   */
  async deleteAddressList(
    name: string,
    partition = "Common",
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPFirewallAddressList> {
    const path =
      `/mgmt/tm/security/firewall/address-list/~${partition}~${name}`;
    const response = await this.delete<F5BigIPFirewallAddressList>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" },
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
}
