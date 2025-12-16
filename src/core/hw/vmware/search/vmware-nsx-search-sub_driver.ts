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

export class VMwareNSXSearchSubDriver extends ZenikiCoreDriver {
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
  async query<T>(
    params: { [key: string]: any } | VMwareNSXParams | URLSearchParams,
    global_manager: boolean = false
  ): Promise<VMwareNSXResponse<T>> {
    const path = global_manager
      ? "/global-manager/api/v1/search/"
      : "/api/v1/search/";

    const response = await this.get<T>(
      this.config.baseURL + path + queryBuilderSync(params as any),
      { ...this.config, method: "GET" }
    );

    if (response.ok) {
      return (await response.json()) as VMwareNSXResponse<T>;
    } else {
      console.log();
      throw new HTTPError(response.statusText, response.status, response);
    }
  }
}
