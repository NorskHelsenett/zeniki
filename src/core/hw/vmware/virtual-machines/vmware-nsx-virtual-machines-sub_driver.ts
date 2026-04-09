import {
  HTTPError,
  VMwareNsxModifyResponse,
  VMwareNSXParams,
  VMwareNSXResponse,
  VMwareNSXVirtualMachine,
} from "../../../../types";
import {
  RequestConfig,
  ResponseGeneric,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

export class VMwareNSXVirtualMachinesSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves a specific NSX virtual machine by external ID using the fabric API.
   * @param external_id - Virtual machine external ID (mapped to `params.external_id`)
   * @param params - Optional query parameters (`cursor`, `page_size`, `included_fields`, etc.)
   * @returns Promise resolving to paginated virtual machines response filtered by `external_id`
   * @example
   * ```typescript
   * const vm = await nsx.getVirtualMachine('vm-123');
   * ```
   */
  async getVirtualMachine(
    external_id: string,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
  ): Promise<VMwareNSXResponse<VMwareNSXVirtualMachine>> {
    const path = `/api/v1/fabric/virtual-machines`;
    const external_id_params = { "external_id": external_id };
    Object.assign(external_id_params, params);
    const response = await this.get<VMwareNSXResponse<VMwareNSXVirtualMachine>>(
      this.config.baseURL + path + queryBuilderSync(external_id_params),
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
   * Retrieves all NSX virtual machines using the fabric API with optional filtering.
   * @param params - Optional query parameters:
   *   - `cursor` — opaque pagination cursor
   *   - `page_size` — maximum results per page (0–1000)
   *   - `external_id` — filter by VM external ID
   *   - `host_id` — filter by host ID
   *   - `included_fields` — comma-separated list of fields to include
   *   - `sort_by` / `sort_ascending` — sorting options
   * @returns Promise resolving to paginated virtual machines response
   * @example
   * ```typescript
   * const vms = await nsx.getVirtualMachines({ page_size: 50 });
   * const hostVms = await nsx.getVirtualMachines({ host_id: 'host-1' });
   * ```
   */
  async getVirtualMachines(
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
  ): Promise<VMwareNSXResponse<VMwareNSXVirtualMachine>> {
    const path = `/api/v1/fabric/virtual-machines`;
    const response = await this.get<VMwareNSXResponse<VMwareNSXVirtualMachine>>(
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
   * Updates tags on an NSX virtual machine via `POST /api/v1/fabric/virtual-machines`.
   * @param vm - Virtual machine object containing `external_id` and `tags` to update
   * @param params - Query parameters; `params.action` is required and must be one of:
   *   - `"add_tags"` — add the provided tags to the VM
   *   - `"update_tags"` — replace all tags on the VM with the provided tags
   *   - `"remove_tags"` — remove the provided tags from the VM
   * @returns Promise resolving to operation status
   * @example
   * ```typescript
   * await nsx.patchVirtualMachine(
   *   { external_id: 'vm-123', tags: [{ scope: 'env', tag: 'prod' }] },
   *   { action: 'add_tags' },
   * );
   * ```
   */
  async patchVirtualMachine(
    vm: Partial<VMwareNSXVirtualMachine>,
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
  ): Promise<VMwareNsxModifyResponse> {
    const path = `/api/v1/fabric/virtual-machines`;
    const response = await this.post<VMwareNsxModifyResponse>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "POST", body: JSON.stringify(vm) },
    );

    if (response.ok) {
      return {
        status: response.status,
        statusText: response.statusText,
        data: await response.text(),
      };
    } else {
      throw new HTTPError(
        `${response?.status} ${response.statusText}`,
        response.status,
        response,
      );
    }
  }

  /**
   * Internal pagination handler for NSX API response aggregation.
   *
   * @template T - Expected response data type
   * @param path - NSX API endpoint URL
   * @param params - Optional pagination parameters (count, skip)
   * @returns Promise resolving to aggregated paginated response
   * @protected
   * @example
   * ```typescript
   * const response = await this.next('/policy/api/v1/infra/realized-state/enforcement-points/default/virtual-machines', { count: 100, skip: 1 });
   * ```
   */
  protected async next<T>(
    path: string | URL | Request,
    params?: { [key: string]: any } | VMwareNSXParams,
  ): Promise<ResponseGeneric<T>> {
    if (!params) {
      params = {
        cursor: 0,
      };
    }

    let tmp: any[] = [];
    const res = await this.get<any>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" },
    );

    if (!res.ok) {
      throw new HTTPError(res.statusText, res.status, res);
    }

    let data = await res.json();
    let result_count = data.result_count || 0;
    let cursor = data.cursor || 0;
    tmp = data.results || [];

    while (result_count > cursor) {
      if (params && !params?.cursor) {
        params["cursor"] = cursor;
      } else {
        params.cursor = cursor;
      }

      const res = await this.get<any>(
        this.config.baseURL + path + queryBuilderSync(params as any),
        { ...this.config, method: "GET" },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          tmp = tmp.concat(data.results);
          result_count = data.result_count || 0;
          cursor = data.cursor || 0;
        }
      } else {
        throw new HTTPError(res.statusText, res.status, res);
      }
    }

    const finalData: any = {
      ...data,
      results: tmp,
      result_count: tmp.length,
      cursor: tmp.length,
    };

    return {
      ...res,
      json: async () => finalData,
    } as ResponseGeneric<T>;
  }
}
