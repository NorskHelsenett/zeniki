import { NetboxPartial } from "../shared/netbox-partial";

/**
 * Represents a complete NetBox tag used for categorization and organization of entities.
 * Tags provide a flexible labeling system for grouping and filtering NetBox objects.
 *
 * This interface extends NetboxPartial, inheriting common properties like id, url, display,
 * description, comments, tags, custom_fields, created, and last_updated.
 *
 * @interface NetboxTag
 * @extends NetboxPartial
 * @see {@link https://netbox.readthedocs.io/en/stable/models/extras/tag/} NetBox Tag Documentation
 */
export interface NetboxTag extends NetboxPartial {
  /** Human-readable name of the tag (required) */
  name: string;

  /** URL-safe slug identifier for the tag, used in API endpoints and URLs (required) */
  slug: string;

  /** Hexadecimal color code for visual representation of the tag (e.g., "#ff0000") */
  color?: string;

  /** List of object types that this tag can be applied to */
  object_types?: string[];
  
  /** Total number of items tagged with this tag */
  readonly tagged_items?: number;
}
