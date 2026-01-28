import { VMwareAVIIpAddrType, VMwareAVIIpAddrTypes } from "./vmware-avi-common";

/**
 * IP address configuration for AVI.
 * @interface
 * @example
 * ```typescript
 * const ip: VMwareAVIIpAddr = { addr: '192.168.1.1', type: 'V4' };
 * ```
 */
export interface VMwareAVIIpAddr {
  /** IP address string (IPv4, IPv6, or DNS name) */
  addr: string;
  /** Address type */
  type: VMwareAVIIpAddrTypes | VMwareAVIIpAddrType;
}
