import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox geographical region.
 * Provides hierarchical organization of sites with parent-child relationships.
 *
 * @example
 * ```typescript
 * const region: NetboxRegion = {
 *   name: 'North America',
 *   slug: 'north-america',
 *   parent: null
 * };
 * ```
 */
export interface NetboxRegion extends NetboxPartial {
  /** Region name. */
  name: string;
  
  /** URL-safe slug identifier. */
  slug: string;
  
  /** Parent region for hierarchy. */
  parent?: number | null;
  
  /**
   * Site count in region and sub-regions.
   * @readonly
   */
  readonly site_count?: number;
  
  /**
   * Hierarchical depth level.
   * @readonly
   */
  readonly _depth?: number;
}
