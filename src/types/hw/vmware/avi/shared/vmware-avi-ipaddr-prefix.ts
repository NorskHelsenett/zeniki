import { VMwareAVIIpAddr } from "./vmware-avi-ipaddr";

/**
 * IP address prefix (CIDR) configuration for AVI.
 * @interface
 * @example
 * ```typescript
 * const prefix: VMwareAVIIpAddrPrefix = {
 *   ip_addr: { addr: '192.168.0.0', type: 'V4' },
 *   mask: 24
 * };
 * ```
 */
export interface VMwareAVIIpAddrPrefix {
  /** IP address */
  ip_addr: VMwareAVIIpAddr;
  /** Subnet mask (CIDR notation) */
  mask: number;
}
