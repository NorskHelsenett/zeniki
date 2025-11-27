import { CommonKeyValueStore } from "../../../common/common-types";
import { NetboxCustomField } from "../extras/netbox-custom-field";
import { NetboxTag } from "../extras/netbox-tag";

/**
 * Base interface for NetBox entity representations.
 * Provides common properties for identification, metadata, custom fields, and tagging.
 * 
 * @example
 * ```typescript
 * const entity: NetboxPartial = {
 *   id: 123,
 *   display: "Example Entity",
 *   description: "Sample entity",
 *   tags: [1, 2, 3],
 *   custom_fields: { environment: "production" }
 * };
 * ```
 */
export interface NetboxPartial {
  /**
   * Unique entity identifier.
   * @readonly
   */
  readonly id?: number;

  /**
   * REST API URL endpoint.
   * @readonly
   */
  readonly url?: string;

  /**
   * Human-readable display representation.
   * @readonly
   */
  readonly display?: string;

  /** Entity description. */
  description?: string;
  
  /** Additional notes or comments. */
  comments?: string;
  
  /** Tag collection for categorization. */
  tags?: number[] | Partial<NetboxTag>[];
  
  /** Custom fields for additional metadata. */
  custom_fields?: CommonKeyValueStore<string, string>;
  
  /**
   * Entity creation timestamp.
   * @readonly
   */
  readonly created?: string | Date | null;
  
  /**
   * Last modification timestamp.
   * @readonly
   */
  readonly last_updated?: string | Date | null;
}
