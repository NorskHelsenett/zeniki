import { VMwareAVIIpAddr } from "./vmware-avi-ipaddr";

/**
 * IP address range configuration for AVI.
 * @interface
 * @example
 * ```typescript
 * const range: VMwareAVIIpAddrRange = {
 *   begin: { addr: '10.0.0.1', type: 'V4' },
 *   end: { addr: '10.0.0.255', type: 'V4' }
 * };
 * ```
 */
export interface VMwareAVIIpAddrRange {
  /** Starting IP address of the range */
  begin: VMwareAVIIpAddr;
  /** Ending IP address of the range */
  end: VMwareAVIIpAddr;
}
