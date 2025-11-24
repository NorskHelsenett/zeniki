import {
  CommonEnableDisable,
  CommonEnableDisables,
} from "../../../../common/common-types";
import { FortiOSFirewallAddrMeta } from "../../shared/fortios-firewall-addr-meta";
import {
  FortiOSFirewallAddressCollectionType,
  FortiOSFirewallAddressCollectionTypes,
} from "./fortios-firewall-address";

/**
 * FortiOS IPv6 firewall address object configuration for enterprise network security.
 *
 * Supports IPv6 prefix, range, FQDN, geographic, template, dynamic cloud, route tag,
 * and MAC address types with comprehensive Security Fabric integration, SDN connectivity,
 * NDP security, extension header inspection, and multi-tenant cloud environments.
 *
 * @example
 * ```typescript
 * const address: FortiOSFirewallAddress6 = {
 *   name: 'ipv6-internal-network',
 *   type: FortiOSFirewallAddress6Type.IP_Prefix,
 *   ip6: '2001:db8:1000::/48',
 *   comment: 'IPv6 internal network prefix',
 *   color: 3,
 *   'route-tag': 1000,
 *   'cache-ttl': 3600,
 *   uuid: '550e8400-e29b-41d4-a716-446655440000',
 *   'host-type': FortiOSFirewallAddress6HostType.Wildcard,
 *   template: 'site-template',
 *   tenant: 'production',
 *   'sdn-tag': 'env-prod'
 * };
 * ```
 */
export interface FortiOSFirewallAddress6 extends FortiOSFirewallAddrMeta {
  /**
   * Unique name identifier for the IPv6 address object within the FortiGate configuration.
   * @maxLength 79
   * @required
   */
  name: string;

  /**
   * UUID for object tracking and Security Fabric synchronization.
   * @readonly
   * @optional
   */
  uuid?: string;

  /**
   * IPv6 address type defining how the address object is interpreted and used.
   * @required
   * @see FortiOSFirewallAddress6Type
   */
  type: FortiOSFirewallAddress6Types | FortiOSFirewallAddress6Type;

  /**
   * IPv6 route tag identifier for advanced routing and policy integration.
   * @minimum 1
   * @maximum 4294967295
   * @requires type must be 'route-tag'
   * @optional
   */
  "route-tag"?: number;

  /**
   * Collection of MAC addresses and MAC address ranges for Layer 2 identification.
   * @requires type must be 'mac'
   * @maxLength 127
   * @optional
   */
  macaddr?: {
    /**
     * MAC address or range specification supporting individual and range formats.
     * @maxLength 127
     */
    macaddr: string;
  }[];

  /**
   * IPv6 address prefix specification in CIDR notation.
   * @maxLength 43
   * @requires type must be 'ipprefix'
   * @optional
   */
  ip6?: string;

  /**
   * Starting IPv6 address for range types.
   * @requires type must be 'iprange'
   * @see end-ip
   * @optional
   */
  "start-ip"?: string;

  /**
   * Ending IPv6 address for range types.
   * @requires type must be 'iprange'
   * @see start-ip
   * @optional
   */
  "end-ip"?: string;

  /**
   * Fully Qualified Domain Name for IPv6-aware DNS resolution.
   * @maxLength 255
   * @requires type must be 'fqdn'
   * @see cache-ttl
   * @optional
   */
  fqdn?: string;

  /**
   * ISO 3166-1 alpha-2 country code for geographic IPv6 address filtering.
   * @maxLength 2
   * @requires type must be 'geography'
   * @optional
   */
  country?: string;

  /**
   * DNS cache TTL for FQDN resolution in seconds.
   * @minimum 0
   * @maximum 86400
   * @requires type must be 'fqdn'
   * @optional
   */
  "cache-ttl"?: number;

  /**
   * SDN connector name for dynamic IPv6 cloud integration.
   * @maxLength 35
   * @requires type must be 'dynamic'
   * @see filter
   * @see sdn-addr-type
   * @optional
   */
  sdn?: string;

  /**
   * Multi-tenant identifier for cloud SDN environments.
   * @maxLength 35
   * @optional
   */
  tenant?: string;

  /**
   * Endpoint Group name for Cisco ACI integration.
   * @maxLength 255
   * @optional
   */
  "epg-name"?: string;

  /**
   * SDN-specific tag identifier for object filtering and selection.
   * @maxLength 15
   * @optional
   */
  "sdn-tag"?: string;

  /**
   * Administrative comment for documentation and management purposes.
   * @maxLength 255
   * @optional
   */
  comment?: string;

  /**
   * IPv6 address template name for dynamic IPv6 address generation.
   * @maxLength 63
   * @requires type must be 'template'
   * @see subnet-segment
   * @optional
   */
  template?: string;

  /**
   * IPv6 subnet segment definitions for template-based address generation.
   * @see template
   * @see FortiOSFirewallAddress6HostType
   * @optional
   */
  "subnet-segment"?: {
    /**
     * Segment name identifier.
     * @maxLength 63
     * @optional
     */
    name?: string;
    /**
     * Segment type definition.
     * @see FortiOSFirewallAddress6HostType
     * @optional
     */
    type?: FortiOSFirewallAddress6HostTypes | FortiOSFirewallAddress6HostType;
    /**
     * Segment value specification.
     * @maxLength 35
     * @optional
     */
    value?: string;
  }[];

  /**
   * IPv6 host address type specification for template-based addressing.
   * @see FortiOSFirewallAddress6HostType
   * @see host
   * @optional
   */
  "host-type"?:
    | FortiOSFirewallAddress6HostTypes
    | FortiOSFirewallAddress6HostType;

  /**
   * Specific IPv6 host address for targeted addressing scenarios.
   * @requires host-type should be 'specific'
   * @maxLength 39
   * @optional
   */
  host?: string;

  /**
   * GUI color code for visual identification and categorization in management interfaces.
   * @minimum 0
   * @maximum 32
   * @optional
   */
  color?: number;

  /**
   * Advanced filter expression for dynamic address object selection and matching.
   * @maxLength 2047
   * @optional
   */
  filter?: string;

  /**
   * Address collection scope for cloud and SDN dynamic address resolution.
   * @see FortiOSFirewallAddressCollectionType
   * @optional
   */
  "sdn-addr-type"?:
    | FortiOSFirewallAddressCollectionTypes
    | FortiOSFirewallAddressCollectionType;

  /**
   * VMware NSX object identifier for precise SDN object targeting.
   * @maxLength 255
   * @optional
   */
  "obj-id"?: string;

  /**
   * Explicit IP address list for custom address object definitions.
   * @optional
   */
  list?: {
    /**
     * Individual IP address entry in the address list.
     * @maxLength 35
     */
    ip: string;
  }[];

  /**
   * Administrative tagging system for enhanced organization and policy management.
   * @optional
   */
  tagging?: {
    /**
     * Descriptive name for the tagging entry grouping.
     * @maxLength 63
     */
    name: string;

    /**
     * Tag category for organizational hierarchy and filtering.
     * @maxLength 63
     */
    category: string;

    /**
     * Collection of individual tags within the category.
     */
    tags: {
      /**
       * Individual tag name providing specific classification detail.
       * @maxLength 79
       */
      name: string;
    }[];
  }[];

  /**
   * Security Fabric global object distribution and synchronization control.
   * @values "enable" | "disable"
   * @optional
   */
  "fabric-object"?: CommonEnableDisables | CommonEnableDisable;
}

// Enumeration of supported FortiOS IPv6 firewall address types for comprehensive IPv6 network security
export enum FortiOSFirewallAddress6Type {
  // IPv6 prefix-based addressing with CIDR notation support
  IP_Prefix = "ipprefix",
  // IPv6 address range specification for contiguous address pools
  IP_Range = "iprange",
  // IPv6-aware FQDN resolution with DNS capabilities and threat intelligence
  FQDN = "fqdn",
  // IPv6 geographic filtering with comprehensive geolocation intelligence
  Geography = "geography",
  // IPv6 address template system for hierarchical addressing
  Template = "template",
  // IPv6 dynamic cloud integration with real-time SDN connectivity
  Dynamic = "dynamic",
  // IPv6 route tag identifier for advanced routing and policy integration
  Route_tag = "route-tag",
  // MAC address identification with IPv6 NDP correlation
  MAC = "mac",
}

// String literal type union for FortiOS IPv6 firewall address types
export type FortiOSFirewallAddress6Types =
  | "ipprefix"
  | "iprange"
  | "fqdn"
  | "geography"
  | "dynamic"
  | "template"
  | "mac"
  | "route-tag";

// IPv6 subnet segment and host type enumeration for template-based addressing
export enum FortiOSFirewallAddress6HostType {
  // Matches any IPv6 address within specified prefix for dynamic environments
  Wildcard = "any",
  // Targets specific IPv6 addresses or subnet segments for precise policy application
  Specific = "specific",
}

// String literal type union for IPv6 host types
export type FortiOSFirewallAddress6HostTypes = "any" | "specific";
