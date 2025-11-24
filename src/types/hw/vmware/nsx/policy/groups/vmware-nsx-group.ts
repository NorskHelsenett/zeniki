import {
  VmwareGroupTypes,
  VmwareRealizationState,
  VmwareRealizationStates,
  VmwareResourceTypes,
} from "../../shared/vmware-nsx-common";
import { VMWareExpression } from "../../shared/vmware-nsx-expression";
import { VMwareNSXPartial } from "../../shared/vmware-nsx-partial";
import { VMWareNSXTag } from "../../shared/vmware-nsx-tag";

/**
 * VMware NSX group interface for policy-based security group management.
 * Extends VMwareNSXPartial to provide grouping capabilities with expression-based
 * membership criteria, extended identity context, and reference group support.
 * 
 * @interface VMwareNSXGroup
 * @since NSX 3.0+
 * @context VMware NSX policy security groups and firewall rules
 * 
 * @example
 * ```typescript
 * const group: VMwareNSXGroup = {
 *   display_name: 'web-servers',
 *   description: 'Production web server group',
 *   resource_type: 'Group',
 *   group_type: ['VM'],
 *   expression: [{ resource_type: 'Condition' }],
 *   tags: [{ scope: 'environment', tag: 'production' }]
 * };
 * ```
 */
export interface VMwareNSXGroup extends VMwareNSXPartial {
  /**
   * Expression list defining group membership criteria with validation rules
   * @optional
   * @see VMWareExpression
   */
  expression?: VMWareExpression[];

  /**
   * Extended expression for higher-level context (user AD groups for IDFW)
   * @optional
   * @maxItems 1
   * @see VMWareExpression
   */
  extended_expression?: VMWareExpression[];

  /**
   * Resource type identifier for this group object
   * @optional
   * @see VmwareResourceTypes
   */
  resource_type?: VmwareResourceTypes;

  /**
   * Group type specification for entity membership constraints
   * @optional
   * @maxItems 1
   * @see VmwareGroupTypes
   */
  group_type?: VmwareGroupTypes[];

  /**
   * Indicates if group is a remote reference with different span
   * @optional
   * @readonly
   * @default false
   */
  readonly reference?: boolean;

  /**
   * Current realization state of the group object
   * @optional
   * @readonly
   * @see VmwareRealizationStates
   */
  readonly state?: VmwareRealizationStates | VmwareRealizationState;

  /**
   * Tag collection for group metadata and filtering
   * @optional
   * @maxItems 30
   * @see VMWareNSXTag
   */
  tags?: VMWareNSXTag[] | [];
}
