import {
  HTTPError,
  VMwareAVIParams,
  VMwareAVIResponse,
  VMwareAVIVSDataScriptSet,
} from "../../../../../types";
import { DefaultResponse } from "../../../../../types/shared/defaults/default-response";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../../utils";

/**
 * Sub-driver for VMware AVI Virtual Service DataScript Set operations.
 * Handles CRUD operations for DataScript sets used in virtual services.
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const driver = new VMwareAVIVSDataScriptSetSubDriver({ baseURL: 'https://avi.example.com/api' });
 * const sets = await driver.getVSDataScriptSets();
 * await driver.addVSDataScriptSet({ name: 'test-set', datascript: [...] });
 * ```
 */
export class VMwareAVIVSDataScriptSetSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific DataScript set by UUID.
   * @param uuid - DataScript set UUID
   * @param params - Optional query parameters
   * @returns DataScript set object
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const set = await driver.getVSDataScriptSet('uuid-123');
   * ```
   */
  async getVSDataScriptSet(
    uuid: string,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIVSDataScriptSet> {
    const path = `/vsdatascriptset/${uuid}`;
    const response = await this.get<VMwareAVIVSDataScriptSet>(
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
   * Retrieves all DataScript sets with optional filtering.
   * @param params - Optional query parameters
   * @returns Paginated response with DataScript sets
   * @throws {HTTPError} When request fails
   * @example
   * ```typescript
   * const sets = await driver.getVSDataScriptSets({ name: 'prod' });
   * ```
   */
  async getVSDataScriptSets(
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIResponse<VMwareAVIVSDataScriptSet>> {
    const path = `/vsdatascriptset/`;
    const response = await this.get<
      VMwareAVIResponse<VMwareAVIVSDataScriptSet>
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
   * Creates a new DataScript set.
   * @param dataset - DataScript set configuration
   * @param params - Optional query parameters
   * @returns Created DataScript set
   * @throws {HTTPError} When creation fails
   * @example
   * ```typescript
   * const set = await driver.addVSDataScriptSet({ name: 'test' });
   * ```
   */
  async addVSDataScriptSet(
    dataset: Partial<VMwareAVIVSDataScriptSet>,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIVSDataScriptSet> {
    const path = `/vsdatascriptset/`;
    const response = await this.post<VMwareAVIVSDataScriptSet>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      {
        ...this.config,
        referrer: this.config.baseURL.replace("/api", ""),
        method: "POST",
        body: JSON.stringify(dataset),
      },
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
   * Updates an existing DataScript set (full replacement).
   * @param uuid - DataScript set UUID
   * @param dataset - Updated DataScript set configuration
   * @param params - Optional query parameters
   * @returns Updated DataScript set
   * @throws {HTTPError} When update fails
   * @example
   * ```typescript
   * const updated = await driver.updateVSDataScriptSet('uuid', { name: 'new' });
   * ```
   */
  async updateVSDataScriptSet(
    uuid: string,
    dataset: Partial<VMwareAVIVSDataScriptSet>,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<VMwareAVIVSDataScriptSet> {
    const path = `/vsdatascriptset/${uuid}`;
    const response = await this.put<VMwareAVIVSDataScriptSet>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      {
        ...this.config,
        referrer: this.config.baseURL.replace("/api", ""),
        method: "PUT",
        body: JSON.stringify(dataset),
      },
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
   * Deletes a DataScript set.
   * @param uuid - DataScript set UUID
   * @param params - Optional query parameters
   * @returns Response with status information
   * @throws {HTTPError} When deletion fails
   * @example
   * ```typescript
   * await driver.deleteVSDataScriptSet('uuid-123');
   * ```
   */
  async deleteVSDataScriptSet(
    uuid: string,
    params?: { [key: string]: any } | VMwareAVIParams | URLSearchParams,
  ): Promise<DefaultResponse> {
    const path = `/vsdatascriptset/${uuid}`;
    const response = await this.delete<VMwareAVIVSDataScriptSet>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      {
        ...this.config,
        referrer: this.config.baseURL.replace("/api", ""),
        method: "DELETE",
      },
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
