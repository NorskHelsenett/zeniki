/**
 * @fileoverview NetBox Device Role definitions for Data Center Infrastructure Management (DCIM).
 * Defines the interface for functional roles that devices serve in network infrastructure.
 */

import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a functional role that devices serve in NetBox's DCIM system.
 * Device roles categorize equipment by their function in the network infrastructure,
 * enabling logical grouping and policy application based on operational purpose.
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @interface NetboxDeviceRole
 * @extends NetboxPartial
 *
 * @example
 * ```typescript
 * const deviceRole: NetboxDeviceRole = {
 *   id: 1,
 *   name: 'Distribution Switch',
 *   slug: 'distribution-switch',
 *   color: '2196f3',
 *   vm_role: false,
 *   config_template: 3,
 *   description: 'Layer 3 aggregation switches for building distribution'
 * };
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/devicerole/} NetBox Device Role Documentation
 */
export interface NetboxDeviceRole extends NetboxPartial {
  /** 
   * Human-readable name of the device role (max 100 characters).
   * Examples: "Core Router", "Access Switch", "Firewall", "Load Balancer"
   */
  name: string;

  /** 
   * URL-safe identifier for the device role (max 100 characters).
   * Auto-generated from name and must follow slug pattern rules.
   */
  slug: string;

  /** 
   * Hexadecimal color code for visual representation (6 characters, no #).
   * Used in NetBox UI for device identification and categorization.
   * Example: "ff5722" for orange, "2196f3" for blue
   */
  color?: string;

  /** 
   * Whether this role can be assigned to virtual machines.
   * Enables role reuse across both physical and virtual infrastructure.
   */
  vm_role?: boolean;

  /** 
   * Default configuration template for devices with this role.
   * Automatically applied to standardize configurations by function.
   * 
   * Can be provided as either:
   * - A numeric template ID for API operations
   * - A readonly partial NetboxGeneric object for immutable API responses
   * - null if no default template is assigned
   */
  config_template?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Read-only count of physical devices assigned this role.
   * Useful for infrastructure planning and role distribution analysis.
   */
  readonly device_count?: number;

  /** 
   * Read-only count of virtual machines assigned this role.
   * Tracks virtualized infrastructure using this functional category.
   */
  readonly virtualmachine_count?: number;
}
