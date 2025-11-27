import {
  CommonEnableDisable,
  CommonEnableDisables,
} from "../../../../common/common-types";

/**
 * FortiOS IPv4 firewall address group configuration for enterprise network security.
 *
 * Supports up to 600 IPv4 address objects per group with hardware-accelerated evaluation,
 * exclusion logic for complex policies, Security Fabric global distribution, Zero Trust
 * Network Access integration with EMS and geographic tags, and enterprise-grade management.
 *
 * @example
 * ```typescript
 * const group: FortiOSFirewallAddrGrp = {
 *   name: 'enterprise-datacenter-services',
 *   type: FortiOSFirewallAddrGrpType.Default,
 *   member: [{ name: 'web-cluster' }, { name: 'db-cluster' }],
 *   comment: 'Enterprise datacenter services',
 *   exclude: CommonEnableDisable.Enable,
 *   'exclude-member': [{ name: 'dmz-servers' }],
 *   color: 3,
 *   'fabric-object': CommonEnableDisable.Enable,
 *   'allow-routing': CommonEnableDisable.Enable,
 *   category: FortiOSFirewallAddrGrpCategory.Default,
 *   tagging: [{ name: 'Production', category: 'Environment', tags: [{ name: 'Critical' }] }],
 *   uuid: '550e8400-e29b-41d4-a716-446655440000'
 * };
 * ```
 */
export interface FortiOSFirewallAddrGrp {
  /**
   * Unique address group name.
   * @maxLength 79
   */
  name: string;

  /** Address group type classification. */
  type?: FortiOSFirewallAddrGrpTypes | FortiOSFirewallAddrGrpType;

  /** Address group category for ZTNA integration. */
  category?: FortiOSFirewallAddrGrpCategories | FortiOSFirewallAddrGrpCategory;

  /**
   * UUID for Security Fabric tracking.
   * @readonly
   */
  readonly uuid?: string;

  /** Enable route advertisement for members. */
  "allow-routing"?: CommonEnableDisables | CommonEnableDisable;

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

// IPv4 address group type enumeration
export enum FortiOSFirewallAddrGrpType {
  Default = "default",
  Folder = "folder",
}

// String literal union for address group types
export type FortiOSFirewallAddrGrpTypes = "default" | "folder";

// IPv4 address group category enumeration for ZTNA
export enum FortiOSFirewallAddrGrpCategory {
  Default = "default",
  "Ztna-Ems-Tag" = "ztna-ems-tag",
  "Ztna-Geo-Tag" = "ztna-geo-tag",
}

// String literal union for address group categories
export type FortiOSFirewallAddrGrpCategories =
  | "default"
  | "ztna-ems-tag"
  | "ztna-geo-tag";
