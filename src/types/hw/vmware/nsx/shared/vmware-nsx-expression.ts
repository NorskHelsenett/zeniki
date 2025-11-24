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
 * VMware NSX expression interface for defining group membership and policy criteria.
 * Extends VMwareNSXPartial to provide expression-based matching capabilities with
 * tag-based filtering for security groups, firewall rules, and policy objects.
 *
 * @interface VMWareExpression
 * @since NSX 3.0+
 * @context VMware NSX policy expressions and group membership criteria
 *
 * @example
 * ```typescript
 * const expression: VMWareExpression = {
 *   display_name: 'web-tier-condition',
 *   description: 'Web tier VM matching expression',
 *   resource_type: 'Condition',
 *   tags: [{ scope: 'tier', tag: 'web' }]
 * };
 * ```
 */
export interface VMWareExpression extends VMwareNSXPartial {
  /**
   * Expression resource type defining the matching criteria behavior
   * @optional
   * @see VmwareExpressionResourceTypes
   */
  resource_type?: VmwareExpressionResourceTypes;
  
  /**
   * Value for condition expression matching
   * @optional
   * @requires resource_type = "Condition"
   * @maxLength 1024
   */
  value?: string;

  /**
   * Key type for condition expression evaluation
   * @optional
   * @requires resource_type = "Condition"
   * @see VmwareExpressionKeyTypes
   */
  key?: VmwareExpressionKeyTypes;

  /**
   * Member type for condition and external ID expressions
   * @optional
   * @see VmwareExpressionMemberTypes
   * @see VmwareExternalIDExpressionTypes
   */
  member_type?: VmwareExpressionMemberTypes | VmwareExternalIDExpressionTypes;

  /**
   * Operator for condition expression logic
   * @optional
   * @requires resource_type = "Condition"
   * @see VmwareExpressionOperatorTypes
   */
  operator?: VmwareExpressionOperatorTypes;

  /**
   * Scope operator for condition expression evaluation
   * @optional
   * @requires resource_type = "Condition"
   * @see VmwareExpressionScopeOperatorTypes
   */
  scope_operator?: VmwareExpressionScopeOperatorTypes;

  /**
   * Conjunction operator for expression logic combination
   * @optional
   * @requires resource_type = "ConjunctionOperator"
   * @see VmwareExpressionConjunctionOperatorTypes
   */
  conjunction_operator?: VmwareExpressionConjunctionOperatorTypes;

  /**
   * IP address collection for IP-based expression matching
   * @optional
   * @requires resource_type = "IPAddressExpression"
   * @minItems 1
   * @maxItems 2000
   */
  ip_addresses?: string[];

  /**
   * Tag collection for expression-based matching and filtering
   * @optional
   * @maxItems 30
   * @see VMWareNSXTag
   */
  tags?: VMWareNSXTag[];
}
