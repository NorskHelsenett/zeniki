import {
  VmwareExpressionConjunctionOperatorTypes,
  VmwareExpressionKeyTypes,
  VmwareExpressionMemberTypes,
  VmwareExpressionOperatorTypes,
  VmwareExpressionResourceTypes,
  VmwareExpressionScopeOperatorTypes,
  VmwareExternalIDExpressionTypes,
} from "./vmware-nsx-common";
import { VMwareNSXPartial } from "./vmware-nsx-partial";
import { VMWareNSXTag } from "./vmware-nsx-tag";

/**
 * VMware NSX expression for group membership and policy criteria.
 * Provides expression-based matching with tag filtering for security groups and policies.
 *
 * @example
 * ```typescript
 * const expression: VMWareExpression = {
 *   display_name: 'web-tier-condition',
 *   resource_type: 'Condition',
 *   key: 'Tag',
 *   operator: 'EQUALS',
 *   value: 'web',
 *   tags: [{ scope: 'tier', tag: 'web' }]
 * };
 * ```
 */
export interface VMWareExpression extends VMwareNSXPartial {
  /** Expression resource type defining matching behavior. */
  resource_type?: VmwareExpressionResourceTypes;
  
  /**
   * Value for condition expression matching.
   * @maxLength 1024
   */
  value?: string;

  /** Key type for condition expression evaluation. */
  key?: VmwareExpressionKeyTypes;

  /** Member type for expressions. */
  member_type?: VmwareExpressionMemberTypes | VmwareExternalIDExpressionTypes;

  /** Operator for condition expression logic. */
  operator?: VmwareExpressionOperatorTypes;

  /** Scope operator for condition evaluation. */
  scope_operator?: VmwareExpressionScopeOperatorTypes;

  /** Conjunction operator for logic combination. */
  conjunction_operator?: VmwareExpressionConjunctionOperatorTypes;

  /**
   * IP address collection for matching.
   * @minItems 1
   * @maxItems 2000
   */
  ip_addresses?: string[];

  /**
   * Tag collection for matching and filtering.
   * @maxItems 30
   */
  tags?: VMWareNSXTag[];
}
