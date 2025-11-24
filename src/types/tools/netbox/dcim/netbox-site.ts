/**
 * @fileoverview NetBox Site DCIM Model Type Definitions for Infrastructure Management
 * 
 * Comprehensive site model types for NetBox infrastructure documentation and management
 * platform. Provides complete type definitions for physical site locations, geographic
 * organization, multi-tenant associations, facility management, ASN routing relationships,
 * and comprehensive infrastructure tracking capabilities.
 * 
 * Supports enterprise network infrastructure management with geographic organization,
 * operational status tracking, multi-tenant environments, and extensive metadata including
 * device counts, circuit counts, and infrastructure statistics for data center operations.
 * 
 * @version NetBox 3.7+ compatible
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/site/} NetBox Site Documentation
 * @see {@link https://netbox.readthedocs.io/en/stable/} NetBox Official Documentation
 */

import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxRegion } from "./netbox-region";
import {
  NetboxValueLabel,
} from "../shared/netbox-value-label";
import { NetboxTenant } from "../tenancy/netbox-tenant";

/**
 * Represents a physical site or location in NetBox infrastructure management platform.
 * 
 * Sites organize devices and resources by geographic or logical location with support
 * for geographic organization, multi-tenant associations, facility management, ASN
 * routing relationships, and comprehensive infrastructure tracking. Extends NetboxPartial
 * for common properties including timestamps and custom fields.
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
 *   time_zone: 'America/New_York',
 *   tenant: { id: 1, name: 'Enterprise Corp' },
 *   asns: [65001, 65002],
 *   device_count: 150
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/site/} NetBox Site Documentation
 */
export interface NetboxSite extends NetboxPartial {
  /**
   * Human-readable name of the site for identification and display purposes.
   * @maxLength 100
   * @required
   */
  name: string;

  /**
   * URL-safe slug identifier for the site, used in API endpoints and URLs.
   * @maxLength 100
   * @format Lowercase alphanumeric with hyphens
   * @required
   */
  slug: string;

  /**
   * Operational status of the site indicating current lifecycle phase.
   * @see NetboxSiteStatus
   * @default planned
   * @optional
   */
  status?:
    | NetboxSiteStatuses
    | NetboxSiteStatus
    | Readonly<NetboxValueLabel<NetboxSiteStatuses, string>>;

  /**
   * Geographic region where the site is located for organizational hierarchy.
   * @see NetboxRegion
   * @optional
   */
  region?: number | Readonly<Partial<NetboxRegion>> | null;

  /**
   * Site group for organizational hierarchy and categorization.
   * @see NetboxGeneric
   * @optional
   */
  group?: number | Readonly<Partial<NetboxGeneric>> | null;

  /**
   * Tenant that owns or has responsibility for this site.
   * @see NetboxTenant
   * @optional
   */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;

  /**
   * Facility name or identifier within the site for asset management.
   * @maxLength 50
   * @optional
   */
  facility?: string;

  /**
   * Time zone for the site location used for scheduling and logging.
   * @format IANA time zone identifier
   * @optional
   */
  time_zone?: string | null;

  /**
   * Physical street address of the site for logistics and documentation.
   * @maxLength 200
   * @optional
   */
  physical_address?: string;

  /**
   * Shipping/delivery address for the site if different from physical address.
   * @maxLength 200
   * @optional
   */
  shipping_address?: string;

  /**
   * Geographic latitude coordinate for mapping and location services.
   * @minimum -90
   * @maximum 90
   * @format Decimal degrees
   * @optional
   */
  latitude?: number | null;

  /**
   * Geographic longitude coordinate for mapping and location services.
   * @minimum -180
   * @maximum 180
   * @format Decimal degrees
   * @optional
   */
  longitude?: number | null;

  /**
   * List of Autonomous System Numbers (ASNs) associated with this site.
   * @format Array of 32-bit ASN numbers
   * @optional
   */
  asns?: number[];

  /**
   * Total number of circuits at this site for capacity planning.
   * @readonly
   * @minimum 0
   */
  readonly circuit_count: number;

  /**
   * Total number of devices at this site for inventory management.
   * @readonly
   * @minimum 0
   */
  readonly device_count: number;

  /**
   * Total number of IP prefixes associated with this site.
   * @readonly
   * @minimum 0
   */
  readonly prefix_count: number;

  /**
   * Total number of racks at this site for space management.
   * @readonly
   * @minimum 0
   */
  readonly rack_count: number;

  /**
   * Total number of virtual machines at this site.
   * @readonly
   * @minimum 0
   */
  readonly virtualmachine_count: number;

  /**
   * Total number of VLANs associated with this site.
   * @readonly
   * @minimum 0
   */
  readonly vlan_count: number;
}

/**
 * Status values for sites in NetBox infrastructure management platform.
 * @enum NetboxSiteStatus
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/site/} NetBox Site Status Documentation
 */
export enum NetboxSiteStatus {
  // Site is planned for future deployment
  Planned = "planned",
  
  // Site is in staging phase before going live
  Staging = "staging",
  
  // Site is actively operational and serving traffic
  Active = "active",
  
  // Site is being decommissioned and phased out
  Decommissioning = "decommissioning",
  
  // Site has been retired and is no longer operational
  Retired = "retired",
}

/**
 * String literal type alias for site status values.
 * @see NetboxSiteStatus for enum values
 */
export type NetboxSiteStatuses =
  | "planned"
  | "staging"
  | "active"
  | "decommissioning"
  | "retired";
