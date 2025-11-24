/**
 * @fileoverview NetBox Device type definitions for Data Center Infrastructure Management (DCIM).
 * Defines the complete interface for physical network devices, servers, and infrastructure equipment in NetBox.
 */

import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import {
  NetboxRackAirFlow,
  NetboxRackFace,
  NetboxOperationalStatus,
  NetboxOperationalStatuses,
  NetboxValueLabel,
  NetboxRackAirFlows,
  NetboxRackFaces,
} from "../shared/netbox-value-label";
import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxDeviceRole } from "./netbox-device-role";
import { NetboxDeviceType } from "./netbox-device-type";
import { NetBoxPlatform } from "./netbox-platform";
import { NetboxSite } from "./netbox-site";

/**
 * Represents a physical device in NetBox's Data Center Infrastructure Management (DCIM) system.
 * Devices are physical network equipment, servers, or other infrastructure components located
 * within data center sites, racks, and locations.
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @interface NetboxDevice
 * @extends NetboxPartial
 *
 * @example
 * ```typescript
 * const device: NetboxDevice = {
 *   id: 1,
 *   name: 'switch-01',
 *   device_type: 42,
 *   role: 1,
 *   site: 3,
 *   rack: 10,
 *   position: 42,
 *   face: { value: 'front', label: 'Front' },
 *   status: { value: 'active', label: 'Active' },
 *   serial: 'ABC123456',
 *   asset_tag: 'ASSET-001',
 *   tenant: 1,
 *   primary_ip4: 5,
 *   description: 'Main distribution switch'
 * };
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/device/} NetBox Device Documentation
 * @see {@link NetboxSite} For site information
 * @see {@link NetboxTenant} For tenant information
 */

export interface NetboxDevice extends NetboxPartial {
  /** 
   * Human-readable name of the device (max 64 characters).
   * Typically follows organizational naming conventions like hostname patterns.
   */
  name?: string | null;

  /** 
   * Device type defining the hardware model and specifications.
   * References a NetBox device type that includes manufacturer, model, and physical characteristics.
   */
  device_type: number | Readonly<NetboxDeviceType>;

  /** 
   * Functional role of the device in the network infrastructure.
   * Examples: access-switch, distribution-switch, core-router, firewall, server.
   */
  role: number | Readonly<NetboxDeviceRole>;

  /** 
   * Read-only alias for the role field.
   * Maintained for backward compatibility with older NetBox versions.
   * @deprecated since version 3.6
   */
  readonly device_role?: number | Partial<NetboxDeviceRole>;

  /** 
   * Tenant that owns or manages this device.
   * Used for multi-tenant environments and billing/ownership tracking.
   * 
   * Can be provided as either:
   * - A numeric tenant ID for API operations
   * - A readonly partial NetboxTenant object for immutable API responses
   * - null if the device has no specific tenant assignment
   */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;

  /** 
   * Software platform running on the device.
   * Examples: Cisco IOS, Juniper JUNOS, Linux, Windows Server.
   */
  platform?: number | Readonly<Partial<NetBoxPlatform>> | null;

  /** 
   * Manufacturer's serial number for the device (max 50 characters).
   * Used for warranty tracking and asset management.
   */
  serial?: string | null;

  /** 
   * Organization's internal asset tag identifier (max 50 characters).
   * Used for inventory management and asset tracking.
   */
  asset_tag?: string | null;

  /** 
   * Physical site where the device is located.
   * Required field that determines the device's geographical location.
   * 
   * Can be provided as either:
   * - A numeric site ID for API operations
   * - A readonly partial NetboxSite object for immutable API responses
   */
  site: number | Readonly<Partial<NetboxSite>>;

  /** 
   * Specific location within the site (room, floor, building section).
   * Provides granular positioning within larger facilities.
   */
  location?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Physical rack where the device is mounted.
   * Used for precise equipment positioning and space management.
   */
  rack?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Rack unit (RU) position within the rack (0.5 - 100).
   * Decimal values (e.g., 1.5) support half-rack-unit devices.
   */
  position?: number | null;

  /** 
   * Physical mounting orientation of the device in the rack.
   * Determines cable management and airflow considerations.
   * 
   * Can be provided as:
   * - A string literal from NetboxRackFaces type ("front" | "back")
   * - A NetboxRackFace enum value for type safety
   * - A readonly NetboxValueLabel object for immutable API responses
   * 
   * @example
   * ```typescript
   * // String literal (simple assignment)
   * face: "front"
   * 
   * // Enum value (type-safe)
   * face: NetboxRackFace.Front
   * 
   * // Immutable value-label pair (API response format)
   * face: { readonly value: "front", readonly label: "Front" }
   * ```
   */
  face?: NetboxRackFaces | NetboxRackFace |  Readonly<NetboxValueLabel<NetboxRackFaces, string>>;

  /** 
   * GPS latitude coordinate for device location (-100 to 100).
   * Used for geographical mapping and disaster recovery planning.
   */
  latitude?: number | null;

  /** 
   * GPS longitude coordinate for device location (-1000 to 1000).
   * Used for geographical mapping and disaster recovery planning.
   */
  longitude?: number | null;

  /** 
   * Read-only reference to parent device for modular equipment.
   * Used for chassis-based systems with removable modules.
   */
  readonly parent_device?: number | Partial<NetboxDevice>;

  /** 
   * Operational status of the device.
   * Tracks the current lifecycle state and operational condition.
   * 
   * Can be provided as:
   * - A string literal from NetboxOperationalStatuses type
   * - A NetboxOperationalStatus enum value for type safety  
   * - A readonly NetboxValueLabel object for immutable API responses
   * 
   * Common status values: active, offline, planned, staged, failed, decommissioning.
   * 
   * @example
   * ```typescript
   * // String literal (simple assignment)
   * status: "active"
   * 
   * // Enum value (type-safe)
   * status: NetboxOperationalStatus.Active
   * 
   * // Immutable value-label pair (API response format)
   * status: { readonly value: "active", readonly label: "Active" }
   * ```
   */
  status: NetboxOperationalStatuses | NetboxOperationalStatus | Readonly<NetboxValueLabel<NetboxOperationalStatuses, string>>;

  /** 
   * Airflow direction through the device for cooling management.
   * Critical for data center thermal design and equipment placement.
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
  airflow?: NetboxRackAirFlows |NetboxRackAirFlow | Readonly<NetboxValueLabel<NetboxRackAirFlows, string>> | null;

  /** 
   * Read-only primary IP address (IPv4 or IPv6) for management access.
   * Automatically determined based on primary_ip4 and primary_ip6 settings.
   */
  readonly primary_ip?: number | Partial<NetboxGeneric> | null;

  /** 
   * Primary IPv4 address for device management and monitoring.
   * Used as the default management interface for network operations.
   */
  primary_ip4?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Primary IPv6 address for device management and monitoring.
   * Used as the default management interface for IPv6 operations.
   */
  primary_ip6?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Out-of-band management IP address (IPMI, iDRAC, iLO).
   * Used for remote power management and hardware monitoring.
   */
  oob_ip?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Virtualization cluster this device belongs to.
   * Used for hypervisor hosts and clustered infrastructure.
   */
  cluster?: number | Readonly<Partial<NetboxGeneric>> | null; // id, type: int

  /** 
   * Virtual chassis this device participates in.
   * Used for stackable switches and virtual chassis configurations.
   */
  virtual_chassis?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Position within the virtual chassis stack (0-255).
   * Determines the device's role in multi-unit stacks.
   */
  vc_position?: number | null;

  /** 
   * Priority for virtual chassis master election (0-255).
   * Higher values indicate higher priority for leadership roles.
   */
  vc_priority?: number | null;

  /** 
   * Configuration template applied to this device.
   * Used for automated configuration management and compliance.
   */
  config_template?: number | Readonly<Partial<NetboxGeneric>> | null;

  /** 
   * Read-only computed configuration context from inherited sources.
   * Aggregates configuration data from site, platform, tenant, and device type.
   */
  readonly config_context?: object | null;

  /** 
   * Device-specific configuration context data.
   * Local overrides for configuration templates and automation.
   */
  local_context_data?: object | null;

  // Read-only port and component counts for inventory management

  /** Read-only count of console ports for terminal access */
  readonly console_port_count?: number;

  /** Read-only count of console server ports for out-of-band access */
  readonly console_server_port_count?: number;

  /** Read-only count of power input ports */
  readonly power_port_count?: number;

  /** Read-only count of power output outlets */
  readonly power_outlet_count?: number;

  /** Read-only count of network interfaces */
  readonly interface_count?: number;

  /** Read-only count of front panel ports */
  readonly front_port_count?: number;

  /** Read-only count of rear panel ports */
  readonly rear_port_count?: number;

  /** Read-only count of device bays for modular equipment */
  readonly device_bay_count?: number;

  /** Read-only count of module bays for expansion cards */
  readonly module_bay_count?: number;

  /** Read-only count of inventory items and components */
  readonly inventory_item_count?: number;
}
