import { ObjectId } from "mongodb";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { HTTPError, NAMNetboxIntegrator, NAMParams } from "../../../../types";
import { queryBuilderSync } from "../../../utils";
import { RORClusterControlPlaneMetaData } from "../../../../types/tools/nhn/ror-v1/clusters/ror-cluster-control-plane-metadata";

export class RORv1Driver extends ZenikiCoreDriver {
  /**
   * Initialize ROR v1 driver with request configuration for API communication.
   * Inherits HTTP methods and security features from ZenikiCoreDriver base class.
   *
   * @param config Request configuration including base URL and authentication headers
   *
   * @example
   * ```typescript
   * // Simple initialization
   * const ror = new RORv1Driver({
   *   baseURL: 'https://ror.company.com/api/v2',
   *   headers: { 'x-api-key': '12345678-abcd-1234-efgh-123456789ijk' }
   * });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve all Cluster Control Plane Metadata objects.
   *
   * @returns {Promise<ResponseGeneric<RORClusterControlPlaneMetaData[]>>} Promise resolving to ROR response containing array of ROR Cluster Control Plane Metadata objects
   *
   * @example
   * ```typescript
   * const response = await ror.getControlplanesMetadata();
   * console.log(`Found ${response.data.results.length} Cluster Control Plane Metadata objects`);
   * ```
   *
   * @since ROR v1
   */
  async getControlplanesMetadata(
    params?: { [key: string]: any } | URLSearchParams
  ): Promise<RORClusterControlPlaneMetaData[] | undefined> {
    const response = await this.get<
      RORClusterControlPlaneMetaData[] | undefined
    >(
      this.config.baseURL +
        `/clusters/controlplanesMetadata` +
        queryBuilderSync(params as any),
      {
        ...this.config,
        method: "GET",
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPError(response.statusText, response.status, response);
    }
  }
}
