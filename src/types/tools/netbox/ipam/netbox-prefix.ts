import {
  IPPrefixStatusLabel,
  IPPrefixStatusValue,
  IPVersion,
  IPVersionLabel,
} from "../../../utils/ip-types";
import { NetboxRole } from "./netbox-role";
import { NetboxValueLabel } from "../shared/netbox-value-label";
import { NetboxVlan } from "./netbox-vlan";
import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxVrf } from "./netbox-vrf";
import { NetboxSite } from "../dcim/netbox-site";
import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a network prefix in NetBox IPAM, defining a contiguous block of IP addresses.
 * 
 * Prefixes are fundamental building blocks in NetBox's IP address management system,
 * organizing address space into hierarchical structures with parent-child relationships.
 * They support IPv4/IPv6, VRF isolation, VLAN association, automated allocation, and
 * organizational metadata through sites, tenants, roles, and custom fields. Extends
 * NetboxPartial for common properties including timestamps and custom fields.
 * 
 * @example
 * ```typescript
 * const prefix: NetboxPrefix = {
 *   prefix: '192.168.100.0/24',
 *   family: { value: 4, label: 'IPv4' },
 *   status: { value: 'active', label: 'Active' },
 *   site: { id: 1, name: 'Data Center 01' },
 *   vrf: { id: 10, name: 'PROD_VRF' },
 *   is_pool: false
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/prefix/} NetBox Prefix Documentation
 */
export interface NetboxPrefix extends NetboxPartial {
  /** IP protocol version information (IPv4 or IPv6) with immutable value-label pairs. */
  readonly family?: NetboxValueLabel<IPVersion, IPVersionLabel>;

  /** The network prefix in CIDR notation (e.g., "192.168.1.0/24", "2001:db8::/32"). */
  prefix: string | null;

  /** Physical or logical site where this prefix is deployed or assigned. */
  site?: number | Readonly<Partial<NetboxSite>> | null;

  /** Virtual Routing and Forwarding (VRF) instance that contains this prefix. */
  vrf?: number | Readonly<Partial<NetboxVrf>> | null;

  /** Tenant or organizational entity that owns or manages this prefix. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;

  /** VLAN association for Layer 2 network segmentation and broadcast domain isolation. */
  vlan?: number | Readonly<Partial<NetboxVlan>> | null;

  /** Operational status tracking the current lifecycle state of the prefix. */
  status?: NetboxPrefixStatuses | NetboxPrefixStatus | Readonly<NetboxValueLabel<string, string>>;

  /** Functional role or purpose classification for the prefix. */
  role?: number | Readonly<Partial<NetboxRole>> | null;

  /** Designates whether this prefix serves as an allocation pool for automatic subnet creation. */
  is_pool?: boolean;

  /** Automatic utilization marking for IP addresses within this prefix. */
  mark_utilized?: boolean;

  /** Count of direct child prefixes contained within this prefix. */
  readonly children?: number;

  /** Hierarchical depth level within the prefix tree structure. */
  readonly _depth?: number;
}

/**
 * Status values for network prefixes in NetBox IPAM.
 */
export enum NetboxPrefixStatus {
  /** Prefix serves as a container for subdividing into smaller prefixes */
  Container = "container",
  /** Prefix is actively in use and available for IP address allocation */
  Active = "active",
  /** Prefix is reserved for future use but not currently active */
  Reserved = "reserved",
  /** Prefix is deprecated and should not be used for new allocations */
  Deprecated = "deprecated",
}

/**
 * String literal type alias for prefix status values.
 */
export type NetboxPrefixStatuses =
  | "container"
  | "active"
  | "reserved"
  | "deprecated";

