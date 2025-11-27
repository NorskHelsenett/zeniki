import { NetboxPartial } from "../shared/netbox-partial";

/**
 * NetBox tag for categorization and organization.
 * Provides flexible labeling for grouping and filtering objects.
 *
 * @example
 * ```typescript
 * const tag: NetboxTag = {
 *   name: 'Production',
 *   slug: 'production',
 *   color: '#ff0000'
 * };
 * ```
 */
export interface NetboxTag extends NetboxPartial {
  /** Tag name. */
  name: string;

  /** URL-safe slug identifier. */
  slug: string;

  /** Hexadecimal color code. */
  color?: string;

  /** Object types this tag can be applied to. */
  object_types?: string[];
  
  /**
   * Number of items with this tag.
   * @readonly
   */
  readonly tagged_items?: number;
}
