import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox manufacturer or vendor.
 * Represents producers of hardware devices, software platforms,
 * and infrastructure components for procurement and lifecycle management.
 *
 * @example
 * ```typescript
 * const manufacturer: NetboxManufacturer = {
 *   name: 'Cisco Systems',
 *   slug: 'cisco-systems',
 *   description: 'Networking hardware and software'
 * };
 * ```
 */
export interface NetboxManufacturer extends NetboxPartial {
  /**
   * Manufacturer name.
   * @maxLength 100
   */
  name: string;

  /**
   * URL-safe identifier.
   * @maxLength 100
   */
  slug: string;

  /**
   * Device type count.
   * @readonly
   */
  readonly devicetype_count?: number;

  /**
   * Inventory item count.
   * @readonly
   */
  readonly inventoryitem_count?: number;

  /**
   * Platform count.
   * @readonly
   */
  readonly platform_count?: number;
}