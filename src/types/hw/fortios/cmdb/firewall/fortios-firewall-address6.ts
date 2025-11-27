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
 * FortiOS IPv6 firewall address object for network security policies.
 * Supports prefix, range, FQDN, geography, template, dynamic cloud, route tag,
 * and MAC types with Security Fabric, SDN, and multi-tenant integration.
 *
 * @example
 * ```typescript
 * const address: FortiOSFirewallAddress6 = {
 *   name: 'ipv6-internal-network',
 *   type: 'ipprefix',
 *   ip6: '2001:db8:1000::/48',
 *   comment: 'IPv6 internal network',
 *   'route-tag': 1000,
 *   'cache-ttl': 3600,
 *   tenant: 'production',
 *   'sdn-tag': 'env-prod',
 *   color: 3,
 *   'fabric-object': 'enable'
 * };
 * ```
 */
export interface FortiOSFirewallAddress6 extends FortiOSFirewallAddrMeta {
  /**
   * Unique address object name.
   * @maxLength 79
   */
  name: string;

  /**
   * UUID for Security Fabric tracking.
   * @readonly
   */
  uuid?: string;

  /** Address type defining interpretation. */
  type: FortiOSFirewallAddress6Types | FortiOSFirewallAddress6Type;

  /**
   * Route tag for routing policy.
   * @minimum 1
   * @maximum 4294967295
   */
  "route-tag"?: number;

  /**
   * MAC address collection for Layer 2.
   * @maxLength 127
   */
  macaddr?: {
    /**
     * MAC address or range specification.
     * @maxLength 127
     */
    macaddr: string;
  }[];

  /**
   * IPv6 address prefix in CIDR notation.
   * @maxLength 43
   */
  ip6?: string;

  /** Start IPv6 address for range type. */
  "start-ip"?: string;

  /** End IPv6 address for range type. */
  "end-ip"?: string;

  /**
   * FQDN for DNS resolution.
   * @maxLength 255
   */
  fqdn?: string;

  /**
   * ISO country code for geography.
   * @maxLength 2
   */
  country?: string;

  /**
   * DNS cache TTL in seconds.
   * @minimum 0
   * @maximum 86400
   */
  "cache-ttl"?: number;

  /**
   * SDN connector name.
   * @maxLength 35
   */
  sdn?: string;

  /**
   * Cloud tenant identifier.
   * @maxLength 35
   */
  tenant?: string;

  /**
   * ACI Endpoint Group name.
   * @maxLength 255
   */
  "epg-name"?: string;

  /**
   * SDN tag identifier.
   * @maxLength 15
   */
  "sdn-tag"?: string;

  /**
   * Administrative comment.
   * @maxLength 255
   */
  comment?: string;

  /**
   * IPv6 address template name.
   * @maxLength 63
   */
  template?: string;

  /** IPv6 subnet segment definitions. */
  "subnet-segment"?: {
    /**
     * Segment name identifier.
     * @maxLength 63
     */
    name?: string;
    /** Segment type definition. */
    type?: FortiOSFirewallAddress6HostTypes | FortiOSFirewallAddress6HostType;
    /**
     * Segment value specification.
     * @maxLength 35
     */
    value?: string;
  }[];

  /** IPv6 host address type specification. */
  "host-type"?:
    | FortiOSFirewallAddress6HostTypes
    | FortiOSFirewallAddress6HostType;

  /**
   * Specific IPv6 host address.
   * @maxLength 39
   */
  host?: string;

  /**
   * GUI color code (0-32).
   * @minimum 0
   * @maximum 32
   */
  color?: number;

  /**
   * Advanced filter expression.
   * @maxLength 2047
   */
  filter?: string;

  /** Address collection scope. */
  "sdn-addr-type"?:
    | FortiOSFirewallAddressCollectionTypes
    | FortiOSFirewallAddressCollectionType;

  /**
   * VMware NSX object ID.
   * @maxLength 255
   */
  "obj-id"?: string;

  /** Explicit IP address list. */
  list?: {
    /**
     * Individual IP address entry.
     * @maxLength 35
     */
    ip: string;
  }[];

  /** Administrative tagging system. */
  tagging?: {
    /**
     * Tagging entry name.
     * @maxLength 63
     */
    name: string;

    /**
     * Tag category.
     * @maxLength 63
     */
    category: string;

    /** Collection of tags. */
    tags: {
      /**
       * Tag name.
       * @maxLength 79
       */
      name: string;
    }[];
  }[];

  /** Security Fabric object sync. */
  "fabric-object"?: CommonEnableDisables | CommonEnableDisable;
}

// IPv6 firewall address type enumeration
export enum FortiOSFirewallAddress6Type {
  IP_Prefix = "ipprefix",
  IP_Range = "iprange",
  FQDN = "fqdn",
  Geography = "geography",
  Template = "template",
  Dynamic = "dynamic",
  Route_tag = "route-tag",
  MAC = "mac",
}

// String literal union for IPv6 address types
export type FortiOSFirewallAddress6Types =
  | "ipprefix"
  | "iprange"
  | "fqdn"
  | "geography"
  | "dynamic"
  | "template"
  | "mac"
  | "route-tag";

// IPv6 host type enumeration for templates
export enum FortiOSFirewallAddress6HostType {
  Wildcard = "any",
  Specific = "specific",
}

// String literal union for IPv6 host types
export type FortiOSFirewallAddress6HostTypes = "any" | "specific";
