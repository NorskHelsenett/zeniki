import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxManufacturer } from "./netbox-manufacturer";

/**
 * NetBox software platform or operating system.
 * Defines the software environment running on devices, including OS versions,
 * firmware, and management methods.
 *
 * @example
 * ```typescript
 * const platform: NetBoxPlatform = {
 *   name: 'Cisco IOS XE',
 *   slug: 'cisco-ios-xe',
 *   manufacturer: 2,
 *   config_template: 5
 * };
 * ```
 */
export interface NetBoxPlatform extends NetboxPartial {
  /** Platform name. */
  name: string;

  /** URL-safe identifier. */
  slug: string;

  /** Manufacturer developer. */
  manufacturer?: number | Readonly<Partial<NetboxManufacturer>> | null;

  /** Default configuration template. */
  config_template?: number | Readonly<Partial<NetboxGeneric>> | null;

  /**
   * Device count.
   * @readonly
   */
  readonly device_count?: number;

  /**
   * Virtual machine count.
   * @readonly
   */
  readonly virtualmachine_count?: number;
}
