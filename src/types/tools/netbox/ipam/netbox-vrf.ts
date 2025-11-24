import { NetboxTenant } from "../tenancy/netbox-tenant";
import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a Virtual Routing and Forwarding (VRF) instance in NetBox.
 * 
 * VRFs provide network segmentation and isolation for routing tables and IP address
 * spaces. Supports BGP/MPLS VPN with Route Distinguisher configuration, multi-tenant
 * isolation, IP address uniqueness enforcement, and BGP route target management.
 * Extends NetboxPartial for common properties including timestamps and custom fields.
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
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/models/ipam/vrf/} NetBox VRF Documentation
 */
export interface NetboxVrf extends NetboxPartial {
  /** Human-readable name of the VRF instance. */
  name: string;

  /** Route Distinguisher (RD) for BGP/MPLS VPN (format: ASN:ID or IP:ID). */
  rd?: string | null;
  
  /** Tenant that owns or manages this VRF. */
  tenant?: number | Readonly<Partial<NetboxTenant>> | null;
  
  /** Whether to enforce unique IP addresses within this VRF. */
  enforce_unique?: boolean;
  
  /** List of import target IDs for BGP route import. */
  import_targets?: number[];
  
  /** List of export target IDs for BGP route export. */
  export_targets?: number[];
  
  /** Total number of IP addresses within this VRF. */
  readonly ipaddress_count?: number;
  
  /** Total number of IP prefixes within this VRF. */
  readonly prefix_count?: number;
}
