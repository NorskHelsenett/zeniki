import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxValueLabel } from "../shared/netbox-value-label";
import { NetboxCustomFieldChoiceSet } from "./netbox-custom-field-choice-set";

/**
 * NetBox custom field configuration.
 * Extends built-in object types with organization-specific properties
 * supporting text, numbers, booleans, dates, URLs, and selection lists.
 *
 * @example
 * ```typescript
 * const field: NetboxCustomField = {
 *   name: "environment",
 *   label: "Environment",
 *   type: { value: "select", label: "Selection" },
 *   content_types: ["ipam.prefix"],
 *   choice_set: 1,
 *   required: true
 * };
 * ```
 */
export interface NetboxCustomField extends NetboxPartial {
  /** Object models this field applies to (app.model format). */
  content_types: string[];

  /** Data type defining storage and validation. */
  type: NetboxValueLabel<string, string>;

  /** Specific object type within content type. */
  object_type: string | null;

  /**
   * Underlying storage data type.
   * @readonly
   */
  readonly data_type?: string;

  /**
   * Internal field name.
   * @maxLength 50
   */
  name: string;

  /**
   * UI display label.
   * @maxLength 50
   */
  label?: string;

  /**
   * Group name for UI organization.
   * @maxLength 50
   */
  group_name?: string;

  /**
   * Field is required.
   * @default false
   */
  required?: boolean;

  /**
   * Search weight for global search.
   * @minimum 0
   * @maximum 37767
   * @default 1000
   */
  search_weight?: number;

  /** Filter logic for object filtering. */
  filter_logic?: NetboxValueLabel<string, string>;

  /** UI visibility control. */
  ui_visible?: NetboxValueLabel<string, string>;

  /** UI editability control. */
  ui_editable?: NetboxValueLabel<string, string>;

  /**
   * Copy value when cloning objects.
   * @default true
   */
  is_cloneable?: boolean;

  /** Default value for new objects. */
  default?: object | null;

  /**
   * Display weight for UI ordering.
   * @minimum 0
   * @maximum 37767
   * @default 100
   */
  weight?: number;

  /**
   * Minimum value for numeric fields.
   * @minimum -9223372036854776000
   * @maximum 9223372036854776000
   */
  validation_minimum?: number | null;

  /**
   * Maximum value for numeric fields.
   * @minimum -9223372036854776000
   * @maximum 9223372036854776000
   */
  validation_maximum?: number | null;

  /**
   * Regex pattern for text validation.
   * @maxLength 500
   */
  validation_regex?: string;

  /** Choice set for selection fields. */
  choice_set: number | Partial<NetboxCustomFieldChoiceSet> | null;
}
