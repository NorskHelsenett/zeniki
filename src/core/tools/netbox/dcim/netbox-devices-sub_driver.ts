import {
  HTTPError,
  NetboxDevice,
  NetboxPaginated,
  NetboxParams,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox devices sub-driver for managing device resources in the DCIM application.
 * Provides CRUD operations for physical network equipment and infrastructure components.
 *
 * @class NetboxDevicesSubDriver
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const device = await netbox.devices.addDevice({
 *   name: 'switch-core-01',
 *   device_type: 42,
 *   role: 1,
 *   site: 3,
 *   status: 'active',
 *   serial: 'ABC123456'
 * });
 * ```
 */
export class NetboxDevicesSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific device by ID.
   *
   * @param id - Device ID
   * @param params - Optional query parameters
   * @returns Promise resolving to device data
   * @throws {HTTPError} When device is not found or API errors occur
   *
   * @example
   * ```typescript
   * const device = await netbox.devices.getDevice(100);
   * ```
   */
  async getDevice(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxDevice> {
    const response = await this.get<NetboxDevice>(
      this.config.baseURL +
        `/dcim/devices/${id}/` +
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
   * Retrieves paginated list of devices.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated devices
   *
   * @example
   * ```typescript
   * const devices = await netbox.devices.getDevices({ site: 1 });
   * ```
   */
  async getDevices(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxDevice>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxDevice>>(
        `/dcim/devices/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxDevice>>(
      this.config.baseURL + `/dcim/devices/` + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Creates a new device.
   *
   * @param device - Device object to create
   * @param id - Optional ID for the device
   * @returns Promise resolving to created device
   * @throws {HTTPError} When validation or API errors occur
   *
   * @example
   * ```typescript
   * const device = await netbox.devices.addDevice({
   *   name: 'switch-01',
   *   device_type: 42,
   *   role: 1,
   *   site: 3
   * });
   * ```
   */
  async addDevice(device: NetboxDevice, id?: number): Promise<NetboxDevice> {
    const response = await this.post<NetboxDevice>(
      this.config.baseURL + (id ? `/dcim/devices/${id}/` : `/dcim/devices/`),
      { ...this.config, method: "POST", body: JSON.stringify(device) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a device from NetBox using a device object with data.
   * This method is used when you need to delete a device by providing the device object
   * with identification data. For direct deletion by ID, use deleteDeviceById instead.
   *
   * @param device - The device object containing identification data for deletion
   * @returns Promise resolving to the deleted device data or undefined if deletion fails
   *
   * @example
   * ```typescript
   * // Delete a device using object data
   * const deviceToDelete = { id: 100 };
   * const response = await netbox.devices.deleteDevice(deviceToDelete);
   *
   * // Delete multiple devices using object data
   * const deviceObjects = [{ id: 98 }, { id: 99 }, { id: 100 }];
   * for (const deviceObj of deviceObjects) {
   *   await netbox.devices.deleteDevice(deviceObj);
   * }
   *
   * // Delete with additional filtering criteria
   * const deviceWithCriteria = {
   *   name: 'switch-core-01',
   *   site: 3,
   *   serial: 'ABC123456'
   * };
   * const response = await netbox.devices.deleteDevice(deviceWithCriteria);
   * ```
   *
   * @throws {Error} When the device is not found (404) or other API errors occur
   * @see {@link NetboxDevice} For the device type definition
   * @see {@link deleteDeviceById} For direct deletion by ID (recommended for single deletions)
   */
  async deleteDevice(device: Partial<NetboxDevice>): Promise<NetboxDevice> {
    const response = await this.delete<NetboxDevice>(
      this.config.baseURL + `/dcim/devices/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(device),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes a device from NetBox by its ID.
   *
   * @param id - The unique identifier of the device to delete
   * @returns Promise resolving to the deleted device data
   *
   * @example
   * ```typescript
   * await netbox.devices.deleteDeviceById(100);
   * ```
   *
   * @throws {HTTPError} When the device is not found (404) or other API errors occur
   */
  async deleteDeviceById(id: number): Promise<NetboxDevice> {
    const response = await this.delete<NetboxDevice>(
      this.config.baseURL + `/dcim/devices/${id}/`,
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
   * Partially updates a device in NetBox using PATCH method.
   *
   * @param device - Partial device object with fields to update
   * @param id - Optional ID of the device to update
   * @returns Promise resolving to the updated device
   *
   * @example
   * ```typescript
   * await netbox.devices.patchDevice({ description: 'Updated' }, 100);
   * ```
   *
   * @throws {HTTPError} When the device is not found (404) or validation errors occur
   */
  async patchDevice(
    device: Partial<NetboxDevice>,
    id?: number
  ): Promise<NetboxDevice> {
    const response = await this.patch<NetboxDevice>(
      this.config.baseURL + (id ? `/dcim/devices/${id}/` : `/dcim/devices/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(device) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Completely updates a device in NetBox using PUT method.
   *
   * @param device - Complete device object for replacement
   * @param id - Optional ID of the device to update
   * @returns Promise resolving to the updated device
   *
   * @example
   * ```typescript
   * await netbox.devices.updateDevice({ name: 'switch-01', device_type: 1, role: 2, site: 3 }, 100);
   * ```
   *
   * @throws {HTTPError} When the device is not found (404) or validation errors occur
   */
  async updateDevice(
    device?: NetboxDevice,
    id?: number
  ): Promise<NetboxDevice> {
    const response = await this.put<NetboxDevice>(
      this.config.baseURL + (id ? `/dcim/devices/${id}/` : `/dcim/devices/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !device ? undefined : JSON.stringify(device),
      }
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
   * const all = await this.next('/dcim/devices/', { site: 1 });
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
