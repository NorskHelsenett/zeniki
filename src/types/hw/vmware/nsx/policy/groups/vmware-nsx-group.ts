import {
  VmwareGroupTypes,
  VmwareRealizationState,
  VmwareRealizationStates,
  VMwareResourceTypes,
} from "../../shared/vmware-nsx-common";
import { VMWareExpression } from "../../shared/vmware-nsx-expression";
import { VMwareNSXPolicyConfigResource } from "../../shared/vmware-nsx-policy-config-resource";
import { VMwareNSXTag } from "../../shared/vmware-nsx-tag";

/**
 * VMware NSX group for policy-based security management.
 * Provides grouping with expression-based membership, identity context, and references.
 *
 * @example
 * ```typescript
 * const group: VMwareNSXGroup = {
 *   display_name: 'web-servers',
 *   description: 'Production web servers',
 *   resource_type: 'Group',
 *   group_type: ['VM'],
 *   expression: [{ resource_type: 'Condition' }],
 *   tags: [{ scope: 'environment', tag: 'production' }]
 * };
 * ```
 */
export interface VMwareNSXGroup extends Partial<VMwareNSXPolicyConfigResource> {
  /** Expression list defining group membership criteria. */
  expression?: VMWareExpression[];

  /**
   * Extended expression for higher-level context.
   * @maxItems 1
   */
  extended_expression?: VMWareExpression[];

  /** Resource type identifier. */
  resource_type?: VMwareResourceTypes;

  /**
   * Group type for entity membership constraints.
   * @maxItems 1
   */
  group_type?: VmwareGroupTypes[];

  /**
   * Indicates if group is a remote reference.
   * @readonly
   */
  readonly reference?: boolean;

  /**
   * Current realization state.
   * @readonly
   */
  readonly state?: VmwareRealizationStates | VmwareRealizationState;

  /**
   * Tag collection for metadata and filtering.
   * @maxItems 30
   */
  tags?: VMwareNSXTag[] | [];
}
