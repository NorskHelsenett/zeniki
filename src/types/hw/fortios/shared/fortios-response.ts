import { HttpMethods } from "../../../common/common-types";

/**
 * FortiOS API response for REST operations.
 * Supports pagination, VDOM context, and comprehensive metadata.
 * 
 * @example
 * ```typescript
 * const response: FortiOSResponse<FortiOSFirewallAddress> = await fortiAPI.get('/api/v2/cmdb/firewall/address');
 * if (response.status === 'success') {
 *   console.log(`Retrieved ${response.size} addresses`);
 *   response.results.forEach(addr => console.log(addr.name));
 * }
 * ```
 */
export interface FortiOSResponse<T> {
  /**
   * HTTP method used for the request.
   * @readonly
   */
  readonly http_method?: HttpMethods;

  /**
   * Number of objects in current response.
   * @readonly
   * @minimum 0
   */
  readonly size?: number;

  /**
   * Indicates if pagination limit reached.
   * @readonly
   */
  readonly limit_reached?: boolean;

  /**
   * Total objects matching query across all pages.
   * @readonly
   * @minimum 0
   */
  readonly matched_count?: number;

  /**
   * Next pagination index.
   * @readonly
   * @minimum 0
   */
  readonly next_idx?: number;

  /**
   * Configuration database revision.
   * @readonly
   */
  readonly revision?: string;

  /** Response data array. */
  results: T[] | [];

  /**
   * Virtual Domain context.
   * @readonly
   * @maxLength 31
   */
  readonly vdom?: string;

  /**
   * API endpoint path.
   * @readonly
   */
  readonly path?: string;

  /**
   * Object or resource name.
   * @readonly
   * @maxLength 79
   */
  readonly name?: string;

  /**
   * API action performed.
   * @readonly
   */
  readonly action?: string;

  /**
   * Operation status.
   * @readonly
   */
  readonly status?: string;

  /**
   * HTTP status code.
   * @readonly
   * @minimum 100
   * @maximum 599
   */
  readonly http_status?: number;

  /**
   * FortiGate device serial number.
   * @readonly
   */
  readonly serial?: string;

  /**
   * FortiOS software version.
   * @readonly
   */
  readonly version?: string;

  /**
   * FortiOS build number.
   * @readonly
   */
  readonly build?: number;
}
