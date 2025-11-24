/**
 * @fileoverview Generic NetBox entity interface for simple objects.
 * Provides a minimal structure for basic NetBox entities with name and slug.
 */

/**
 * Generic interface for simple NetBox entities that have basic identification properties.
 * This is used for entities that don't require the full NetboxPartial structure
 * but need basic identification and naming capabilities.
 * 
 * @interface NetboxGeneric
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/} NetBox REST API Documentation
 */
export interface NetboxGeneric {
  /** Unique identifier for the entity in NetBox database */
  readonly id?: number;
  
  /** REST API URL endpoint for this specific entity resource */
  readonly url?: string;
  
  /** Human-readable display representation of the entity */
  readonly display?: string;
  
  /** Human-readable name of the entity (required) */
  name: string;
  
  /** URL-safe slug identifier for the entity, used in API endpoints and URLs (required) */
  slug: string;
}
