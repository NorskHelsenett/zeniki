import { UUID } from "node:crypto";
import {
  CommonEnableDisable,
  CommonEnableDisables,
} from "../../../../common/common-types";
import { FortiOSFirewallAddrMeta } from "../../shared/fortios-firewall-addr-meta";

/**
 * FortiOS IPv4 firewall address object for network security policies.
 * Supports ipmask, iprange, FQDN, geography, wildcard, dynamic cloud, interface subnet,
 * and MAC types with Security Fabric, SDN, and multi-cloud integration.
 *
 * @example
 * ```typescript
 * const address: FortiOSFirewallAddress = {
 *   name: 'web-servers',
 *   type: 'ipmask',
 *   subnet: '192.168.100.0 255.255.255.0',
 *   comment: 'Web server subnet',
 *   'allow-routing': 'enable',
 *   'associated-interface': 'internal',
 *   tagging: [{ name: 'Production', category: 'Environment', tags: [{ name: 'Critical' }] }]
 * };
 * ```
 */
export interface FortiOSFirewallAddress extends FortiOSFirewallAddrMeta {
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

  /** Primary IPv4 address specification. */
  subnet: string;

  /** Address type defining interpretation. */
  type: FortiOSFirewallAddressTypes | FortiOSFirewallAddressType;

  /** Sub-type for advanced integration. */
  "sub-type"?: FortiOSFirewallAddressSubTypes | FortiOSFirewallAddressSubType;

  /**
   * Route tag for routing policy.
   * @minimum 1
   * @maximum 4294967295
   */
  "route-tag"?: number;

  /** ClearPass SPT compliance value. */
  "clearpass-spt"?:
    | FortiOSFirewallAddressClearpassSPTs
    | FortiOSFirewallAddressClearpassSPT;

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

  /** Start IP for range type. */
  "start-ip"?: string;

  /** End IP for range type. */
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
   * Wildcard FQDN pattern.
   * @maxLength 255
   */
  "wildcard-fqdn"?: string;

  /**
   * DNS cache TTL in seconds.
   * @minimum 0
   * @maximum 86400
   */
  "cache-ttl"?: number;

  /** Wildcard subnet mask. */
  wildcard?: string;

  /**
   * SDN connector name.
   * @maxLength 35
   */
  sdn?: string;

  /** FSSO group mappings. */
  "fsso-group"?: {
    /**
     * FSSO group name.
     * @maxLength 511
     */
    name: string;
  }[];

  /**
   * Interface for subnet addressing.
   * @maxLength 35
   */
  interface?: string;

  /**
   * Cloud tenant identifier.
   * @maxLength 35
   */
  tenant?: string;

  /**
   * Cloud organization identifier.
   * @maxLength 35
   */
  organization?: string;

  /**
   * ACI Endpoint Group name.
   * @maxLength 255
   */
  "epg-name"?: string;

  /**
   * Cloud subnet name.
   * @maxLength 255
   */
  "subnet-name"?: string;

  /**
   * SDN tag identifier.
   * @maxLength 15
   */
  "sdn-tag"?: string;

  /**
   * Policy group identifier.
   * @maxLength 15
   */
  "policy-group"?: string;

  /**
   * Dynamic object tag.
   * @maxLength 255
   */
  "obj-tag"?: string;

  /** Object type for dynamic classification. */
  "obj-type"?:
    | FortiOSFirewallAddressObjectTypes
    | FortiOSFirewallAddressObjectType;

  /**
   * Tag detection sensitivity.
   * @maxLength 15
   */
  "tag-detection-level"?: string;

  /**
   * Tag type specification.
   * @maxLength 63
   */
  "tag-type"?: string;

  /**
   * Hardware vendor identifier.
   * @maxLength 35
   */
  "hw-vendor"?: string;

  /**
   * Hardware model identifier.
   * @maxLength 35
   */
  "hw-model"?: string;

  /**
   * Operating system identifier.
   * @maxLength 35
   */
  os?: string;

  /**
   * Software version identifier.
   * @maxLength 35
   */
  "sw-version"?: string;

  /**
   * Administrative comment.
   * @maxLength 255
   */
  comment?: string;

  /**
   * Associated interface for optimization.
   * @maxLength 35
   */
  "associated-interface"?: string;

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

  /** Kubernetes node restriction. */
  "node-ip-only"?: CommonEnableDisables | CommonEnableDisable;

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

  /** Static routing integration. */
  "allow-routing"?: CommonEnableDisables | CommonEnableDisable;

  /** Security Fabric object sync. */
  "fabric-object"?: CommonEnableDisables | CommonEnableDisable;
}

// IPv4 firewall address type enumeration
export enum FortiOSFirewallAddressType {
  IP_Mask = "ipmask",
  IP_Range = "iprange",
  FQDN = "fqdn",
  Geography = "geography",
  Wildcard = "wildcard",
  Dynamic = "dynamic",
  Interface_Subnet = "interface-subnet",
  MAC = "mac",
}

// String literal union for address types
export type FortiOSFirewallAddressTypes =
  | "ipmask"
  | "iprange"
  | "fqdn"
  | "geography"
  | "wildcard"
  | "dynamic"
  | "interface-subnet"
  | "mac";

// Address sub-type enumeration for advanced integration
export enum FortiOSFirewallAddressSubType {
  SDN = "sdn",
  ClearPass_SPT = "clearpass-spt",
  FSSO = "fsso",
  EMS_Tag = "ems-tag",
  FortiVoice_Tag = "fortivoice-tag",
  FortiNAC_Tag = "fortinac-tag",
  SWC_Tag = "swc-tag",
}

// String literal union for address sub-types
export type FortiOSFirewallAddressSubTypes =
  | "sdn"
  | "clearpass-spt"
  | "fsso"
  | "ems-tag"
  | "fortivoice-tag"
  | "fortinac-tag"
  | "swc-tag";

// ClearPass SPT compliance value enumeration
export enum FortiOSFirewallAddressClearpassSPT {
  Unknown = "unknown",
  Healthy = "healthy",
  Quarantine = "quarantine",
  Checkup = "checkup",
  Transient = "transient",
  Infected = "infected",
}

// String literal union for ClearPass SPT values
export type FortiOSFirewallAddressClearpassSPTs =
  | "unknown"
  | "healthy"
  | "quarantine"
  | "checkup"
  | "transient"
  | "infected";

// Dynamic address object type enumeration
export enum FortiOSFirewallAddressObjectType {
  IP = "ip",
  MAC = "mac",
}

// String literal union for object types
export type FortiOSFirewallAddressObjectTypes = "ip" | "mac";

// Address collection scope enumeration
export enum FortiOSFirewallAddressCollectionType {
  Private = "private",
  Public = "public",
  All = "all",
}

// String literal union for collection types
export type FortiOSFirewallAddressCollectionTypes =
  | "private"
  | "public"
  | "all";
