import { ObjectId } from "mongodb";
import {
  RequestConfig,
  ZenikiCoreDriver,
} from "../../../base/zeniki-core-driver";
import { HTTPError, NAMNetboxIntegrator, NAMParams } from "../../../../types";
import { queryBuilderSync } from "../../../utils";
import { RORClusterControlPlaneMetaData } from "../../../../types/tools/nhn/ror-v1/clusters/ror-cluster-control-plane-metadata";

/**
 * ROR v1 API driver for Norwegian Health Network cluster management.
 * Provides type-safe access to ROR (Register of Resources) API endpoints for retrieving
 * cluster control plane metadata and resource information. Extends ZenikiCoreDriver with
 * HTTP methods and authentication handling for ROR infrastructure operations.
 *
 * @extends ZenikiCoreDriver
 * @example
 * ```typescript
 * const ror = new RORv1Driver({
 *   baseURL: 'https://ror.company.com/api/v1',
 *   headers: { 'x-api-key': 'your-api-key' }
 * });
 * const metadata = await ror.getControlplanesMetadata();
 * ```
 */
export class RORv1Driver extends ZenikiCoreDriver {
  /**
   * Initialize ROR v1 driver with request configuration for API communication.
   * @param config - Request configuration including base URL and authentication headers
   * @example
   * ```typescript
   * new RORv1Driver({ baseURL: 'https://ror.company.com/api/v1', headers: { 'x-api-key': 'key' } });
   * ```
   */
  constructor(public config: RequestConfig) {
    super(config);
  }

  /**
   * Retrieve all Cluster Control Plane Metadata objects.
   * @param params - Optional query parameters
   * @returns Promise resolving to array of cluster control plane metadata objects
   * @example
   * ```typescript
   * const metadata = await ror.getControlplanesMetadata();
   * ```
   */
  async getControlplanesMetadata(
    params?: { [key: string]: any } | URLSearchParams
  ): Promise<RORClusterControlPlaneMetaData[]> {
    const response = await this.get<RORClusterControlPlaneMetaData[]>(
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
      throw new HTTPError(`${response?.status} ${response.statusText}`, response.status, response);
    }
  }
}
