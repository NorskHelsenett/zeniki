/**
 * @fileoverview VMware NSX driver for policy-based network security management.
 *
 * Provides comprehensive type-safe API access to VMware NSX-T Data Center for security group
 * management, distributed firewall configuration, and policy-based networking. Supports both
 * local manager and global manager operations for multi-site NSX deployments with built-in
 * pagination, error handling, and CRUD operations through the NSX Policy API framework.
 *
 * Key Features:
 * - Security group management (create, read, update, delete)
 * - Local and global manager endpoint support
 * - Multi-domain environment handling
 * - Automatic pagination with result aggregation
 * - Type-safe API operations with comprehensive error handling
 * - Native fetch API for modern HTTP operations
 *
 * @example
 * ```typescript
 * import { VMWareNSXDriver } from '@norskhelsenett/zeniki';
 *
 * const nsx = new VMWareNSXDriver({
 *   baseURL: 'https://nsx-manager.example.com',
 *   auth: { username: 'admin', password: 'VMware123!' },
 *   timeout: 30000
 * });
 *
 * // Get security group
 * const response = await nsx.getGroup('web-servers', {}, 'production');
 * const group = await response.json();
 * console.log(`Group: ${group.display_name}`);
 * ```
 *
 * @since 1.0.0
 * @see {@link https://docs.vmware.com/en/VMware-NSX/index.html} VMware NSX Documentation
 */

import {
  ZenikiCoreDriver,
  RequestConfig,
  ResponseGeneric,
} from "../../base/zeniki-core-driver";
import { VMwareNSXResponse } from "../../../types/hw/vmware/nsx/shared/vmware-nsx-response";
import { VMwareNSXGroup } from "../../../types/hw/vmware/nsx/policy/groups/vmware-nsx-group";
import { VMwareNSXParams } from "../../../types/hw/vmware/nsx/shared/vmware-nsx-params";
import { VMwareNsxModifyResponse } from "../../../types";
import { queryBuilderSync } from "../../utils";
import { HTTPError } from "../../../types/shared/errors/http-error";

/**
 * VMware NSX-T driver for policy-based network security and micro-segmentation management.
 *
 * Extends ZenikiCoreDriver to provide type-safe NSX Policy API operations for security groups,
 * distributed firewall rules, and network policy management. Supports both local manager and
 * global manager deployments for multi-site NSX environments with comprehensive CRUD operations,
 * automatic pagination, and multi-domain infrastructure management.
 *
 * ## Core Capabilities
 *
 * **Security Group Management**: Complete lifecycle management for NSX security groups including
 * creation, retrieval, updates, and deletion with support for group expressions and conditions.
 *
 * **Multi-Domain Support**: Operates across multiple NSX domains for segmented network environments
 * with isolated policy configurations and tenant separation.
 *
 * **Global Manager Integration**: Seamlessly switches between local manager and global manager API
 * endpoints for federated NSX deployments spanning multiple data centers.
 *
 * **Pagination Handling**: Automatic result aggregation for large datasets with cursor-based
 * pagination following VMware NSX API conventions.
 *
 * @class VMWareNSXDriver
 * @extends ZenikiCoreDriver
 *
 * @example
 * ```typescript
 * import { VMWareNSXDriver } from '@norskhelsenett/zeniki';
 * import https from 'https';
 *
 * // Basic NSX connection with authentication
 * const nsx = new VMWareNSXDriver({
 *   baseURL: 'https://nsx-manager.example.com',
 *   auth: { username: 'admin', password: 'VMware123!' },
 *   timeout: 30000
 * });
 *
 * // Retrieve security group
 * const response = await nsx.getGroup('web-servers', {}, 'production');
 * const group = await response.json();
 * console.log(`Group: ${group.display_name}`);
 *
 * // Create new security group
 * await nsx.addGroup('app-servers', {
 *   display_name: 'Application Servers',
 *   description: 'Backend application tier',
 *   expression: [{ resource_type: 'Condition', member_type: 'VirtualMachine' }]
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Advanced configuration with SSL bypass for self-signed certificates
 * const nsx = new VMWareNSXDriver({
 *   baseURL: 'https://nsx-manager.local',
 *   auth: { username: 'admin', password: 'VMware123!' },
 *   timeout: 60000,
 *   httpsAgent: new https.Agent({ rejectUnauthorized: false }),
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'User-Agent': 'Zeniki/1.0'
 *   }
 * });
 *
 * // Get all groups with pagination
 * const allGroups = await nsx.getPaginatedByUrl(
 *   '/policy/api/v1/infra/domains/default/groups',
 *   { page_size: 100 },
 *   true // Follow pagination
 * );
 * ```
 *
 * @since 1.0.0
 * @see [Zeniki Test Suite](../../../test/README.md) For integration tests and examples
 * @see {@link https://docs.vmware.com/en/VMware-NSX/index.html} VMware NSX Documentation
 */
export class VMWareNSXDriver extends ZenikiCoreDriver {
  /**
   * Creates a new VMware NSX driver instance with connection configuration.
   * Initializes HTTP client for NSX Policy API operations with authentication, SSL settings,
   * and request/response interceptors for comprehensive API interaction.
   *
   * @param config - Request configuration for NSX manager connection
   *
   * @example
   * ```typescript
   * // Basic NSX connection
   * const nsx = new VMWareNSXDriver({
   *   baseURL: 'https://nsx-manager.example.com',
   *   headers: {
   *     'Authorization': 'Basic ' + btoa('admin:VMware123!'),
   *     'Content-Type': 'application/json'
   *   }
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Advanced configuration
   * const nsx = new VMWareNSXDriver({
   *   baseURL: 'https://nsx-manager.local',
   *   headers: {
   *     'Authorization': 'Basic ' + btoa('admin:VMware123!'),
   *     'Content-Type': 'application/json',
   *     'User-Agent': 'Zeniki/1.0'
   *   }
   * });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific NSX security group by ID from the specified domain.
   * Supports both local manager and global manager API endpoints for multi-site deployments.
   *
   * @param group_id - Unique security group identifier
   * @param params - Optional query parameters for filtering and display options
   * @param domain_id - Domain identifier for group scope (default: "default")
   * @param global_manager - Use global manager API endpoint (default: false)
   * @returns Promise resolving to security group details
   *
   * @example
   * ```typescript
   * // Get group from default domain
   * const response = await nsx.getGroup('web-servers-group');
   * const group = await response.json();
   * console.log(`Group: ${group.display_name}`);
   *
   * // Get group from specific domain with parameters
   * const response = await nsx.getGroup(
   *   'app-servers-group',
   *   { include_mark_for_delete_objects: false },
   *   'production-domain'
   * );
   * const group = await response.json();
   *
   * // Get group from global manager
   * const response = await nsx.getGroup(
   *   'global-web-servers',
   *   {},
   *   'default',
   *   true
   * );
   * const globalGroup = await response.json();
   * ```
   *
   * @throws {Error} When group not found or authentication fails
   */
  async getGroup(
    group_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNSXGroup | undefined> {
    const path = global_manager
      ? `/api/v1/global-infra/domains/${domain_id}/groups/${group_id}`
      : `/policy/api/v1/infra/domains/${domain_id}/groups/${group_id}`;
    const response = await this.get<VMwareNSXGroup>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Retrieves all NSX security groups from the specified domain with optional filtering.
   * Returns paginated results supporting cursor-based navigation for large datasets.
   *
   * @param params - Optional query parameters for filtering and pagination (cursor, page_size)
   * @param domain_id - Domain identifier for group scope (default: "default")
   * @param global_manager - Use global manager API endpoint (default: false)
   * @returns Promise resolving to paginated security groups response
   *
   * @example
   * ```typescript
   * // Get all groups from default domain
   * const response = await nsx.getGroups();
   * const groups = await response.json();
   * console.log(`Found ${groups.result_count} groups`);
   *
   * // Get groups with pagination
   * const response = await nsx.getGroups({
   *   page_size: 50,
   *   cursor: 'next-page-cursor'
   * });
   * const groups = await response.json();
   *
   * // Get groups from specific domain
   * const response = await nsx.getGroups(
   *   { page_size: 100 },
   *   'production-domain'
   * );
   * const prodGroups = await response.json();
   * ```
   *
   * @throws {Error} When domain not found or authentication fails
   */
  async getGroups(
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNSXResponse<VMwareNSXGroup> | undefined> {
    const path = global_manager
      ? `/api/v1/global-infra/domains/${domain_id}/groups/`
      : `/policy/api/v1/infra/domains/${domain_id}/groups/`;
    const response = await this.get<VMwareNSXResponse<VMwareNSXGroup>>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Creates a new NSX security group or updates existing group using PUT operation.
   * Performs upsert - creates if not exists, replaces if already present.
   *
   * @param group_id - Unique security group identifier
   * @param group - Complete group configuration with required properties
   * @param params - Optional query parameters for operation control
   * @param domain_id - Domain identifier for group scope (default: "default")
   * @param global_manager - Use global manager API endpoint (default: false)
   * @returns Promise resolving to operation status (check response status and statusText)
   *
   * @example
   * ```typescript
   * // Create new security group
   * const group = {
   *   display_name: 'Web Servers',
   *   description: 'Production web tier',
   *   expression: [{
   *     resource_type: 'Condition',
   *     member_type: 'VirtualMachine',
   *     key: 'Tag',
   *     operator: 'EQUALS',
   *     value: 'web'
   *   }]
   * };
   * const response = await nsx.addGroup('web-servers-group', group);
   * console.log(`Status: ${response.status}`);
   * ```
   *
   * @throws {Error} When validation fails or authentication error occurs
   */
  async addGroup(
    group_id: string,
    group: VMwareNSXGroup,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse | undefined> {
    const path = global_manager
      ? `/api/v1/global-infra/domains/${domain_id}/groups/${group_id}`
      : `/policy/api/v1/infra/domains/${domain_id}/groups/${group_id}`;
    const response = await this.put<VMwareNsxModifyResponse>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(group) }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Updates an existing NSX security group or creates new group using PUT operation.
   * Performs complete replacement of group configuration with provided data.
   *
   * @param group_id - Unique security group identifier
   * @param group - Complete group configuration with all required properties
   * @param params - Optional query parameters for operation control
   * @param domain_id - Domain identifier for group scope (default: "default")
   * @param global_manager - Use global manager API endpoint (default: false)
   * @returns Promise resolving to operation status (check response status and statusText)
   *
   * @example
   * ```typescript
   * // Update existing group
   * const group = {
   *   display_name: 'Updated Web Servers',
   *   description: 'Modified production web tier',
   *   expression: [{
   *     resource_type: 'Condition',
   *     member_type: 'VirtualMachine',
   *     key: 'Tag',
   *     operator: 'EQUALS',
   *     value: 'web-updated'
   *   }]
   * };
   * const result = await nsx.updateGroup('web-servers-group', group);
   * console.log(`Status: ${result.status}`);
   * ```
   *
   * @throws {Error} When validation fails or group not found
   */
  async updateGroup(
    group_id: string,
    group: VMwareNSXGroup,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse | undefined> {
    const path = global_manager
      ? `/api/v1/global-infra/domains/${domain_id}/groups/${group_id}`
      : `/policy/api/v1/infra/domains/${domain_id}/groups/${group_id}`;
    const response = await this.put<VMwareNsxModifyResponse>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PUT", body: JSON.stringify(group) }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Updates an existing NSX security group with partial modifications using PATCH operation.
   * Allows selective updates to group properties without replacing entire configuration.
   *
   * @param group_id - Unique security group identifier
   * @param group - Partial group object with only fields to modify
   * @param params - Optional query parameters for operation control
   * @param domain_id - Domain identifier for group scope (default: "default")
   * @param global_manager - Use global manager API endpoint (default: false)
   * @returns Promise resolving to operation status (check response status and statusText)
   *
   * @example
   * ```typescript
   * // Update only description
   * const partialGroup = { description: 'Updated description only' };
   * const result = await nsx.patchGroup('web-servers-group', partialGroup);
   * console.log(`Status: ${result.status}`);
   *
   * // Update multiple fields
   * const updates = {
   *   display_name: 'New Display Name',
   *   description: 'New description'
   * };
   * const result = await nsx.patchGroup(
   *   'app-servers-group',
   *   updates,
   *   {},
   *   'production-domain'
   * );
   * ```
   *
   * @throws {Error} When group not found or validation fails
   */
  async patchGroup(
    group_id: string,
    group: Partial<VMwareNSXGroup>,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse | undefined> {
    const path = global_manager
      ? `/api/v1/global-infra/domains/${domain_id}/groups/${group_id}`
      : `/policy/api/v1/infra/domains/${domain_id}/groups/${group_id}`;
    const response = await this.patch<VMwareNsxModifyResponse>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "PATCH", body: JSON.stringify(group) }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Deletes an existing NSX security group from the specified domain.
   * Removes group and all associated configurations from NSX policy framework.
   *
   * @param group_id - Unique security group identifier to delete
   * @param params - Optional query parameters (force deletion options)
   * @param domain_id - Domain identifier for group scope (default: "default")
   * @returns Promise resolving to deletion status (check response status and statusText)
   *
   * @example
   * ```typescript
   * // Delete group from default domain
   * const result = await nsx.deleteGroup('old-web-servers-group');
   * console.log(`Deleted: ${result.status === 200}`);
   *
   * // Delete with force option
   * const result = await nsx.deleteGroup(
   *   'app-servers-group',
   *   { force: true },
   *   'production-domain'
   * );
   * ```
   *
   * @throws {Error} When group not found, in use, or authentication fails
   */
  async deleteGroup(
    group_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse | undefined> {
    const path = global_manager
      ? `/api/v1/global-infra/domains/${domain_id}/groups/${group_id}`
      : `/policy/api/v1/infra/domains/${domain_id}/groups/${group_id}`;
    const response = await this.delete<VMwareNsxModifyResponse>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "DELETE" }
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Executes HTTP GET request to any NSX API endpoint with flexible URL support.
   * Provides generic access to NSX Policy API endpoints beyond predefined methods.
   *
   * @template T - Expected response data type
   * @param url - NSX API endpoint URL (relative or absolute path)
   * @param params - Optional query parameters (filters, pagination controls)
   * @returns Promise resolving to typed NSX response
   *
   * @example
   * ```typescript
   * // Access custom endpoint
   * const response = await nsx.getByUrl<VMwareNSXGroup>(
   *   '/policy/api/v1/infra/domains/default/groups/custom-group',
   *   { include_mark_for_delete_objects: true }
   * );
   * const result = await response.json();
   *
   * // Get firewall rules
   * const response = await nsx.getByUrl(
   *   '/policy/api/v1/infra/domains/default/security-policies/policy1/rules'
   * );
   * const rules = await response.json();
   * ```
   *
   * @throws {Error} When endpoint not found or authentication fails
   */
  async getByUrl<T>(
    url: string,
    params?: { [key: string]: any }
  ): Promise<T | undefined> {
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Executes paginated HTTP GET request with optional automatic result aggregation.
   * Optionally follows pagination to retrieve complete result sets from NSX API.
   *
   * @template T - Expected response data type for results array
   * @param url - NSX API endpoint URL for paginated request
   * @param params - Optional query parameters including pagination controls (page_size, cursor)
   * @param follow - Enable automatic pagination following to retrieve all pages (default: false)
   * @returns Promise resolving to paginated NSX response
   *
   * @example
   * ```typescript
   * // Get single page
   * const response = await nsx.getPaginatedByUrl<VMwareNSXGroup>(
   *   '/policy/api/v1/infra/domains/default/groups',
   *   { page_size: 50 }
   * );
   * const groups = await response.json();
   *
   * // Get all pages automatically
   * const response = await nsx.getPaginatedByUrl<VMwareNSXGroup>(
   *   '/policy/api/v1/infra/domains/default/groups',
   *   { page_size: 100 },
   *   true // Follow pagination
   * );
   * const allGroups = await response.json();
   * console.log(`Total groups: ${allGroups.results.length}`);
   * ```
   *
   * @throws {Error} When endpoint not found or authentication fails
   */
  async getPaginatedByUrl<T>(
    url: string,
    params?: { [key: string]: any },
    follow = false
  ): Promise<T | undefined> {
    if (follow) {
      const response = await this.next<T>(url, params);
      if (response.ok) {
        return await response.json();
      } else {
        throw new HTTPError(response.statusText, response.status, response);
      }
    }
    const response = await this.get<T>(
      this.config.baseURL + url + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }

  /**
   * Internal pagination handler for NSX API response aggregation.
   * Implements offset-based pagination with automatic result collection across multiple pages.
   * Follows NSX pagination protocol to retrieve complete datasets.
   *
   * @template T - Expected response data type for results array
   * @param url - NSX API endpoint URL
   * @param params - Optional pagination parameters (count, skip)
   * @returns Promise resolving to aggregated paginated response with all results
   * @protected
   *
   * @example
   * ```typescript
   * // Internal usage for pagination
   * const response = await this.next<VMwareNSXGroup>(
   *   '/policy/api/v1/infra/domains/default/groups',
   *   { count: 100, skip: 0 }
   * );
   * const result = await response.json();
   * console.log(`Total results: ${result.results.length}`);
   * ```
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

    if (!res.ok) {
      throw new HTTPError(res.statusText, res.status, res);
    }

    let data = await res.json();
    const size = data.result_count || 0;
    let index = params.count;
    tmp = data.results || [];

    while (size > index) {
      params["skip"] = index;
      const response = await this.get<any>(
        this.config.baseURL + url + queryBuilderSync(params as any),
        { ...this.config, method: "GET" }
      );
      if (res.ok) {
        const pageData = await response.json();
        if (pageData.results && pageData.results.length > 0) {
          tmp = tmp.concat(pageData.results);
        }
        index += params.count;
      } else {
        throw new HTTPError(res.statusText, res.status, res);
      }
    }
    // Return ResponseGeneric wrapper with aggregated data
    return {
      ...res,
      json: async () => ({
        ...data,
        results: tmp,
        result_count: tmp.length,
      }),
    } as ResponseGeneric<T>;
  }
}
