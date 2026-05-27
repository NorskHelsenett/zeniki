import { SyncPriorities } from "../../../../common/common-types";
import { NAMAPIEndpoint } from "../nam-api-endpoint";
import { NAMFortiOSVdom } from "../nam-fortios-vdom";
import { NAMDefaultFields } from "../shared/nam-default-fields";


/**
 * NAM v2 Fortigate Address Group integrator configuration.
 * Automated network synchronization between NAM and Fortigate.
 *
 * @example
 * ```typescript
 * const integrator: NAMNetboxIntegrator = {
 *   name: 'production-sync',
 *   sync_priority: 'high',
 *   enabled: true,
 *   group_name: 'web-servers',
 *   ipv4_addresses: [{ ip: '192.168.1.1', desc: 'Primary web server' }],
 *   fortigate_endpoints: [{ endpoint: {...}, vdoms: [...] }]
 * };
 * ```
 */
export interface NAMFagIntegrator extends NAMDefaultFields {
  /** Integrator name. */
  name: string;

  /** Description. */
  desc?: string;

  /** Synchronization priority. */
  sync_priority: SyncPriorities;

  /** Integrator is enabled. */
  enabled: Boolean;

  /** Group name. */
  group_name: string;

  /** IPv4 Addresses */
  ipv4_addresses?: NAMFagIntegratorAddress[];

  /** IPv6 Addresses */
  ipv6_addresses?: NAMFagIntegratorAddress[];

  /** FortiGate endpoints with VDOMs. */
  fortigate_endpoints: { endpoint: NAMAPIEndpoint; vdoms: NAMFortiOSVdom[] }[];
}

/**
 * NAM v2 Fortigate Address Group integrator address configuration.
 * Represents an individual IP address with a description.
 */
export interface NAMFagIntegratorAddress {
  ip: string,
  desc: string
}