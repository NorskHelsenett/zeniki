import { NetboxRole } from "./netbox-role";
import { NetboxSite } from "../dcim/netbox-site";
import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxValueLabel } from "../shared/netbox-value-label";

/**
 * NetBox Virtual LAN for Layer 2 network segmentation.
 * Provides IEEE 802.1Q compliant traffic isolation with site/tenant associations,
 * VLAN groups, role-based categorization, and L2VPN integration.
 * 
 * @example
 * ```typescript
 * const vlan: NetboxVlan = {
 *   name: 'Production Network',
 *   vid: 100,
 *   status: NetboxVlanStatus.Active,
 *   site: { id: 1, name: 'Data Center 01' },
 *   role: { id: 3, name: 'User Networks' }
 * };
 * ```
 */
export interface NetboxVlan extends NetboxPartial {
  /** VLAN ID (1-4094 per IEEE 802.1Q). */
  vid: number;

  /**
   * VLAN name.
   * @maxLength 64
   */
  name: string;

  /** Site where VLAN is deployed. */
  site?: number | Readonly<Partial<NetboxSite>> | null;
  
  /** VLAN group for organization. */
  group?: number | Readonly<Partial<NetboxGeneric>> | null;
  
  /** Tenant that owns this VLAN. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;
  
  /** Operational status. */
  status?: NetboxVlanStatuses | NetboxVlanStatus | Readonly<NetboxValueLabel<NetboxVlanStatuses, string>>;
  
  /** Role or purpose. */
  role?: number | Readonly<Partial<NetboxRole>> | null;
  
  /**
   * L2VPN termination.
   * @readonly
   */
  readonly l2vpn_termination?: number | Partial<NetboxGeneric> | null;
  
  /**
   * Number of associated IP prefixes.
   * @readonly
   */
  readonly prefix_count?: number;
}

// VLAN status enumeration
export enum NetboxVlanStatus {
  Active = "active",
  Reserved = "reserved",
  Deprecated = "deprecated",
}

// String literal union for VLAN status values
export type NetboxVlanStatuses = "active" | "reserved" | "deprecated";