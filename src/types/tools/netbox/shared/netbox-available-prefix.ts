import { NetboxVrf } from "../ipam/netbox-vrf";

/**
 * NetBox available prefix suggestion.
 * Represents subnet allocation options within a parent prefix
 * for automated network planning.
 *
 * @example
 * ```typescript
 * const available: NetboxAvailablePrefix = {
 *   family: 4,
 *   prefix: "192.168.1.0/24",
 *   vrf: { id: 1, name: "MGMT-VRF" }
 * };
 * ```
 */
export interface NetboxAvailablePrefix {
  /** IP address family (4=IPv4, 6=IPv6). */
  family?: number;

  /** Available prefix in CIDR notation. */
  prefix?: string;

  /** Associated VRF instance. */
  vrf?: Partial<NetboxVrf>;
}
