/**
 * @fileoverview NetBox available prefix type definitions for automatic IP allocation.
 * Represents available prefix suggestions returned by NetBox when querying for
 * available subnets within a parent prefix, used for automated network planning.
 */

import { NetboxVrf } from "../ipam/netbox-vrf";

/**
 * Interface representing an available prefix suggestion from NetBox.
 * Used when querying or creating new prefixes within existing parent prefixes.
 * This type is returned by NetBox's available-prefixes endpoints to show
 * potential subnet allocations.
 *
 * @interface NetboxAvailablePrefix
 *
 * @example
 * ```typescript
 * // Available prefix returned from NetBox API
 * const availablePrefix: NetboxAvailablePrefix = {
 *   family: 4,
 *   prefix: "192.168.1.0/24",
 *   vrf: {
 *     id: 1,
 *     name: "Management-VRF",
 *     display: "Management-VRF"
 *   }
 * };
 *
 * // Processing available prefixes from API response
 * const available = await netbox.getNextAvailablePrefix(42);
 * available.data.forEach(prefix => {
 *   console.log(`Available: ${prefix.prefix} (IPv${prefix.family})`);
 *   if (prefix.vrf) {
 *     console.log(`  VRF: ${prefix.vrf.name || 'Unknown'}`);
 *   }
 * });
 *
 * // Creating a new prefix from available suggestions
 * const newPrefix = await netbox.getNextAvailablePrefixFromJSON(
 *   42,  // Parent prefix ID
 *   26   // Desired prefix length
 * );
 * // Returns NetboxAvailablePrefix[] with the newly created prefix
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/ipam/} NetBox IPAM REST API
 * @see {@link NetboxVrf} For VRF type definition
 */
export interface NetboxAvailablePrefix {
  /**
   * IP address family (4 for IPv4, 6 for IPv6).
   * Indicates whether this is an IPv4 or IPv6 prefix suggestion.
   *
   * @example
   * ```typescript
   * family: 4   // IPv4 prefix
   * family: 6   // IPv6 prefix
   * ```
   */
  family?: number;

  /**
   * The available prefix in CIDR notation.
   * Represents the actual network address and subnet mask.
   *
   * @example
   * ```typescript
   * prefix: "192.168.1.0/24"      // IPv4 /24 network
   * prefix: "10.0.0.0/16"         // IPv4 /16 network
   * prefix: "2001:db8::/64"       // IPv6 /64 network
   * ```
   */
  prefix?: string;

  /**
   * Virtual Routing and Forwarding (VRF) instance associated with this prefix.
   * Can be a partial VRF object containing basic information about the VRF context.
   *
   * @example
   * ```typescript
   * // VRF reference
   * vrf: {
   *   id: 1,
   *   name: "MGMT-VRF",
   *   display: "Management VRF"
   * }
   *
   * // No VRF (global routing table)
   * vrf: undefined
   * ```
   */
  vrf?: Partial<NetboxVrf>;
}
