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
 * NetBox device type (hardware model).
 * Defines physical and technical specifications including
 * dimensions, connectivity, and capabilities.
 *
 * @example
 * ```typescript
 * const deviceType: NetboxDeviceType = {
 *   manufacturer: 1,
 *   model: 'Catalyst 9300-48P',
 *   slug: 'catalyst-9300-48p',
 *   u_height: 1,
 *   weight: 5.2
 * };
 * ```
 */
export interface NetboxDeviceType extends NetboxPartial {
  /** Manufacturer. */
  manufacturer: number | Readonly<Partial<NetboxManufacturer>>;

  /** Default software platform. */
  default_platform?: number | Readonly<Partial<NetBoxPlatform>> | null;

  /**
   * Model name or number.
   * @maxLength 100
   */
  model: string;

  /**
   * URL-safe identifier.
   * @maxLength 100
   */
  slug: string;

  /**
   * Part number.
   * @maxLength 50
   */
  part_number?: string;

  /**
   * Height in rack units.
   * @minimum 0
   * @maximum 1000
   * @default 1
   */
  u_height?: number;

  /** Exclude from utilization calculations. */
  exclude_from_utilization?: boolean;

  /** Extends full rack depth. */
  is_full_depth?: boolean;

  /** Modular/chassis role. */
  subdevice_role?: NetboxSubDeviceRoles | NetboxSubDeviceRole | Readonly<NetboxValueLabel<string, string>> | null;

  /** Airflow direction. */
  airflow?: NetboxRackAirFlows | NetboxRackAirFlow | Readonly<NetboxValueLabel<string, string>> | null;

  /**
   * Device weight.
   * @minimum -1000000
   * @maximum 1000000
   */
  weight?: number | null;

  /** Weight unit. */
  weight_unit?: NetboxWightUnits | NetboxWeightUnit | NetboxValueLabel<string, string> | null;

  /** Front panel image URL. */
  front_image?: string | null;

  /** Rear panel image URL. */
  rear_image?: string | null;

  /**
   * Device count.
   * @readonly
   */
  readonly device_count?: number;

  /**
   * Console port template count.
   * @readonly
   */
  readonly console_port_template_count?: number;

  /**
   * Console server port template count.
   * @readonly
   */
  readonly console_server_port_template_count?: number;

  /**
   * Power port template count.
   * @readonly
   */
  readonly power_port_template_count?: number;

  /**
   * Power outlet template count.
   * @readonly
   */
  readonly power_outlet_template_count?: number;

  /**
   * Interface template count.
   * @readonly
   */
  readonly interface_template_count?: number;

  /**
   * Front port template count.
   * @readonly
   */
  readonly front_port_template_count?: number;

  /**
   * Rear port template count.
   * @readonly
   */
  readonly rear_port_template_count?: number;

  /**
   * Device bay template count.
   * @readonly
   */
  readonly device_bay_template_count?: number;

  /**
   * Module bay template count.
   * @readonly
   */
  readonly module_bay_template_count?: number;

  /**
   * Inventory item template count.
   * @readonly
   */
  readonly inventory_item_template_count?: number;
}
