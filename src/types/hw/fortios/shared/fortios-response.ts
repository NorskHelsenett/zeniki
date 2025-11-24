import { HttpMethods } from "../../../common/common-types";

/**
 * FortiOS API response interface for all REST API operations with comprehensive metadata.
 * 
 * Supports FortiGate API operations with enhanced metadata, intelligent pagination, error
 * handling, enterprise features, cloud-native integrations, multi-tenant environments,
 * large-scale deployments, advanced monitoring, auditing capabilities, and VDOM isolation.
 * 
 * @example
 * ```typescript
 * const response: FortiOSResponse<FortiOSFirewallAddress> = await fortiAPI.get('/api/v2/cmdb/firewall/address');
 * if (response.status === 'success') {
 *   console.log(`Retrieved ${response.size} addresses from VDOM: ${response.vdom}`);
 *   response.results.forEach(address => console.log(`Address: ${address.name}`));
 *   if (response.limit_reached) {
 *     console.log(`Next page available at index: ${response.next_idx}`);
 *   }
 *   console.log(`Total matches: ${response.matched_count}`);
 *   console.log(`API Method: ${response.http_method}`);
 *   console.log(`HTTP Status: ${response.http_status}`);
 *   console.log(`Device Serial: ${response.serial}`);
 *   console.log(`FortiOS Version: ${response.version}`);
 *   console.log(`Build: ${response.build}`);
 * }
 * ```
 */
export interface FortiOSResponse<T> {
  /**
   * HTTP method used for the API request that generated this response.
   * @readonly
   * @values "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
   * @see HttpMethods
   * @optional
   */
  readonly http_method?: HttpMethods;

  /**
   * Total number of objects returned in the current response batch.
   * @readonly
   * @minimum 0
   * @see results
   * @optional
   */
  readonly size?: number;

  /**
   * Indicates whether the API response has reached the configured pagination limit.
   * @readonly
   * @see next_idx
   * @optional
   */
  readonly limit_reached?: boolean;

  /**
   * Total count of objects matching the query criteria across all pages.
   * @readonly
   * @minimum 0
   * @see size
   * @optional
   */
  readonly matched_count?: number;

  /**
   * Next pagination index for retrieving subsequent data pages.
   * @readonly
   * @minimum 0
   * @requires limit_reached must be true
   * @see limit_reached
   * @optional
   */
  readonly next_idx?: number;

  /**
   * Configuration database revision identifier for version tracking and change management.
   * @readonly
   * @optional
   */
  readonly revision?: string;

  /**
   * Primary response data array containing the requested objects or operation results.
   * @see size
   * @see matched_count
   * @required
   */
  results: T[] | [];

  /**
   * Virtual Domain (VDOM) context for multi-tenant FortiGate deployments and network isolation.
   * @readonly
   * @maxLength 31
   * @optional
   */
  readonly vdom?: string;

  /**
   * API endpoint path that generated this response for request tracking and debugging.
   * @readonly
   * @optional
   */
  readonly path?: string;

  /**
   * Object or resource name for single-object operations and specific resource identification.
   * @readonly
   * @maxLength 79
   * @see path
   * @optional
   */
  readonly name?: string;

  /**
   * Specific API action performed, providing operational context for the response.
   * @readonly
   * @see status
   * @see path
   * @optional
   */
  readonly action?: string;

  /**
   * Operation status indicating the success or failure of the API request.
   * @readonly
   * @values "success" | "error" | "warning" | "partial" | "pending"
   * @see http_status
   * @see action
   * @optional
   */
  readonly status?: string;

  /**
   * HTTP status code for the underlying REST API request for protocol-level diagnostics.
   * @readonly
   * @minimum 100
   * @maximum 599
   * @see status
   * @optional
   */
  readonly http_status?: number;

  /**
   * FortiGate device serial number for hardware identification and asset tracking.
   * @readonly
   * @see version
   * @see build
   * @optional
   */
  readonly serial?: string;

  /**
   * FortiOS software version for compatibility validation and feature availability checking.
   * @readonly
   * @see build
   * @see serial
   * @optional
   */
  readonly version?: string;

  /**
   * FortiOS build number for precise software version identification and support correlation.
   * @readonly
   * @see version
   * @see serial
   * @optional
   */
  readonly build?: number;
}
