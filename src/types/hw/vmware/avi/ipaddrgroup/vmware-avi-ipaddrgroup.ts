import { VMwareAVIConfigPbAttributes } from "../shared/vmware-avi-configpb-attr";
import { VMwareAVIIpAddr } from "../shared/vmware-avi-ipaddr";
import { VMwareAVIIpAddrPrefix } from "../shared/vmware-avi-ipaddr-prefix";
import { VMwareAVIIpAddrRange } from "../shared/vmware-avi-ipaddr-range";
import { VMwareAVIIpAddrPort } from "../shared/vmware-avi-ipaddrport";
import { VMwareAVIPartial } from "../shared/vmware-avi-partial";
import { VMwareAVIRoleFilterMatchLabel } from "../shared/vmware-avi-role-filter-match-label";

/**
 * IP Address Group configuration for AVI.
 * Defines collections of IP addresses, prefixes, ranges, or ports for policy matching.
 * @interface
 * @example
 * ```typescript
 * const group: VMwareAVIIpAddrGroup = {
 *   name: 'internal-ips',
 *   addrs: [{ addr: '10.0.0.1', type: 'V4' }],
 *   prefixes: [{ ip_addr: { addr: '192.168.0.0', type: 'V4' }, mask: 24 }],
 *   ranges: [{ begin: { addr: '10.0.0.1', type: 'V4' }, end: { addr: '10.0.0.255', type: 'V4' } }]
 * };
 * ```
 */
export interface VMwareAVIIpAddrGroup extends Partial<VMwareAVIPartial> {
  /** Individual IP addresses */
  addrs?: VMwareAVIIpAddr[];
  /** ISO country codes for geographic IP matching */
  country_codes?: string[];
  /** IP addresses with specific ports */
  ip_ports?: VMwareAVIIpAddrPort[];
  /** Marathon application name for dynamic discovery */
  marathon_app_name?: string;
  /** Marathon service port for dynamic discovery */
  marathon_service_port?: number;
  /** IP address prefixes (CIDR) */
  prefixes?: VMwareAVIIpAddrPrefix[];
  /** IP address ranges */
  ranges?: VMwareAVIIpAddrRange[];
}
