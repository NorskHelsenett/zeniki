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
 * NetBox network prefix for IP address management.
 * Organizes address space with hierarchical parent-child relationships,
 * VRF isolation, VLAN association, and automated allocation.
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
 */
export interface NetboxPrefix extends NetboxPartial {
  /**
   * IP protocol version (IPv4 or IPv6).
   * @readonly
   */
  readonly family?: NetboxValueLabel<IPVersion, IPVersionLabel>;

  /** Network prefix in CIDR notation. */
  prefix: string | null;

  /** Site where this prefix is deployed. */
  site?: number | Readonly<Partial<NetboxSite>> | null;

  /** VRF instance containing this prefix. */
  vrf?: number | Readonly<Partial<NetboxVrf>> | null;

  /** Tenant that owns this prefix. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;

  /** VLAN association for Layer 2 segmentation. */
  vlan?: number | Readonly<Partial<NetboxVlan>> | null;

  /** Operational status. */
  status?: NetboxPrefixStatuses | NetboxPrefixStatus | Readonly<NetboxValueLabel<string, string>>;

  /** Functional role or purpose. */
  role?: number | Readonly<Partial<NetboxRole>> | null;

  /** Indicates if prefix is an allocation pool. */
  is_pool?: boolean;

  /** Automatic utilization marking. */
  mark_utilized?: boolean;

  /**
   * Count of direct child prefixes.
   * @readonly
   */
  readonly children?: number;

  /**
   * Hierarchical depth level.
   * @readonly
   */
  readonly _depth?: number;
}

// Network prefix status enumeration
export enum NetboxPrefixStatus {
  Container = "container",
  Active = "active",
  Reserved = "reserved",
  Deprecated = "deprecated",
}

// String literal union for prefix status values
export type NetboxPrefixStatuses =
  | "container"
  | "active"
  | "reserved"
  | "deprecated";

