import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox tenant for multi-tenancy.
 * Isolates and organizes resources for different customers or departments.
 *
 * @example
 * ```typescript
 * const tenant: NetboxTenant = {
 *   name: 'Customer Corp',
 *   slug: 'customer-corp',
 *   group: 1
 * };
 * ```
 */
export interface NetboxTenant extends NetboxPartial {
  /** Tenant name. */
  name: string;

  /** URL-safe slug identifier. */
  slug: string;
  
  /** Tenant group for hierarchy. */
  group?: number | null;
  
  /**
   * Circuit count.
   * @readonly
   */
  readonly circuit_count?: number;
  
  /**
   * Device count.
   * @readonly
   */
  readonly device_count?: number;
  
  /**
   * IP address count.
   * @readonly
   */
  readonly ipaddress_count?: number;
  
  /**
   * Prefix count.
   * @readonly
   */
  readonly prefix_count?: number;
  
  /**
   * Rack count.
   * @readonly
   */
  readonly rack_count?: number;
  
  /**
   * Site count.
   * @readonly
   */
  readonly site_count?: number;
  
  /**
   * Virtual machine count.
   * @readonly
   */
  readonly virtualmachine_count?: number;
  
  /**
   * VLAN count.
   * @readonly
   */
  readonly vlan_count?: number;
  
  /**
   * VRF count.
   * @readonly
   */
  readonly vrf_count?: number;
  
  /**
   * Cluster count.
   * @readonly
   */
  readonly cluster_count?: number;
}
