/**
 * @fileoverview NetBox custom field type definitions for extensible object properties.
 * Custom fields in NetBox allow administrators to add additional properties to built-in objects,
 * providing flexibility for organization-specific data requirements and custom metadata.
 */

import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxValueLabel } from "../shared/netbox-value-label";
import { NetboxCustomFieldChoiceSet } from "./netbox-custom-field-choice-set";

/**
 * Interface representing a NetBox custom field configuration.
 * Custom fields allow NetBox administrators to extend built-in object types with additional
 * properties specific to their organization's needs. These fields can be applied to various
 * object types including prefixes, sites, devices, and more.
 *
 * Custom fields support various data types including text, numbers, booleans, dates,
 * URLs, and selection lists, with configurable validation rules and UI behavior.
 *
 * @example
 * ```typescript
 * // Text custom field for tracking business purpose
 * const businessPurposeField: NetboxCustomField = {
 *   name: "business_purpose",
 *   label: "Business Purpose",
 *   type: { value: "text", label: "Text" },
 *   content_types: ["ipam.prefix"],
 *   required: true,
 *   group_name: "Business Information",
 *   weight: 100
 * };
 *
 * // Selection custom field with choice set
 * const environmentField: NetboxCustomField = {
 *   name: "environment",
 *   label: "Environment",
 *   type: { value: "select", label: "Selection" },
 *   content_types: ["ipam.prefix", "dcim.device"],
 *   choice_set: 1, // References NetboxCustomFieldChoiceSet
 *   required: false,
 *   ui_visible: { value: "always", label: "Always" }
 * };
 *
 * // Numeric custom field with validation
 * const costCenterField: NetboxCustomField = {
 *   name: "cost_center",
 *   label: "Cost Center ID",
 *   type: { value: "integer", label: "Integer" },
 *   content_types: ["dcim.site"],
 *   validation_minimum: 1000,
 *   validation_maximum: 9999,
 *   required: true
 * };
 * ```
 *
 * @see {@link https://netbox.readthedocs.io/en/stable/customization/custom-fields/} NetBox Custom Fields Documentation
 * @see {@link https://netbox.readthedocs.io/en/stable/models/extras/customfield/} NetBox CustomField Model
 * @see {@link NetboxCustomFieldChoiceSet} For choice set definitions
 */
export interface NetboxCustomField extends NetboxPartial {
  /**
   * Array of content types (object models) to which this custom field applies.
   * Content types are specified in Django's "app.model" format.
   * 
   * @example
   * ```typescript
   * // Apply to IP prefixes only
   * content_types: ["ipam.prefix"]
   * 
   * // Apply to multiple object types
   * content_types: ["ipam.prefix", "dcim.device", "dcim.site"]
   * 
   * // Apply to all IPAM objects
   * content_types: ["ipam.prefix", "ipam.ipaddress", "ipam.vlan"]
   * ```
   */
  content_types: string[];

  /**
   * The data type of the custom field, defining how values are stored and validated.
   * Common types include text, integer, boolean, date, url, json, and select.
   * 
   * @example
   * ```typescript
   * // Text field
   * type: { value: "text", label: "Text" }
   * 
   * // Integer field
   * type: { value: "integer", label: "Integer" }
   * 
   * // Selection field (requires choice_set)
   * type: { value: "select", label: "Selection" }
   * 
   * // Boolean field
   * type: { value: "boolean", label: "Boolean (True/False)" }
   * ```
   */
  type: NetboxValueLabel<string, string>;

  /**
   * Specific object type within the content type, if applicable.
   * Used for more granular control over field application.
   * Typically null for most custom fields.
   */
  object_type: string | null;

  /**
   * The underlying data type used for storage (read-only).
   * Automatically determined based on the field type.
   * 
   * @readonly
   * @example "varchar", "integer", "boolean", "date", etc.
   */
  readonly data_type?: string;

  /**
   * The internal name of the custom field (maximum 50 characters).
   * Must be unique across all custom fields and follow Python variable naming conventions.
   * Used in API requests and database storage.
   * 
   * @example
   * ```typescript
   * name: "business_owner"      // Good: descriptive, snake_case
   * name: "cost_center_id"      // Good: clear purpose
   * name: "env"                 // Acceptable: abbreviated but clear
   * ```
   */
  name: string; // maxLength: 50

  /**
   * Human-readable label displayed in the NetBox UI (maximum 50 characters).
   * If not specified, the name will be used with proper formatting.
   * 
   * @example
   * ```typescript
   * name: "business_owner",
   * label: "Business Owner"     // Displayed in UI
   * 
   * name: "maint_window",
   * label: "Maintenance Window" // More descriptive than name
   * ```
   */
  label?: string; // maxLength: 50

  /**
   * Optional grouping name for organizing related custom fields in the UI (maximum 50 characters).
   * Fields with the same group_name are displayed together in collapsible sections.
   * 
   * @example
   * ```typescript
   * // Group business-related fields
   * group_name: "Business Information"
   * 
   * // Group technical fields
   * group_name: "Technical Details"
   * 
   * // Group compliance fields
   * group_name: "Compliance & Security"
   * ```
   */
  group_name?: string; // maxLength: 50

  /**
   * Whether this field is required when creating or updating objects.
   * Required fields must have a value before an object can be saved.
   * 
   * @default false
   * 
   * @example
   * ```typescript
   * // Critical business information
   * required: true
   * 
   * // Optional metadata
   * required: false
   * ```
   */
  required?: boolean;

  /**
   * Search weight for this field in global search operations (0-37767).
   * Higher values give this field more importance in search results.
   * 
   * @minimum 0
   * @maximum 37767
   * @default 1000
   * 
   * @example
   * ```typescript
   * search_weight: 5000   // High importance for search
   * search_weight: 1000   // Default importance
   * search_weight: 100    // Low importance for search
   * ```
   */
  search_weight?: number; // maximum: 37767, minimum: 0

  /**
   * Logic used when filtering objects by this custom field.
   * Determines how filter values are applied (exact match, contains, etc.).
   * 
   * @example
   * ```typescript
   * // Exact match filtering
   * filter_logic: { value: "exact", label: "Exact" }
   * 
   * // Partial match filtering
   * filter_logic: { value: "icontains", label: "Contains" }
   * ```
   */
  filter_logic?: NetboxValueLabel<string, string>;

  /**
   * Controls when this field is visible in the NetBox UI.
   * Options typically include "always", "if-set", and "hidden".
   * 
   * @example
   * ```typescript
   * // Always show field
   * ui_visible: { value: "always", label: "Always" }
   * 
   * // Only show if field has a value
   * ui_visible: { value: "if-set", label: "If set" }
   * 
   * // Hide from UI (API only)
   * ui_visible: { value: "hidden", label: "Hidden" }
   * ```
   */
  ui_visible?: NetboxValueLabel<string, string>;

  /**
   * Controls whether this field can be edited in the NetBox UI.
   * Options typically include "yes", "no", and "hidden".
   * 
   * @example
   * ```typescript
   * // Fully editable
   * ui_editable: { value: "yes", label: "Yes" }
   * 
   * // Read-only in UI
   * ui_editable: { value: "no", label: "No" }
   * 
   * // Hidden from editing forms
   * ui_editable: { value: "hidden", label: "Hidden" }
   * ```
   */
  ui_editable?: NetboxValueLabel<string, string>;

  /**
   * Whether this field's value should be copied when cloning objects.
   * Useful for fields that should be inherited vs. fields that should be unique.
   * 
   * @default true
   * 
   * @example
   * ```typescript
   * // Clone business owner information
   * is_cloneable: true
   * 
   * // Don't clone unique identifiers
   * is_cloneable: false
   * ```
   */
  is_cloneable?: boolean;

  /**
   * Default value for this field when creating new objects.
   * The format depends on the field type (string, number, object, etc.).
   * 
   * @example
   * ```typescript
   * // Text field default
   * default: "Development"
   * 
   * // Integer field default
   * default: 100
   * 
   * // Boolean field default
   * default: false
   * 
   * // Complex object default
   * default: { "environment": "dev", "tier": "2" }
   * ```
   */
  default?: object | null;

  /**
   * Display weight for ordering fields in the UI (0-37767).
   * Fields with lower weights appear first in forms and displays.
   * 
   * @minimum 0
   * @maximum 37767
   * @default 100
   * 
   * @example
   * ```typescript
   * weight: 10    // Display first
   * weight: 100   // Default position
   * weight: 500   // Display later
   * ```
   */
  weight?: number; // maximum: 37767, minimum: 0

  /**
   * Minimum value for numeric fields (integer/decimal types).
   * Enforces lower bound validation on numeric inputs.
   * 
   * @minimum -9223372036854776000
   * @maximum 9223372036854776000
   * 
   * @example
   * ```typescript
   * // Port numbers must be >= 1
   * validation_minimum: 1
   * 
   * // Cost centers start at 1000
   * validation_minimum: 1000
   * 
   * // Allow negative values
   * validation_minimum: -100
   * ```
   */
  validation_minimum?: number | null; // maximum: 9223372036854776000 , minimum: -9223372036854776000

  /**
   * Maximum value for numeric fields (integer/decimal types).
   * Enforces upper bound validation on numeric inputs.
   * 
   * @minimum -9223372036854776000
   * @maximum 9223372036854776000
   * 
   * @example
   * ```typescript
   * // Port numbers must be <= 65535
   * validation_maximum: 65535
   * 
   * // Cost centers end at 9999
   * validation_maximum: 9999
   * 
   * // Percentage values
   * validation_maximum: 100
   * ```
   */
  validation_maximum?: number | null;

  /**
   * Regular expression pattern for validating text field values (maximum 500 characters).
   * Uses Python regex syntax for validation rules.
   * 
   * @example
   * ```typescript
   * // Email validation
   * validation_regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
   * 
   * // Phone number format
   * validation_regex: "^\\+?1?[2-9]\\d{2}[2-9]\\d{2}\\d{4}$"
   * 
   * // Alphanumeric codes
   * validation_regex: "^[A-Z0-9]{4,8}$"
   * 
   * // IPv4 address
   * validation_regex: "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$"
   * ```
   */
  validation_regex?: string; // maxLength: 500

  /**
   * Reference to a choice set for selection-type fields.
   * Can be the choice set ID (number) or a partial choice set object.
   * Required for "select" and "multiselect" field types.
   * 
   * @example
   * ```typescript
   * // Reference by ID
   * choice_set: 1
   * 
   * // Reference with partial object
   * choice_set: {
   *   id: 1,
   *   name: "Environment Types",
   *   base_choices: { value: "dev", label: "Development" }
   * }
   * 
   * // No choice set for non-selection fields
   * choice_set: null
   * ```
   * 
   * @see {@link NetboxCustomFieldChoiceSet} For choice set structure
   */
  choice_set: number | Partial<NetboxCustomFieldChoiceSet> | null;
}
