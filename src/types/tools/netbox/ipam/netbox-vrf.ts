import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox Virtual Routing and Forwarding instance.
 * Provides network segmentation for routing tables and IP address spaces
 * with BGP/MPLS VPN support, multi-tenant isolation, and route target management.
 * 
 * @example
 * ```typescript
 * const vrf: NetboxVrf = {
 *   name: 'PRODUCTION_VRF',
 *   rd: '65000:100',
 *   tenant: { id: 5, name: 'Customer A Corp' },
 *   enforce_unique: true,
 *   import_targets: [1, 2, 3]
 * };
 * ```
 */
export interface NetboxVrf extends NetboxPartial {
  /** VRF name. */
  name: string;

  /** Route Distinguisher for BGP/MPLS VPN. */
  rd?: string | null;
  
  /** Tenant owner. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;
  
  /** Enforce unique IP addresses. */
  enforce_unique?: boolean;
  
  /** Import target IDs. */
  import_targets?: number[];
  
  /** Export target IDs. */
  export_targets?: number[];
  
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
}
