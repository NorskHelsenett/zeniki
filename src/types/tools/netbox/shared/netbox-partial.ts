/**
 * @fileoverview Base interface for NetBox partial object representations.
 * 
 * Defines common properties shared across all NetBox entity partial types including
 * identification, API interaction, metadata, and timestamping. Extended by specific
 * NetBox entity types such as sites, VLANs, tenants, and devices for consistent
 * data structure and type safety across the entire NetBox API surface.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/} NetBox REST API Documentation
 */

import { CommonKeyValueStore } from "../../../common/common-types";
import { NetboxCustomField } from "../extras/netbox-custom-field";
import { NetboxTag } from "../extras/netbox-tag";

/**
 * Base interface for partial NetBox entity representations.
 * 
 * All NetBox entities share these core properties for identification and API interaction.
 * This interface provides consistent structure across different entity types with support
 * for metadata, custom fields, tagging, and audit timestamping. Extended by specific
 * NetBox entity interfaces to ensure standardized data handling and type safety.
 * 
 * @example
 * ```typescript
 * const entity: NetboxPartial = {
 *   id: 123,
 *   display: "Example Entity",
 *   description: "Sample NetBox entity",
 *   tags: [1, 2, 3],
 *   custom_fields: { environment: "production" }
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/rest-api/} NetBox REST API Documentation
 */
export interface NetboxPartial {
  /** Unique identifier for the entity in NetBox database. */
  readonly id?: number;

  /** REST API URL endpoint for this specific entity resource. */
  readonly url?: string;

  /** Human-readable display representation of the entity. */
  readonly display?: string;

  /** Brief description of the entity's purpose or usage. */
  description?: string;
  
  /** Additional notes or detailed comments about the entity. */
  comments?: string;
  
  /** Collection of tags for categorization and filtering. */
  tags?: number[] | Partial<NetboxTag>[];
  
  /** User-defined custom fields for additional metadata. */
  custom_fields?: CommonKeyValueStore<string, string>;
  
  /** Timestamp when the entity was created in NetBox. */
  readonly created?: string | Date | null;
  
  /** Timestamp of the last modification to this entity. */
  readonly last_updated?: string | Date | null;
}
