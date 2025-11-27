import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxRegion } from "./netbox-region";
import {
  NetboxValueLabel,
} from "../shared/netbox-value-label";
import { NetboxTenant } from "../tenancy/netbox-tenant";

/**
 * NetBox physical site for infrastructure organization.
 * Organizes devices by geographic/logical location with support for facility management,
 * ASN routing, multi-tenant associations, and infrastructure tracking.
 * 
 * @example
 * ```typescript
 * const site: NetboxSite = {
 *   name: 'Data Center North',
 *   slug: 'dc-north',
 *   status: NetboxSiteStatus.Active,
 *   region: { id: 1, name: 'North America' },
 *   physical_address: '123 Main Street, City, State',
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   facility: 'Building A',
 *   time_zone: 'America/New_York'
 * };
 * ```
 */
export interface NetboxSite extends NetboxPartial {
  /**
   * Site name.
   * @maxLength 100
   * @required
   */
  name: string;

  /**
   * URL-safe slug identifier.
   * @maxLength 100
   * @required
   */
  slug: string;

  /**
   * Operational status.
   * @default planned
   */
  status?:
    | NetboxSiteStatuses
    | NetboxSiteStatus
    | Readonly<NetboxValueLabel<NetboxSiteStatuses, string>>;

  /** Geographic region. */
  region?: number | Readonly<Partial<NetboxRegion>> | null;

  /** Site group. */
  group?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** Tenant owner. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;

  /**
   * Facility identifier.
   * @maxLength 50
   */
  facility?: string;

  /** Time zone (IANA identifier). */
  time_zone?: string | null;

  /**
   * Physical address.
   * @maxLength 200
   */
  physical_address?: string;

  /**
   * Shipping address.
   * @maxLength 200
   */
  shipping_address?: string;

  /**
   * Latitude coordinate.
   * @minimum -90
   * @maximum 90
   */
  latitude?: number | null;

  /**
   * Longitude coordinate.
   * @minimum -180
   * @maximum 180
   */
  longitude?: number | null;

  /** Associated ASN numbers. */
  asns?: number[];

  /**
   * Number of circuits.
   * @readonly
   */
  readonly circuit_count: number;

  /**
   * Number of devices.
   * @readonly
   */
  readonly device_count: number;

  /**
   * Number of IP prefixes.
   * @readonly
   */
  readonly prefix_count: number;

  /**
   * Number of racks.
   * @readonly
   */
  readonly rack_count: number;

  /**
   * Number of virtual machines.
   * @readonly
   */
  readonly virtualmachine_count: number;

  /**
   * Number of VLANs.
   * @readonly
   */
  readonly vlan_count: number;
}

// Site status enumeration
export enum NetboxSiteStatus {
  Planned = "planned",
  Staging = "staging",
  Active = "active",
  Decommissioning = "decommissioning",
  Retired = "retired",
}

// String literal union for site status values
export type NetboxSiteStatuses =
  | "planned"
  | "staging"
  | "active"
  | "decommissioning"
  | "retired";
