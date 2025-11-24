/**
 * @fileoverview NetBox Manufacturer definitions for Data Center Infrastructure Management (DCIM).
 * Defines the interface for hardware and software vendors in NetBox's device management system.
 */

import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a manufacturer or vendor in NetBox's DCIM system.
 * Manufacturers produce hardware devices, software platforms, and other infrastructure
 * components tracked in NetBox for procurement, support, and lifecycle management.
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @interface NetboxManufacturer
 * @extends NetboxPartial
 *
 * @example
 * ```typescript
 * const manufacturer: NetboxManufacturer = {
 *   id: 1,
 *   name: 'Cisco Systems',
 *   slug: 'cisco-systems',
 *   description: 'Multinational technology company specializing in networking hardware and software'
 * };
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/manufacturer/} NetBox Manufacturer Documentation
 */
export interface NetboxManufacturer extends NetboxPartial {
  /** 
   * Official name of the manufacturer or vendor (max 100 characters).
   * Should match the legal company name for accurate vendor management.
   */
  name: string;

  /** 
   * URL-safe identifier for the manufacturer (max 100 characters).
   * Auto-generated from name and used in API URLs and references.
   */
  slug: string;

  /** 
   * Read-only count of device types from this manufacturer.
   * Indicates product portfolio size and procurement patterns.
   */
  readonly devicetype_count?: number;

  /** 
   * Read-only count of inventory items from this manufacturer.
   * Tracks components, modules, and parts across the infrastructure.
   */
  readonly inventoryitem_count?: number;

  /** 
   * Read-only count of software platforms from this manufacturer.
   * Shows the vendor's software ecosystem presence in the environment.
   */
  readonly platform_count?: number;
}