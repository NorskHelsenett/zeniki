import {
    HTTPError,
    NetboxDeviceType,
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
 * NetBox device types sub-driver for managing device type resources in the DCIM application.
 * Provides CRUD operations for physical network equipment and infrastructure components.
 *
 * @class NetboxDeviceTypesSubDriver
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const deviceType = await netbox.device_types.addDeviceType({
 *   manufacturer: 1,
 *   model: 'Catalyst 9300-48P',
 *   slug: 'catalyst-9300-48p',
 *   u_height: 1,
 *   description: 'Core switch for data center',
 * });
 * ```
 */
export class NetboxDeviceTypesSubDriver extends ZenikiCoreDriver {
    constructor(config: RequestConfig) {
        super(config);
    }

    /**
     * Retrieves a specific device type by ID.
     *
     * @param id - Device type ID
     * @param params - Optional query parameters
     * @returns Promise resolving to device type data
     * @throws {HTTPError} When device type is not found or API errors occur
     *
     * @example
     * ```typescript
     * const deviceType = await netbox.deviceTypes.getDeviceType(100);
     * ```
     */
    async getDeviceType(
        id: number,
        params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    ): Promise<NetboxDeviceType> {
        const response = await this.get<NetboxDeviceType>(
            this.config.baseURL +
            `/dcim/device-types/${id}/` +
            queryBuilderSync(params as any),
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
     * Retrieves paginated list of device types.
     *
     * @param params - Optional query parameters
     * @param follow - Whether to follow pagination
     * @returns Promise resolving to paginated device types
     *
     * @example
     * ```typescript
     * const deviceTypes = await netbox.deviceTypes.getDeviceTypes({ manufacturer: 1 });
     * ```
     */
    async getDeviceTypes(
        params?: { [key: string]: any } | NetboxParams | URLSearchParams,
        follow: boolean = false,
    ): Promise<NetboxPaginated<NetboxDeviceType>> {
        if (follow) {
            const response = await this.next<NetboxPaginated<NetboxDeviceType>>(
                `/dcim/device-types/`,
                params,
            );

            return await response.json();
        }

        const response = await this.get<NetboxPaginated<NetboxDeviceType>>(
            this.config.baseURL + `/dcim/device-types/` +
            queryBuilderSync(params as any),
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
     * Creates a new device type.
     *
     * @param deviceType - Device type object to create
     * @param id - Optional ID for the device type
     * @returns Promise resolving to created device type
     * @throws {HTTPError} When validation or API errors occur
     *
     * @example
     * ```typescript
     * const deviceType = await netbox.deviceTypes.addDeviceType({
     *   manufacturer: 1,
     *   model: 'Catalyst 9300-48P',
     *   slug: 'catalyst-9300-48p',
     *   u_height: 1,
     *   is_full_depth: true,
     * });
     * ```
     */
    async addDeviceType(
        deviceType: NetboxDeviceType,
        id?: number,
    ): Promise<NetboxDeviceType> {
        const response = await this.post<NetboxDeviceType>(
            this.config.baseURL +
            (id ? `/dcim/device-types/${id}/` : `/dcim/device-types/`),
            {
                ...this.config,
                method: "POST",
                body: JSON.stringify(deviceType),
            },
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
     * Deletes a device type from NetBox using a device type object with data.
     * This method is used when you need to delete a device type by providing the device type object
     * with identification data. For direct deletion by ID, use deleteDeviceTypeById instead.
     *
     * @param deviceType - The device type object containing identification data for deletion
     * @returns Promise resolving to the deleted device type data or undefined if deletion fails
     *
     * @example
     * ```typescript
     * // Delete a device type using object data
     * const deviceTypeToDelete = { id: 100 };
     * const response = await netbox.deviceTypes.deleteDeviceType(deviceTypeToDelete);
     *
     * // Delete multiple device types using object data
     * const deviceTypeObjects = [{ id: 98 }, { id: 99 }, { id: 100 }];
     * for (const deviceTypeObj of deviceTypeObjects) {
     *   await netbox.deviceTypes.deleteDeviceType(deviceTypeObj);
     * }
     *
     * // Delete with additional filtering criteria
     * const deviceTypeWithCriteria = {
     *   model: 'Catalyst 9300-48P',
     *   manufacturer: 1,
     * };
     * const response = await netbox.deviceTypes.deleteDeviceType(deviceTypeWithCriteria);
     * ```
     *
     * @throws {Error} When the device type is not found (404) or other API errors occur
     * @see {@link NetboxDeviceType} For the device type definition
     * @see {@link deleteDeviceTypeById} For direct deletion by ID (recommended for single deletions)
     */
    async deleteDeviceType(
        deviceType: Partial<NetboxDeviceType>,
    ): Promise<NetboxDeviceType> {
        const response = await this.delete<NetboxDeviceType>(
            this.config.baseURL + `/dcim/device-types/`,
            {
                ...this.config,
                method: "DELETE",
                body: JSON.stringify(deviceType),
            },
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
     * Deletes a device type from NetBox by its ID.
     *
     * @param id - The unique identifier of the device type to delete
     * @returns Promise resolving to the deleted device type data
     *
     * @example
     * ```typescript
     * await netbox.deviceTypes.deleteDeviceTypeById(100);
     * ```
     *
     * @throws {HTTPError} When the device type is not found (404) or other API errors occur
     */
    async deleteDeviceTypeById(id: number): Promise<NetboxDeviceType> {
        const response = await this.delete<NetboxDeviceType>(
            this.config.baseURL + `/dcim/device-types/${id}/`,
            {
                ...this.config,
                method: "DELETE",
            },
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
     * Partially updates a device type in NetBox using PATCH method.
     *
     * @param deviceType - Partial device type object with fields to update
     * @param id - Optional ID of the device type to update
     * @returns Promise resolving to the updated device type
     *
     * @example
     * ```typescript
     * await netbox.deviceTypes.patchDeviceType({ description: 'Updated description', u_height: 2 }, 100);
     * ```
     *
     * @throws {HTTPError} When the device type is not found (404) or validation errors occur
     */
    async patchDeviceType(
        deviceType: Partial<NetboxDeviceType>,
        id?: number,
    ): Promise<NetboxDeviceType> {
        const response = await this.patch<NetboxDeviceType>(
            this.config.baseURL +
            (id ? `/dcim/device-types/${id}/` : `/dcim/device-types/`),
            {
                ...this.config,
                method: "PATCH",
                body: JSON.stringify(deviceType),
            },
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
     * Completely updates a device type in NetBox using PUT method.
     *
     * @param deviceType - Complete device type object for replacement
     * @param id - Optional ID of the device type to update
     * @returns Promise resolving to the updated device type
     *
     * @example
     * ```typescript
     * await netbox.deviceTypes.updateDeviceType({ manufacturer: 1, model: 'Catalyst 9300-48P', slug: 'catalyst-9300-48p', u_height: 2 }, 100);
     * ```
     *
     * @throws {HTTPError} When the device type is not found (404) or validation errors occur
     */
    async updateDeviceType(
        deviceType?: NetboxDeviceType,
        id?: number,
    ): Promise<NetboxDeviceType> {
        const response = await this.put<NetboxDeviceType>(
            this.config.baseURL +
            (id ? `/dcim/device-types/${id}/` : `/dcim/device-types/`),
            {
                ...this.config,
                method: "PUT",
                body: id || !deviceType
                    ? undefined
                    : JSON.stringify(deviceType),
            },
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
     * Handles automatic pagination for NetBox API responses.
     *
     * @template T - The expected response data type
     * @param path - The API endpoint path
     * @param params - Optional query parameters
     * @returns Promise resolving to response with all paginated results
     *
     * @example
     * ```typescript
     * const all = await this.next('/dcim/device-types/', { manufacturer: 1 });
     * ```
     */
    protected async next<T>(
        path: string,
        params?: { [key: string]: any },
    ): Promise<ResponseGeneric<T>> {
        let tmp: any[] = [];
        // If URL is already absolute, use it directly; otherwise prepend baseURL
        let res = await this.get<any>(
            this.config.baseURL + path + queryBuilderSync(params as any),
            { ...this.config, method: "GET" },
        );
        let data = await res.json();
        tmp = data.results || [];

        while (data.next) {
            res = await this.get<any>(data.next, {
                ...this.config,
                method: "GET",
            });
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
