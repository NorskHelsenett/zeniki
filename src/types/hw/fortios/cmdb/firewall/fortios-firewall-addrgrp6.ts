import {
  CommonEnableDisable,
  CommonEnableDisables,
} from "../../../../common/common-types";
import { FortiOSFirewallAddrMeta } from "../../shared/fortios-firewall-addr-meta";

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
export interface FortiOSFirewallAddrGrp6 extends FortiOSFirewallAddrMeta {
  /**
   * Unique address group name.
   * @maxLength 79
   */
  name: string;

  /**
   * UUID for Security Fabric tracking.
   * @readonly
   */
  readonly uuid?: string;

  /**
   * Address objects in group (up to 600 members).
   * @maxItems 600
   */
  member: {
    /**
     * Address object name reference.
     * @maxLength 79
     */
    name: string;
  }[];

  /**
   * Administrative comment.
   * @maxLength 255
   */
  comment?: string;

  /** Enable exclusion logic. */
  exclude?: CommonEnableDisables | CommonEnableDisable;

  /** Address exclusion members. */
  "exclude-member"?: {
    /**
     * Address object name for exclusion.
     * @maxLength 79
     */
    name?: string;
  }[];

  /**
   * GUI color code (0-32).
   * @minimum 0
   * @maximum 32
   */
  color?: number;

  /** Administrative tagging system. */
  tagging?: {
    /**
     * Tagging entry name.
     * @maxLength 63
     */
    name?: string;

    /**
     * Tag category.
     * @maxLength 63
     */
    category?: string;

    /** Collection of tags. */
    tags: {
      /**
       * Tag name.
       * @maxLength 79
       */
      name?: string;
    }[];
  }[];

  /** Security Fabric object sync. */
  "fabric-object"?: CommonEnableDisables | CommonEnableDisable;
}
