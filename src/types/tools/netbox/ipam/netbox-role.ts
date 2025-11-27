import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox role for categorizing network resources.
 * Classifies prefixes and VLANs by purpose such as user networks,
 * infrastructure segments, point-to-point links, and management networks.
 * 
 * @example
 * ```typescript
 * const role: NetboxRole = {
 *   name: 'User Network',
 *   slug: 'user-network',
 *   weight: 100,
 *   description: 'End-user access networks'
 * };
 * ```
 */
export interface NetboxRole extends NetboxPartial {
  /**
   * Role name.
   * @maxLength 100
   * @required
   */
  name: string;

  /**
   * URL-safe slug identifier.
   * @maxLength 100
   * @required
   */
  slug: string;
  
  /**
   * Weight for ordering.
   * @minimum 0
   * @maximum 32767
   * @default 1000
   */
  weight?: number;
  
  /**
   * Prefix count.
   * @readonly
   */
  readonly prefix_count?: number;
  
  /**
   * VLAN count.
   * @readonly
   */
  readonly vlan_count?: number;
}
