/**
 * Contains information required to connect to enforcement point.
 *
 * @example
 * ```typescript
 * const connectionInfo: VMwareNSXEnforcementPointConnectionInfo = {
 *   resource_type: 'NSXTConnectionInfo',
 *   enforcement_point_address: '10.192.1.1'
 * };
 * ```
 */
export interface VMwareNSXEnforcementPointConnectionInfo {
  /**
   * Enforcement Point Address - can be Hostname or IP with optional port (e.g., "10.192.1.1", "192.168.1.1:32789", "192.168.1.1:5480/nsxapi").
   */
  enforcement_point_address: string;

  /**
   * Resource Type of Enforcement Point Connection Info.
   */
  resource_type:
    | "NSXTConnectionInfo"
    | "NSXVConnectionInfo"
    | "CvxConnectionInfo"
    | "AviConnectionInfo";
}
