import { ObjectId } from "mongodb";
import { HTTPError, NAMDevice, NAMParams, NAMResponse } from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * NAM Devices Sub-Driver for managing Device configurations.
 * Provides methods to retrieve, create, update, and delete Devices.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const devices = await nam.devices.getDevices({ name: 'device1' });
 * ```
 */
export class NAMDevicesSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve specific device by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMDevice
   * @example
   * ```typescript
   * const device = await nam.devices.getDevice('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getDevice(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMDevice> {
    const response = await this.get<NAMDevice>(
      this.config.baseURL +
        `/dcim/devices/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
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
   * Retrieve paginated list of Devices.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMDevice collection
   * @example
   * ```typescript
   * const devices = await nam.devices.getDevices({ name: 'device1' });
   * ```    
   */
  async getDevices(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMDevice>> {
    const response = await this.get<NAMResponse<NAMDevice>>(
      this.config.baseURL + `/dcim/devices/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
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
   * Create new device configuration.
   * @param device - NAMDevice configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMDevice 
   * @example
   * ```typescript
   * const d = await nam.devices.addDevice({
   *   name: 'device1',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
    // async addDevice(
    //     device: NAMDevice,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMDevice> {
    //     const response = await this.post<NAMDevice>(
    //     this.config.baseURL + `/dcim/devices/` + queryBuilderSync(params as any),
    //     { ...this.config, method: "POST", body: JSON.stringify(device) }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );
    //     }
    // }

  /**
   * Update existing device with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param device - Partial NAMDevice object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMDevice
   * @example
   * ```typescript
   * const updated = await nam.devices.patchDevice('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
    // async patchDevice(
    //     id: string | ObjectId,
    //     device: Partial<NAMDevice>,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMDevice> {
    //     const response = await this.patch<NAMDevice>(
    //     this.config.baseURL +
    //         `/dcim/devices/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "PATCH", body: JSON.stringify(device) }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );
    //     }
    // }

  /**
   * Replace existing device with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param device - Complete NAMDevice configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMDevice
   * @example
   * ```typescript
   * const device = await nam.devices.updateDevice('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   vendor_type: 'netbox'
   * });
   * ```
   */
    // async updateDevice(
    //     id: string | ObjectId,
    //     device: NAMDevice,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMDevice> {
    //     const response = await this.put<NAMDevice>(
    //     this.config.baseURL +
    //         `/dcim/devices/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "PUT", body: JSON.stringify(device) }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );
    //     }
    // }

  /**
   * Delete device configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMDevice
   * @example
   * ```typescript
   * await nam.devices.deleteDevice('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
    // async deleteDevice(
    //     id: string | ObjectId,
    //     params?: { [key: string]: any } | NAMParams | URLSearchParams
    // ): Promise<NAMDevice> {
    //     const response = await this.delete<NAMDevice>(
    //     this.config.baseURL +
    //         `/dcim/devices/${id}/` +
    //         queryBuilderSync(params as any),
    //     { ...this.config, method: "DELETE" }
    //     );

    //     if (response.ok) {
    //     return await response.json();
    //     } else {
    //     throw new HTTPError(
    //         `${response?.status} ${response.statusText}`,
    //         response.status,
    //         response
    //     );    
    //     }
    // }

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
    params?: { [key: string]: any }
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
      { ...this.config, method: "GET" }
    );
    let data = await res.json();
    const size = data.count || 0;
    let index = params.count;
    tmp = data.results || [];
    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" }
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
