import {
  VMwareExpressionConjunctionOperatorTypes,
  VMwareExpressionKeyTypes,
  VMwareExpressionMemberTypes,
  VMwareExpressionOperatorTypes,
  VMwareExpressionResourceTypes,
  VMwareExpressionScopeOperatorTypes,
  VMwareExternalIDExpressionTypes,
  VMwareNSXScopeTypes,
} from "./vmware-nsx-common";
import { VMwareNSXIdentityGroupInfo } from "./vmware-nsx-identity-group-info";
import { VMwareNSXPolicyConfigResource } from "./vmware-nsx-policy-config-resource";
import { VMwareNSXTag } from "./vmware-nsx-tag";

/**
 * VMware NSX expression for group membership and policy criteria.
 * Provides expression-based matching with tag filtering for security groups and policies.
 *
 * @example
 * ```typescript
 * const expression: VMwareExpression = {
 *   display_name: 'web-tier-condition',
 *   resource_type: 'Condition',
 *   key: 'Tag',
 *   operator: 'EQUALS',
 *   value: 'web',
 *   tags: [{ scope: 'tier', tag: 'web' }]
 * };
 * ```
 */
export interface VMwareExpression
  extends Partial<VMwareNSXPolicyConfigResource> {
  /** Expression resource type defining matching behavior. */
  resource_type?: VMwareExpressionResourceTypes;

  /**
   * Value for condition expression matching.
   * @maxLength 1024
   */
  value?: string;

  /** Key type for condition expression evaluation. */
  key?: VMwareExpressionKeyTypes;

  /** Member type for expressions. */
  member_type?: VMwareExpressionMemberTypes | VMwareExternalIDExpressionTypes;

  /** Operator for condition expression logic. */
  operator?: VMwareExpressionOperatorTypes;

  /** Scope operator for condition evaluation. */
  scope_operator?: VMwareExpressionScopeOperatorTypes;

  /** Conjunction operator for logic combination. */
  conjunction_operator?: VMwareExpressionConjunctionOperatorTypes;

  /**
   * IP address collection for matching (use when resource_type is "IPAddressExpression").
   * @minItems 1
   * @maxItems 2000
   */
  ip_addresses?: string[];

  /**
   * MAC address collection for matching (use when resource_type is "MACAddressExpression").
   * @minItems 1
   * @maxItems 4000
   */
  mac_addresses?: string[];

  /**
   * External ID collection for matching (use when resource_type is "ExternalIDExpression").
   * @minItems 1
   */
  external_ids?: string[];

  /** Group scope path for matching (use when resource_type is "GroupScopeExpression"). */
  scope_path?: string;

  /** Group scope type for matching (use when resource_type is "GroupScopeExpression"). */
  scope_type?: VMwareNSXScopeTypes;

  /**
   * Identity group collection for matching (use when resource type is "IdentityGroupExpression")
   * @minItems 1
   */
  identity_groups?: Partial<VMwareNSXIdentityGroupInfo>[];

  /**
   * Expression collection for matching (use when resource type is "NestedExpression")
   * @minItems 1
   */
  expressions?: VMwareExpression[];

  /**
   * Paths collection for matching (use when resource type is "PathExpression")
   * @minItems 1
   */
  paths?: string[];

  /**
   * Tag collection for matching and filtering.
   * @maxItems 30
   */
  tags?: VMwareNSXTag[];
}
