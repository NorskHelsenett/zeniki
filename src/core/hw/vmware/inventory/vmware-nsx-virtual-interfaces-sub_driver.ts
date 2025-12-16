import {
  HTTPError,
  VMwareNSXParams,
  VMwareNSXResponse,
  VMwareNSXVirtualNetworkInterface,
} from "../../../../types";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { queryBuilderSync } from "../../../utils";

export class VMwareNSXVirtualInterfacesSubDriver extends ZenikiCoreDriver {
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieves all NSX virtual network interfaces from the specified domain with optional filtering.
   * Applies to NSX local manager only.
   * @param params - Optional query parameters (cursor, page_size)
   * @returns Promise resolving to paginated security groups response
   * @example
   * ```typescript
   * const groups = await nsx.getGroups({ page_size: 50 });
   * ```
   */
  async getVirtualInterfaces(
    params?: { [key: string]: any } | VMwareNSXParams | URLSearchParams
  ): Promise<VMwareNSXResponse<VMwareNSXVirtualNetworkInterface>> {
    const path = "/api/v1/fabric/vifs";

    const response = await this.get<
      VMwareNSXResponse<VMwareNSXVirtualNetworkInterface>
    >(this.config.baseURL + path + queryBuilderSync(params as any), {
      ...this.config,
      method: "GET",
    });

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
}
