import { NetboxPartial } from "../shared/netbox-partial";

/**
 * @fileoverview NetBox region interface for geographical organization.
 * Regions provide hierarchical geographical organization of sites.
 */

/**
 * Represents a geographical region in NetBox for organizing sites.
 * Regions can be hierarchical with parent-child relationships to model
 * geographical organization (e.g., Continent > Country > State/Province).
 * 
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 * 
 * @interface NetboxRegion
 * @extends NetboxPartial
 * @see {@link https://netbox.readthedocs.io/en/stable/models/dcim/region/} NetBox Region Documentation
 */
export interface NetboxRegion extends NetboxPartial {
  /** Human-readable name of the region (e.g., "North America", "Europe") (required) */
  name: string;
  
  /** URL-safe slug identifier for the region, used in API endpoints and URLs (required) */
  slug: string;
  
  /** Parent region ID for hierarchical organization (null for top-level regions) */
  parent?: number | null;
  
  /** Total number of sites within this region and its sub-regions */
  readonly site_count?: number;
  
  /** 
   * Hierarchical depth level in the region tree structure.
   * Used for organizing regions in a tree-like hierarchy.
   */
  readonly _depth?: number;
}
