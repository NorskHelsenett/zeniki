import {
  HTTPError,
  VMwareNSXGroup,
  VMwareNsxModifyResponse,
  VMwareNSXParams,
  VMwareNSXResponse,
} from "../../../../types";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

export class VMwareNSXGroupsSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific NSX security group by ID from the specified domain.
   * @param group_id - Unique security group identifier
   * @param params - Optional query parameters
   * @param domain_id - Domain identifier (default: "default")
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to security group details
   * @example
   * ```typescript
   * const group = await nsx.getGroup('web-servers', {}, 'production');
   * ```
   */
  async getGroup(
    group_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNSXGroup> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Retrieves all NSX security groups from the specified domain with optional filtering.
   * @param params - Optional query parameters (cursor, page_size)
   * @param domain_id - Domain identifier (default: "default")
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to paginated security groups response
   * @example
   * ```typescript
   * const groups = await nsx.getGroups({ page_size: 50 });
   * ```
   */
  async getGroups(
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNSXResponse<VMwareNSXGroup>> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Creates a new NSX security group or updates existing group using PUT operation.
   * @param group_id - Unique security group identifier
   * @param group - Complete group configuration
   * @param params - Optional query parameters
   * @param domain_id - Domain identifier (default: "default")
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.addGroup('web-servers', { display_name: 'Web Servers' });
   * ```
   */
  async addGroup(
    group_id: string,
    group: VMwareNSXGroup,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Updates an existing NSX security group using PUT operation.
   * @param group_id - Unique security group identifier
   * @param group - Complete group configuration
   * @param params - Optional query parameters
   * @param domain_id - Domain identifier (default: "default")
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.updateGroup('web-servers', { display_name: 'Updated' });
   * ```
   */
  async updateGroup(
    group_id: string,
    group: VMwareNSXGroup,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Updates an existing NSX security group with partial modifications using PATCH operation.
   * @param group_id - Unique security group identifier
   * @param group - Partial group object with fields to modify
   * @param params - Optional query parameters
   * @param domain_id - Domain identifier (default: "default")
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.patchGroup('web-servers', { description: 'Updated' });
   * ```
   */
  async patchGroup(
    group_id: string,
    group: Partial<VMwareNSXGroup>,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }

  /**
   * Deletes an existing NSX security group from the specified domain.
   * @param group_id - Unique security group identifier
   * @param params - Optional query parameters
   * @param domain_id - Domain identifier (default: "default")
   * @param global_manager - Use global manager API (default: false)
   * @returns Promise resolving to deletion status
   * @example
   * ```typescript
   * await nsx.deleteGroup('old-web-servers');
   * ```
   */
  async deleteGroup(
    group_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    domain_id: string = "default",
    global_manager: boolean = false
  ): Promise<VMwareNsxModifyResponse> {
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }
}
