/**
 * Generic NetBox entity with basic identification.
 * Minimal structure for entities with name and slug.
 *
 * @example
 * ```typescript
 * const entity: NetboxGeneric = {
 *   name: 'Entity Name',
 *   slug: 'entity-name'
 * };
 * ```
 */
export interface NetboxGeneric {
  /**
   * Unique identifier.
   * @readonly
   */
  readonly id?: number;
  
  /**
   * REST API URL.
   * @readonly
   */
  readonly url?: string;
  
  /**
   * Display representation.
   * @readonly
   */
  readonly display?: string;
  
  /** Entity name. */
  name: string;
  
  /** URL-safe slug identifier. */
  slug: string;
}
