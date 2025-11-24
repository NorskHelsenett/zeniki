/**
 * @fileoverview NetBox Device Type definitions for Data Center Infrastructure Management (DCIM).
 * Defines the interface for hardware models and specifications used in NetBox device management.
 */

import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import {
  NetboxRackAirFlow,
  NetboxRackAirFlows,
  NetboxSubDeviceRole,
  NetboxSubDeviceRoles,
  NetboxValueLabel,
  NetboxWeightUnit,
  NetboxWightUnits,
} from "../shared/netbox-value-label";
import { NetboxManufacturer } from "./netbox-manufacturer";
import { NetBoxPlatform } from "./netbox-platform";

/**
 * Represents a device type (hardware model) in NetBox's DCIM system.
 * Device types define the physical and technical specifications of network equipment,
 * servers, and infrastructure devices, including dimensions, connectivity, and capabilities.
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @interface NetboxDeviceType
 * @extends NetboxPartial
 *
 * @example
 * ```typescript
 * const deviceType: NetboxDeviceType = {
 *   id: 1,
 *   manufacturer: 1,
 *   model: 'Catalyst 9300-48P',
 *   slug: 'catalyst-9300-48p',
 *   part_number: 'C9300-48P-E',
 *   u_height: 1,
 *   is_full_depth: true,
 *   airflow: { value: 'front-to-rear', label: 'Front to rear' },
 *   weight: 5.2,
 *   weight_unit: { value: 'kg', label: 'Kilograms' }
 * };
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/devicetype/} NetBox Device Type Documentation
 * @see {@link NetboxManufacturer} For manufacturer information
 * @see {@link NetBoxPlatform} For platform information
 */
export interface NetboxDeviceType extends NetboxPartial {
  /** 
   * Manufacturer that produces this device model.
   * Required field linking the device type to its vendor.
   */
  manufacturer: number | Readonly<Partial<NetboxManufacturer>>;

  /** 
   * Default software platform for devices of this type.
   * Automatically applied when creating new devices of this model.
   */
  default_platform?: number | Readonly<Partial<NetBoxPlatform>> | null;

  /** 
   * Model name or number as specified by the manufacturer (max 100 characters).
   * Should match official product documentation and part catalogs.
   */
  model: string; // minLength: 1, maxLength: 100

  /** 
   * URL-safe identifier for the device type (auto-generated from model).
   * Must be unique across all device types and follow slug pattern rules.
   */
  slug: string; //  maxLength: 100, pattern: ^[-a-zA-Z0-9_]+$

  /** 
   * Manufacturer's part number for ordering and inventory (max 50 characters).
   * Used for procurement, warranty tracking, and spare parts management.
   */
  part_number?: string;

  /** 
   * Height of the device in rack units (RU) from 0 to 1000.
   * Supports decimal values (e.g., 0.5) for half-rack-unit devices. Default is 1.
   */
  u_height?: number;

  /** 
   * Whether to exclude this device type from rack utilization calculations.
   * Useful for devices that don't consume standard rack space.
   */
  exclude_from_utilization?: boolean;

  /** 
   * Whether the device extends the full depth of a standard rack.
   * Important for cable management and airflow planning.
   */
  is_full_depth?: boolean;

  /** 
   * Role in modular/chassis systems.
   * Defines whether this device type acts as a parent chassis or child module.
   * 
   * Can be provided as:
   * - A string literal from NetboxSubDeviceRoles type ("parent" | "child")
   * - A NetboxSubDeviceRole enum value for type safety
   * - A readonly NetboxValueLabel object for immutable API responses
   * - null if not applicable for modular systems
   * 
   * @example
   * ```typescript
   * // String literal (simple assignment)
   * subdevice_role: "parent"
   * 
   * // Enum value (type-safe)
   * subdevice_role: NetboxSubDeviceRole.Parent
   * 
   * // Immutable value-label pair (API response format)
   * subdevice_role: { readonly value: "parent", readonly label: "Parent" }
   * ```
   */
  subdevice_role?: NetboxSubDeviceRoles | NetboxSubDeviceRole | Readonly<NetboxValueLabel<string, string>> | null;

  /** 
   * Airflow direction through the device for thermal management.
   * Critical for data center cooling design and rack layout planning.
   * 
   * Can be provided as:
   * - A string literal from NetboxRackAirFlows type
   * - A NetboxRackAirFlow enum value for type safety
   * - A readonly NetboxValueLabel object for immutable API responses
   * - null if airflow is not specified or not applicable
   * 
   * @example
   * ```typescript
   * // String literal (simple assignment)
   * airflow: "front-to-rear"
   * 
   * // Enum value (type-safe)
   * airflow: NetboxRackAirFlow["Front to rear"]
   * 
   * // Immutable value-label pair (API response format)
   * airflow: { readonly value: "front-to-rear", readonly label: "Front to rear" }
   * ```
   */
  airflow?: NetboxRackAirFlows | NetboxRackAirFlow | Readonly<NetboxValueLabel<string, string>> | null;

  /** 
   * Physical weight of the device (-1,000,000 to 1,000,000).
   * Used for rack load calculations and shipping planning.
   */
  weight?: number | null;

  /** 
   * Unit of measurement for the device weight.
   * Supports metric (kg, g) and imperial (lb, oz) units.
   * 
   * Can be provided as:
   * - A string literal from NetboxWightUnits type (note: contains legacy typo)
   * - A NetboxWeightUnit enum value for type safety
   * - A readonly NetboxValueLabel object for immutable API responses
   * - null if weight unit is not specified
   * 
   * @example
   * ```typescript
   * // String literal (simple assignment)
   * weight_unit: "kg"
   * 
   * // Enum value (type-safe, recommended)
   * weight_unit: NetboxWeightUnit.Kilograms
   * 
   * // Immutable value-label pair (API response format)
   * weight_unit: { readonly value: "kg", readonly label: "Kilograms" }
   * ```
   */
  weight_unit?: NetboxWightUnits | NetboxWeightUnit | NetboxValueLabel<string, string> | null;

  /** 
   * URL to front panel image for visual identification.
   * Helps with device identification and cable management.
   */
  front_image?: string | null;

  /** 
   * URL to rear panel image for visual identification.
   * Assists with port identification and cable management.
   */
  rear_image?: string | null;

  // Read-only template and device counts for inventory management

  /** Read-only count of devices using this device type */
  readonly device_count?: number;

  /** Read-only count of console port templates defined for this device type */
  readonly console_port_template_count?: number;

  /** Read-only count of console server port templates */
  readonly console_server_port_template_count?: number;

  /** Read-only count of power port templates */
  readonly power_port_template_count?: number;

  /** Read-only count of power outlet templates */
  readonly power_outlet_template_count?: number;

  /** Read-only count of network interface templates */
  readonly interface_template_count?: number;

  /** Read-only count of front panel port templates */
  readonly front_port_template_count?: number;

  /** Read-only count of rear panel port templates */
  readonly rear_port_template_count?: number;

  /** Read-only count of device bay templates for modular equipment */
  readonly device_bay_template_count?: number;

  /** Read-only count of module bay templates for expansion slots */
  readonly module_bay_template_count?: number;

  /** Read-only count of inventory item templates for components */
  readonly inventory_item_template_count?: number;
}
