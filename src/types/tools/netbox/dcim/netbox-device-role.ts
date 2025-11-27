import { NetboxGeneric } from "../shared/netbox-generic";
import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox device functional role.
 * Categorizes equipment by network infrastructure function,
 * enabling logical grouping and policy application.
 *
 * @example
 * ```typescript
 * const deviceRole: NetboxDeviceRole = {
 *   name: 'Distribution Switch',
 *   slug: 'distribution-switch',
 *   color: '2196f3',
 *   vm_role: false
 * };
 * ```
 */
export interface NetboxDeviceRole extends NetboxPartial {
  /**
   * Role name.
   * @maxLength 100
   */
  name: string;

  /**
   * URL-safe identifier.
   * @maxLength 100
   */
  slug: string;

  /** Hexadecimal color code (no #). */
  color?: string;

  /** Can be assigned to virtual machines. */
  vm_role?: boolean;

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
