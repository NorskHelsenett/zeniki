import { NetboxRole } from "./netbox-role";
import { NetboxSite } from "../dcim/netbox-site";
import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxValueLabel } from "../shared/netbox-value-label";

/**
 * Represents a Virtual LAN (VLAN) in NetBox network infrastructure.
 * 
 * VLANs provide Layer 2 network segmentation and traffic isolation with IEEE 802.1Q
 * compliance. Supports site/tenant associations, hierarchical organization through
 * VLAN groups, role-based categorization, and L2VPN integration. Extends NetboxPartial
 * for common properties including timestamps and custom fields.
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
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/vlan/} NetBox VLAN Documentation
 */
export interface NetboxVlan extends NetboxPartial {
  /** VLAN ID number, must be between 1-4094 as per IEEE 802.1Q standard. */
  vid: number;

  /** Human-readable name of the VLAN, maximum 64 characters. */
  name: string;

  /** Site where this VLAN is deployed. */
  site?: number | Readonly<Partial<NetboxSite>> | null;
  
  /** VLAN group for organizational purposes. */
  group?: number | Readonly<Partial<NetboxGeneric>> | null;
  
  /** Tenant that owns or manages this VLAN. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;
  
  /** Operational status of the VLAN (active, reserved, deprecated). */
  status?: NetboxVlanStatuses | NetboxVlanStatus | Readonly<NetboxValueLabel<NetboxVlanStatuses, string>>;
  
  /** Role or purpose of this VLAN. */
  role?: number | Readonly<Partial<NetboxRole>> | null;
  
  /** L2VPN termination associated with this VLAN. */
  readonly l2vpn_termination?: number | Partial<NetboxGeneric> | null;
  
  /** Total number of IP prefixes associated with this VLAN. */
  readonly prefix_count?: number;
}

/**
 * Status values for VLANs in NetBox.
 */
export enum NetboxVlanStatus {
  /** VLAN is actively in use */
  Active = "active",
  /** VLAN is reserved for future use */
  Reserved = "reserved",
  /** VLAN is deprecated and should not be used */
  Deprecated = "deprecated",
}

/**
 * String literal type alias for VLAN status values.
 */
export type NetboxVlanStatuses = "active" | "reserved" | "deprecated";