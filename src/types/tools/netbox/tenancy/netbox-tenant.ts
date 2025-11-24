import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a complete tenant or organization in NetBox multi-tenancy system.
 * Tenants are used to isolate and organize resources for different customers or departments.
 * This is the full tenant interface with all properties, including resource counts.
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @interface NetboxTenant
 * @extends NetboxPartial
 * @see {@link https://netbox.readthedocs.io/en/stable/models/tenancy/tenant/} NetBox Tenant Documentation
 */
export interface NetboxTenant extends NetboxPartial {
  /** Human-readable name of the tenant or organization (required) */
  name: string;

  /** URL-safe slug identifier for the tenant, used in API endpoints and URLs (required) */
  slug: string;
  
  /** Optional tenant group ID for hierarchical organization of tenants */
  group?: number | null;
  
  /** Total number of circuits associated with this tenant */
  readonly circuit_count?: number;
  
  /** Total number of devices associated with this tenant */
  readonly device_count?: number;
  
  /** Total number of IP addresses associated with this tenant */
  readonly ipaddress_count?: number;
  
  /** Total number of IP prefixes associated with this tenant */
  readonly prefix_count?: number;
  
  /** Total number of racks associated with this tenant */
  readonly rack_count?: number;
  
  /** Total number of sites associated with this tenant */
  readonly site_count?: number;
  
  /** Total number of virtual machines associated with this tenant */
  readonly virtualmachine_count?: number;
  
  /** Total number of VLANs associated with this tenant */
  readonly vlan_count?: number;
  
  /** Total number of VRFs associated with this tenant */
  readonly vrf_count?: number;
  
  /** Total number of clusters associated with this tenant */
  readonly cluster_count?: number;
}
