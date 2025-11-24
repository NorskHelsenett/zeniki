/**
 * @fileoverview NetBox custom field choice set type definitions for selection field options.
 * Choice sets define the available options for selection-type custom fields in NetBox,
 * providing predefined values that users can select when filling out custom fields.
 */

import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxValueLabel } from "../shared/netbox-value-label";

/**
 * Interface representing a NetBox custom field choice set configuration.
 * Choice sets define the available options for selection-type custom fields,
 * including both base choices (predefined options) and extra choices (custom additions).
 * They provide a controlled vocabulary for dropdown and multi-select custom fields.
 * 
 * Choice sets can be shared across multiple custom fields and support both
 * predefined choices and additional custom options that administrators can add.
 * 
 * @interface NetboxCustomFieldChoiceSet
 * @extends NetboxPartial
 * 
 * @example
 * ```typescript
 * // Environment choice set for network classifications
 * const environmentChoiceSet: NetboxCustomFieldChoiceSet = {
 *   name: "Environment Types",
 *   base_choices: { value: "dev", label: "Development" },
 *   extra_choices: [
 *     ["prod", "Production"],
 *     ["test", "Testing"],
 *     ["stage", "Staging"],
 *     ["demo", "Demo"]
 *   ],
 *   order_alphabetically: true,
 *   choices_count: 5
 * };
 * 
 * // Priority levels choice set
 * const priorityChoiceSet: NetboxCustomFieldChoiceSet = {
 *   name: "Priority Levels",
 *   extra_choices: [
 *     ["critical", "Critical"],
 *     ["high", "High"],
 *     ["medium", "Medium"],
 *     ["low", "Low"]
 *   ],
 *   order_alphabetically: false, // Keep priority order
 *   choices_count: 4
 * };
 * 
 * // Region choice set with base and extra choices
 * const regionChoiceSet: NetboxCustomFieldChoiceSet = {
 *   name: "Geographic Regions",
 *   base_choices: { value: "us", label: "United States" },
 *   extra_choices: [
 *     ["eu", "Europe"],
 *     ["apac", "Asia Pacific"],
 *     ["latam", "Latin America"]
 *   ],
 *   order_alphabetically: true
 * };
 * ```
 * 
 * @see {@link https://netbox.readthedocs.io/en/stable/customization/custom-fields/} NetBox Custom Fields Documentation
 * @see {@link https://netbox.readthedocs.io/en/stable/models/extras/customfieldchoiceset/} NetBox CustomFieldChoiceSet Model
 * @see {@link NetboxCustomField} For custom field definitions that use choice sets
 */
export interface NetboxCustomFieldChoiceSet extends NetboxPartial {
  /**
   * The name of the choice set (maximum 100 characters).
   * Should be descriptive and indicate the purpose or category of choices.
   * Used for identification and management in the NetBox admin interface.
   * 
   * @example
   * ```typescript
   * name: "Environment Types"        // Clear purpose
   * name: "Device Criticality"       // Business context
   * name: "Network Zones"           // Technical classification
   * name: "Compliance Levels"       // Regulatory context
   * ```
   */
  name: string; // maxLength: 100

  /**
   * Base choice value-label pair, typically representing a default or primary option.
   * This is often used as a fallback or default selection for the choice set.
   * 
   * @example
   * ```typescript
   * // Default environment
   * base_choices: { value: "dev", label: "Development" }
   * 
   * // Default priority
   * base_choices: { value: "medium", label: "Medium Priority" }
   * 
   * // Default region
   * base_choices: { value: "local", label: "Local" }
   * ```
   */
  base_choices?: NetboxValueLabel<string, string>;

  /**
   * Array of additional choice options as [value, label] tuples.
   * These represent the main selection options available to users.
   * Values should be unique and labels should be user-friendly.
   * 
   * @example
   * ```typescript
   * // Environment choices
   * extra_choices: [
   *   ["dev", "Development"],
   *   ["test", "Testing"],
   *   ["stage", "Staging"],
   *   ["prod", "Production"]
   * ]
   * 
   * // Criticality levels
   * extra_choices: [
   *   ["critical", "Business Critical"],
   *   ["important", "Important"],
   *   ["standard", "Standard"],
   *   ["low", "Low Impact"]
   * ]
   * 
   * // Network types
   * extra_choices: [
   *   ["dmz", "DMZ Network"],
   *   ["internal", "Internal Network"],
   *   ["guest", "Guest Network"],
   *   ["mgmt", "Management Network"]
   * ]
   * ```
   */
  extra_choices: [[string, string]];

  /**
   * Whether to automatically sort choices alphabetically by their labels.
   * When true, choices are displayed in alphabetical order regardless of definition order.
   * When false, choices maintain their definition order (useful for priority-based lists).
   * 
   * @default false
   * 
   * @example
   * ```typescript
   * // Alphabetical sorting for easy lookup
   * order_alphabetically: true
   * 
   * // Maintain priority order
   * order_alphabetically: false  // Keep: Critical, High, Medium, Low
   * 
   * // Maintain logical grouping
   * order_alphabetically: false  // Keep: Internal, DMZ, External
   * ```
   */
  order_alphabetically?: boolean;

  /**
   * Total number of choices available in this choice set (read-only).
   * Automatically calculated as the sum of base_choices and extra_choices.
   * Used for display and validation purposes.
   * 
   * @readonly
   * 
   * @example
   * ```typescript
   * // If base_choices exists (1) + extra_choices length (4)
   * choices_count: 5
   * 
   * // If only extra_choices (3 items)
   * choices_count: 3
   * ```
   */
  readonly choices_count?: number;
}
