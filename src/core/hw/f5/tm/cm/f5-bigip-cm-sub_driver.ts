import {
  F5BigIPDevice,
  F5BigIPItemsResponse,
  HTTPError,
} from "../../../../../types";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * Sub-driver for F5 BIG-IP cluster management operations.
 * Provides device configuration and state management for HA clusters.
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const subDriver = new F5BigIPCMSubDriver(config);
 * const device = await subDriver.getDevice('bigip-01', 'Common');
 * ```
 */
export class F5BigIPCMSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves device configuration and state information.
   * @param name - Device name
   * @param partition - Configuration partition
   * @param params - Optional query parameters
   * @returns Device configuration object
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const device = await subDriver.getDevice('bigip-01');
   * ```
   */
  async getDevice(
    name: string,
    partition = "Common",
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPDevice> {
    const path = `/mgmt/tm/cm/device/~${partition}~${name}`;
    const response = await this.get<F5BigIPDevice>(
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

  async getDevices(
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPItemsResponse<F5BigIPDevice>> {
    const path = `/mgmt/tm/cm/device/`;
    const response = await this.get<F5BigIPItemsResponse<F5BigIPDevice>>(
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

  async addDevice(
    data: Partial<F5BigIPDevice>,
    partition = "Common",
    params?: { [key: string]: any } | URLSearchParams,
  ): Promise<F5BigIPDevice> {
    const path = `/mgmt/tm/cm/device/~${partition}~`;
    const response = await this.post<F5BigIPDevice>(
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
}
