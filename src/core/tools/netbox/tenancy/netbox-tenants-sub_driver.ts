import {
  HTTPError,
  NetboxPaginated,
  NetboxParams,
  NetboxTenant,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

/**
 * NetBox Tenants Sub-Driver for managing Tenancy Tenants.
 * Provides methods to retrieve, create, update, and delete tenants representing organizations.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const tenants = await netbox.tenants.getTenants({ group: 'customers' });
 * ```
 */
export class NetboxTenantsSubDriver extends ZenikiCoreDriver {
  constructor(config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves specific tenant by ID from NetBox tenancy module.
   *
   * @param id - The unique identifier of the tenant to retrieve
   * @param params - Optional query parameters
   * @returns Promise resolving to the tenant data
   *
   * @example
   * ```typescript
   * const tenant = await netbox.tenants.getTenant(5);
   * ```
   *
   * @throws {HTTPError} When the tenant is not found (404) or other API errors occur
   */
  async getTenant(
    id: number,
    params?: { [key: string]: any } | NetboxParams | URLSearchParams
  ): Promise<NetboxTenant> {
    const response = await this.get<NetboxTenant>(
      this.config.baseURL +
        `/tenancy/tenants/${id}/` +
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
   * Retrieves paginated list of tenants from NetBox.
   *
   * @param params - Optional query parameters
   * @param follow - Whether to follow pagination
   * @returns Promise resolving to paginated tenant data
   *
   * @example
   * ```typescript
   * const tenants = await netbox.tenants.getTenants({ group: 'customers' });
   * ```
   *
   * @throws {HTTPError} When API errors occur
   */
  async getTenants(
    params?: { [key: string]: any } | NetboxParams | URLSearchParams,
    follow: boolean = false
  ): Promise<NetboxPaginated<NetboxTenant>> {
    if (follow) {
      const response = await this.next<NetboxPaginated<NetboxTenant>>(
        `/tenancy/tenants/`,
        params
      );

      return await response.json();
    }

    const response = await this.get<NetboxPaginated<NetboxTenant>>(
      this.config.baseURL +
        `/tenancy/tenants/` +
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
   * Creates a new tenant in NetBox.
   *
   * @param tenant - The tenant object to create
   * @param id - Optional ID for the tenant
   * @returns Promise resolving to the created tenant
   *
   * @example
   * ```typescript
   * await netbox.tenants.addTenant({ name: 'Acme Corp', slug: 'acme-corp' });
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async addTenant(
    tenant: NetboxTenant,
    id?: number
  ): Promise<NetboxTenant> {
    const response = await this.post<NetboxTenant>(
      this.config.baseURL +
        (id ? `/tenancy/tenants/${id}/` : `/tenancy/tenants/`),
      { ...this.config, method: "POST", body: JSON.stringify(tenant) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a tenant from NetBox using a tenant object.
   *
   * @param tenant - The tenant object containing identification data
   * @returns Promise resolving to the deleted tenant data
   *
   * @example
   * ```typescript
   * await netbox.tenants.deleteTenant({ name: 'Inactive Corp' });
   * ```
   *
   * @throws {HTTPError} When the tenant is not found (404) or other API errors occur
   */
  async deleteTenant(
    tenant: Partial<NetboxTenant>
  ): Promise<NetboxTenant> {
    const response = await this.delete<NetboxTenant>(
      this.config.baseURL + `/tenancy/tenants/`,
      {
        ...this.config,
        method: "DELETE",
        body: JSON.stringify(tenant),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes a tenant from NetBox by its ID.
   *
   * @param id - The unique identifier of the tenant to delete
   * @returns Promise resolving to the deleted tenant data
   *
   * @example
   * ```typescript
   * await netbox.tenants.deleteTenantById(5);
   * ```
   *
   * @throws {HTTPError} When the tenant is not found (404) or other API errors occur
   */
  async deleteTenantById(id: number): Promise<NetboxTenant> {
    const response = await this.delete<NetboxTenant>(
      this.config.baseURL + `/tenancy/tenants/${id}/`,
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
   * Partially updates a tenant in NetBox using PATCH method.
   *
   * @param tenant - Partial tenant object with fields to update
   * @param id - Optional ID of the tenant to update
   * @returns Promise resolving to the updated tenant
   *
   * @example
   * ```typescript
   * await netbox.tenants.patchTenant({ description: 'Updated customer' }, 5);
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async patchTenant(
    tenant: Partial<NetboxTenant>,
    id?: number
  ): Promise<NetboxTenant> {
    const response = await this.patch<NetboxTenant>(
      this.config.baseURL +
        (id ? `/tenancy/tenants/${id}/` : `/tenancy/tenants/`),
      { ...this.config, method: "PATCH", body: JSON.stringify(tenant) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Completely updates a tenant in NetBox using PUT method.
   *
   * @param tenant - Complete tenant object for replacement
   * @param id - Optional ID of the tenant to update
   * @returns Promise resolving to the updated tenant
   *
   * @example
   * ```typescript
   * await netbox.tenants.updateTenant({ name: 'Acme Corp', slug: 'acme-corp' }, 5);
   * ```
   *
   * @throws {HTTPError} When validation errors occur
   */
  async updateTenant(
    tenant?: NetboxTenant,
    id?: number
  ): Promise<NetboxTenant> {
    const response = await this.put<NetboxTenant>(
      this.config.baseURL +
        (id ? `/tenancy/tenants/${id}/` : `/tenancy/tenants/`),
      {
        ...this.config,
        method: "PUT",
        body: id || !tenant ? undefined : JSON.stringify(tenant),
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
     * const all = await this.next('/tenancy/tenants/', { group: 'customers' });
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
