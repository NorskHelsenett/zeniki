import {
  CommonEnableDisable,
  CommonEnableDisables,
} from "../../../../common/common-types";

/**
 * FortiOS IPv6 firewall address group configuration for enterprise network security.
 *
 * Supports up to 600 IPv6 address objects per group with hardware-accelerated evaluation,
 * exclusion logic for complex policies, Security Fabric global distribution, dual-stack
 * environments, cloud-native IPv6 deployments, and enterprise-grade IPv6 management.
 *
 * @example
 * ```typescript
 * const ipv6Group: FortiOSFirewallAddrGrp6 = {
 *   name: 'ipv6-internal-servers',
 *   member: [{ name: 'ipv6-web-server' }, { name: 'ipv6-app-server' }],
 *   comment: 'IPv6 internal server infrastructure',
 *   color: 3,
 *   exclude: CommonEnableDisable.Enable,
 *   'exclude-member': [{ name: 'ipv6-dmz-subnet' }],
 *   'fabric-object': CommonEnableDisable.Enable,
 *   tagging: [{ name: 'Production', category: 'Environment', tags: [{ name: 'Critical' }] }],
 *   uuid: '550e8400-e29b-41d4-a716-446655440000'
 * };
 * ```
 */
export interface FortiOSFirewallAddrGrp6 {
  /**
   * Unique name identifier for the IPv6 address group.
   * @maxLength 79
   * @required
   */
  name: string;

  /**
   * UUID for object tracking and Security Fabric synchronization.
   * @readonly
   * @optional
   */
  readonly uuid?: string;

  /**
   * IPv6 address objects contained within the group (up to 600 members).
   * @maxItems 600
   * @required
   */
  member:  {
      /**
       * IPv6 address object name reference.
       * @maxLength 79
       * @required
       */
      name: string;
    }[];

  /**
   * Administrative comment for IPv6 address group documentation and management.
   * @maxLength 255
   * @optional
   */
  comment?: string;

  /**
   * Enable exclusion logic for advanced IPv6 address group filtering.
   * @values "enable" | "disable"
   * @optional
   */
  exclude?: CommonEnableDisables | CommonEnableDisable;

  /**
   * IPv6 address exclusion members for advanced filtering and security policy control.
   * @requires exclude must be enabled
   * @optional
   */
  "exclude-member"?: {
    /**
     * IPv6 address object name for exclusion.
     * @maxLength 79
     * @optional
     */
    name?: string;
  }[];

  /**
   * GUI color identifier for visual IPv6 address group management and organization.
   * @minimum 0
   * @maximum 32
   * @optional
   */
  color?: number;

  /**
   * Enhanced tagging system for IPv6 address group organization and automation.
   * @optional
   */
  tagging?: {
    /**
     * Descriptive name for the tagging entry grouping.
     * @maxLength 63
     * @optional
     */
    name?: string;

    /**
     * Tag category for organizational hierarchy and filtering.
     * @maxLength 63
     * @optional
     */
    category?: string;

    /**
     * Collection of individual tags within the category.
     * @required
     */
    tags: {
      /**
       * Individual tag name providing specific classification detail.
       * @maxLength 79
       * @optional
       */
      name?: string;
    }[];
  }[];

  /**
   * Security Fabric global object distribution control for IPv6 address group synchronization.
   * @values "enable" | "disable"
   * @optional
   */
  "fabric-object"?: CommonEnableDisables | CommonEnableDisable;
}
