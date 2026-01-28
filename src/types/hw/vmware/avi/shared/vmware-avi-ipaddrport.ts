import { VMwareAVIIpAddr } from "./vmware-avi-ipaddr";

/**
 * IP address with port configuration for AVI.
 * @interface
 * @example
 * ```typescript
 * const ipPort: VMwareAVIIpAddrPort = {
 *   ip: { addr: '192.168.1.1', type: 'V4' },
 *   port: 8080
 * };
 * ```
 */
export interface VMwareAVIIpAddrPort {
  /** Hostname for the address */
  hostname?: string;
  /** IP address configuration */
  ip?: VMwareAVIIpAddr;
  /** Descriptive name */
  name?: string;
  /** Port number (1-65535) */
  port: number; // 1-65535
}
