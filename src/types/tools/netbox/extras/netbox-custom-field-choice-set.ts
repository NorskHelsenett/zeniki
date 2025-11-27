import { NetboxPartial } from "../shared/netbox-partial";
import { NetboxValueLabel } from "../shared/netbox-value-label";

/**
 * NetBox custom field choice set.
 * Defines selection options for dropdown and multi-select custom fields
 * with base and extra choices.
 * 
 * @example
 * ```typescript
 * const choiceSet: NetboxCustomFieldChoiceSet = {
 *   name: "Environment Types",
 *   base_choices: { value: "dev", label: "Development" },
 *   extra_choices: [["prod", "Production"], ["test", "Testing"]],
 *   order_alphabetically: true
 * };
 * ```
 */
export interface NetboxCustomFieldChoiceSet extends NetboxPartial {
  /**
   * Choice set name.
   * @maxLength 100
   */
  name: string;

  /** Base choice as default option. */
  base_choices?: NetboxValueLabel<string, string>;

  /** Additional choice options as [value, label] tuples. */
  extra_choices: [[string, string]];

  /**
   * Sort choices alphabetically.
   * @default false
   */
  order_alphabetically?: boolean;

  /**
   * Total choice count.
   * @readonly
   */
  readonly choices_count?: number;
}
