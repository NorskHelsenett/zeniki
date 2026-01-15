import { ObjectId } from "mongodb";
import {
  HTTPError,
  NAMNsxIntegrator,
  NAMParams,
  NAMResponse,
} from "../../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";
import { NAMNsxSecurityGroup } from "../../../../../types/tools/nhn/nam-v2/nam-nsx-security-group";

/**
 * NAM NSX Security Groups Sub-Driver for managing NSX security group configurations.
 * Provides methods to retrieve, create, update, and delete NSX security groups.
 *
 * @class
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * const securityGroups = await nam.nsx_security_groups.getNsxSecurityGroups({ name: 'group1' });
 * ```
 */
export class NAMNsxSecurityGroupsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve a specific NSX security group by MongoDB ObjectId.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to NAMNsxSecurityGroup
   * @example
   * ```typescript
   * const securityGroup = await nam.nsx_security_groups.getNsxSecurityGroup('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async getNsxSecurityGroup(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxSecurityGroup> {
    const response = await this.get<NAMNsxSecurityGroup>(
      this.config.baseURL +
        `/vendors/vmware/nsx/security-groups/${id}/` +
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
   * Retrieve paginated list of NSX security groups.
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to paginated NAMNsxSecurityGroup collection
   * @example
   * ```typescript
   * const securityGroups = await nam.nsx_security_groups.getNsxSecurityGroups({ name: 'group1' });
   * ```
   */
  async getNsxSecurityGroups(
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMResponse<NAMNsxSecurityGroup>> {
    const response = await this.get<NAMResponse<NAMNsxSecurityGroup>>(
      this.config.baseURL +
        `/vendors/vmware/nsx/security-groups/` +
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
   * Create a new NSX security group configuration.
   * @param securityGroup - NAMNsxSecurityGroup configuration object
   * @param params - Optional query parameters
   * @returns Promise resolving to created NAMNsxSecurityGroup
   * @example
   * ```typescript
   * const securityGroup = await nam.nsx_security_groups.addNsxSecurityGroup({
   *   name: 'production-sync',
   *   enabled: true
   * });
   * ```
   */
  async addNsxSecurityGroup(
    securityGroup: NAMNsxSecurityGroup,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxSecurityGroup> {
    const response = await this.post<NAMNsxSecurityGroup>(
      this.config.baseURL +
        `/vendors/vmware/nsx/security-groups/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(securityGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Update existing NSX integrator with partial changes.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Partial NAMNsxIntegrator object
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMNsxIntegrator
   * @example
   * ```typescript
   * const updated = await nam.nsx_integrators.patchNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', { enabled: false });
   * ```
   */
  async patchNsxSecurityGroup(
    id: string | ObjectId,
    securityGroup: Partial<NAMNsxSecurityGroup>,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxSecurityGroup> {
    console.log(
      "Patching NSX Security Group with data:",
      JSON.stringify(securityGroup, null, 2)
    );
    const response = await this.patch<NAMNsxSecurityGroup>(
      this.config.baseURL +
        `/vendors/vmware/nsx/security-groups/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(securityGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Replace existing NSX integrator with complete configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param integrator - Complete NAMNsxIntegrator configuration
   * @param params - Optional query parameters
   * @returns Promise resolving to updated NAMNsxIntegrator
   * @example
   * ```typescript
   * const integrator = await nam.nsx_integrators.updateNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f', {
   *   name: 'updated',
   *   enabled: true
   * });
   * ```
   */
  async updateNsxSecurityGroup(
    id: string | ObjectId,
    securityGroup: NAMNsxSecurityGroup,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxSecurityGroup> {
    const response = await this.put<NAMNsxSecurityGroup>(
      this.config.baseURL +
        `/vendors/vmware/nsx/security-groups/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(securityGroup) }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Delete NSX security group configuration.
   * @param id - MongoDB ObjectId or string identifier
   * @param params - Optional query parameters
   * @returns Promise resolving to deleted NAMNsxSecurityGroup
   * @example
   * ```typescript
   * await nam.nsx_integrators.deleteNsxIntegrator('674d7b2c8f1e4a1b2c3d4e5f');
   * ```
   */
  async deleteNsxSecurityGroup(
    id: string | ObjectId,
    params?: { [key: string]: any } | NAMParams | URLSearchParams
  ): Promise<NAMNsxSecurityGroup> {
    const response = await this.delete<NAMNsxSecurityGroup>(
      this.config.baseURL +
        `/vendors/vmware/nsx/security-groups/${id}/` +
        queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

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
