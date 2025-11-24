/**
 * @fileoverview NetBox Platform type definitions for Data Center Infrastructure Management (DCIM).
 * Defines the interface for software platforms and operating systems that run on network devices.
 */

import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxManufacturer } from "./netbox-manufacturer";

/**
 * Represents a software platform or operating system in NetBox's DCIM system.
 * Platforms define the software environment running on devices, including operating systems,
 * firmware versions, and software stacks that determine device capabilities and management methods.
 *
 * **Key Features:**
 * - Manufacturer association linking software to vendors
 * - Configuration template support for automated management
 * - Readonly usage counters for adoption tracking
 * - Immutable manufacturer references in API responses
 * - License and support lifecycle management
 * - Device and virtual machine compatibility tracking
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @example Basic platform creation
 * ```typescript
 * const basicPlatform: NetBoxPlatform = {
 *   name: 'Ubuntu Server 22.04 LTS',
 *   slug: 'ubuntu-22-04-lts',
 *   manufacturer: 1,  // Canonical Ltd.
 *   description: 'Long-term support Ubuntu Server release'
 * };
 * ```
 *
 * @example Complete platform with configuration template
 * ```typescript
 * const completePlatform: NetBoxPlatform = {
 *   id: 1,
 *   name: 'Cisco IOS XE',
 *   slug: 'cisco-ios-xe',
 *   manufacturer: { readonly id: 2, readonly name: 'Cisco Systems' },
 *   config_template: { readonly id: 5, readonly name: 'IOS-XE Base Config' },
 *   description: 'Cisco IOS XE operating system for enterprise switches and routers'
 * };
 * ```
 *
 * @example API response with readonly properties
 * ```typescript
 * const platformFromAPI = await netbox.getPlatform(1);
 * // platformFromAPI.manufacturer = { readonly id: 2, readonly name: "Cisco Systems", ... }
 * 
 * // ✅ Safe: Reading properties and counts
 * console.log(platformFromAPI.manufacturer?.name);   // "Cisco Systems"
 * console.log(platformFromAPI.device_count);         // 150 (readonly count)
 * console.log(platformFromAPI.virtualmachine_count); // 75 (readonly count)
 * 
 * // ❌ Error: Cannot modify readonly properties
 * // platformFromAPI.manufacturer.name = "New Name"; // TypeScript error
 * ```
 *
 * @interface NetBoxPlatform
 * @extends NetboxPartial
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/platform/} NetBox Platform Documentation
 * @see {@link NetboxManufacturer} For manufacturer information and readonly patterns
 * @see {@link NetboxGeneric} For configuration template references
 */
export interface NetBoxPlatform extends NetboxPartial {
  /** 
   * Human-readable name of the software platform.
   * Examples: "Cisco IOS", "Juniper JUNOS", "Ubuntu Server", "Windows Server 2022"
   */
  name: string;

  /** 
   * URL-safe identifier for the platform (auto-generated from name).
   * Used in API URLs and must be unique across all platforms.
   */
  slug: string;

  /** 
   * Manufacturer that develops or maintains this platform.
   * Links the software platform to its vendor for support and licensing.
   * 
   * Can be provided as:
   * - Numeric manufacturer ID for API operations
   * - Readonly partial manufacturer object from API responses (immutable)
   * - null if no specific manufacturer assignment
   * 
   * @example
   * ```typescript
   * // Manufacturer ID reference
   * manufacturer: 2
   * 
   * // Readonly partial manufacturer object (API response)
   * manufacturer: { 
   *   readonly id: 2, 
   *   readonly name: "Cisco Systems", 
   *   readonly slug: "cisco-systems" 
   * }
   * ```
   */
  manufacturer?: number | Readonly<Partial<NetboxManufacturer>> | null;

  /** 
   * Default configuration template applied to devices using this platform.
   * Used for automated configuration management and standardization.
   */
  config_template?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Read-only count of physical devices using this platform.
   * Useful for platform adoption tracking and licensing management.
   */
  readonly device_count?: number;

  /** 
   * Read-only count of virtual machines using this platform.
   * Tracks virtualized instances for resource planning and licensing.
   */
  readonly virtualmachine_count?: number;
}
