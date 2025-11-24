import { UUID } from "node:crypto";
import {
  CommonEnableDisable,
  CommonEnableDisables,
} from "../../../../common/common-types";
import { FortiOSFirewallAddrMeta } from "../../shared/fortios-firewall-addr-meta";

/**
 * FortiOS IPv4 firewall address object configuration for enterprise network security.
 *
 * Supports IPv4 mask, range, FQDN, geographic, wildcard, dynamic cloud, interface subnet,
 * and MAC address types with comprehensive Security Fabric integration, Zero Trust Network
 * Access, SDN connectivity, AI-powered threat intelligence, and multi-cloud environments.
 *
 * @example
 * ```typescript
 * const address: FortiOSFirewallAddress = {
 *   name: 'internal-web-servers',
 *   type: FortiOSFirewallAddressType.IP_Mask,
 *   subnet: '192.168.100.0 255.255.255.0',
 *   comment: 'Internal web server subnet',
 *   color: 3,
 *   'allow-routing': CommonEnableDisable.Enable,
 *   'fabric-object': CommonEnableDisable.Enable,
 *   'associated-interface': 'internal',
 *   tagging: [{ name: 'Production', category: 'Environment', tags: [{ name: 'Critical' }] }],
 *   uuid: '550e8400-e29b-41d4-a716-446655440000'
 * };
 * ```
 */
export interface FortiOSFirewallAddress extends FortiOSFirewallAddrMeta {
  /**
   * Unique name identifier for the IPv4 address object within the FortiGate configuration.
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
   * Primary IPv4 address specification in format appropriate for the address type.
   * @required
   */
  subnet: string;

  /**
   * IPv4 address type defining how the address object is interpreted and used.
   * @required
   * @see FortiOSFirewallAddressType
   */
  type: FortiOSFirewallAddressTypes | FortiOSFirewallAddressType;

  /**
   * Sub-type classification for advanced address integration scenarios.
   * @requires dynamic address types
   * @optional
   */
  "sub-type"?: FortiOSFirewallAddressSubTypes | FortiOSFirewallAddressSubType;

  /**
   * Route tag identifier for routing policy integration and traffic engineering.
   * @minimum 1
   * @maximum 4294967295
   * @optional
   */
  "route-tag"?: number;

  /**
   * ClearPass System Posture Token value for device compliance assessment.
   * @requires sub-type must be 'clearpass-spt'
   * @optional
   */
  "clearpass-spt"?:
    | FortiOSFirewallAddressClearpassSPTs
    | FortiOSFirewallAddressClearpassSPT;

  /**
   * Collection of MAC addresses and ranges for Layer 2 device identification.
   * @requires type must be 'mac'
   * @maxLength 127
   * @optional
   */
  macaddr?: {
    /**
     * MAC address or range specification for device identification.
     * @maxLength 127
     * @required
     */
    macaddr: string;
  }[];

  /**
   * Starting IPv4 address for IP range address types (inclusive).
   * @requires type must be 'iprange'
   * @optional
   */
  "start-ip"?: string;

  /**
   * Ending IPv4 address for IP range address types (inclusive).
   * @requires type must be 'iprange'
   * @optional
   */
  "end-ip"?: string;

  /**
   * Fully Qualified Domain Name for DNS-based address resolution.
   * @maxLength 255
   * @requires type must be 'fqdn'
   * @optional
   */
  fqdn?: string;

  /**
   * ISO 3166-1 alpha-2 country code for geographic address filtering.
   * @maxLength 2
   * @requires type must be 'geography'
   * @optional
   */
  country?: string;

  /**
   * Wildcard FQDN pattern for flexible domain matching with wildcard characters.
   * @maxLength 255
   * @optional
   */
  "wildcard-fqdn"?: string;

  /**
   * Minimum TTL for FQDN DNS resolution caching in seconds.
   * @minimum 0
   * @maximum 86400
   * @requires type must be 'fqdn'
   * @optional
   */
  "cache-ttl"?: number;

  /**
   * IPv4 address with wildcard subnet mask for flexible network matching.
   * @requires type must be 'wildcard'
   * @optional
   */
  wildcard?: string;

  /**
   * SDN connector name for dynamic cloud integration.
   * @maxLength 35
   * @requires sub-type must be 'sdn' and type must be 'dynamic'
   * @optional
   */
  sdn?: string;

  /**
   * FSSO group mappings for user-based security policies.
   * @requires sub-type must be 'fsso'
   * @optional
   */
  "fsso-group"?: {
    /**
     * FSSO group name from authentication directory service.
     * @maxLength 511
     * @required
     */
    name: string;
  }[];

  /**
   * Network interface name for interface-based dynamic addressing.
   * @maxLength 35
   * @requires type must be 'interface-subnet'
   * @optional
   */
  interface?: string;

  /**
   * Multi-tenant identifier for cloud SDN environments.
   * @maxLength 35
   * @optional
   */
  tenant?: string;

  /**
   * Organization identifier for cloud service integration.
   * @maxLength 35
   * @optional
   */
  organization?: string;

  /**
   * Endpoint Group name for ACI integration.
   * @maxLength 255
   * @optional
   */
  "epg-name"?: string;

  /**
   * Cloud subnet name identifier for subnet-specific filtering.
   * @maxLength 255
   * @optional
   */
  "subnet-name"?: string;

  /**
   * SDN-specific tag identifier for object filtering and selection.
   * @maxLength 15
   * @optional
   */
  "sdn-tag"?: string;

  /**
   * Policy group identifier for advanced SDN integration scenarios.
   * @maxLength 15
   * @optional
   */
  "policy-group"?: string;

  /**
   * Dynamic object tag for runtime object identification and filtering.
   * @maxLength 255
   * @optional
   */
  "obj-tag"?: string;

  /**
   * Object type specification for dynamic address object classification.
   * @see FortiOSFirewallAddressObjectType
   * @optional
   */
  "obj-type"?:
    | FortiOSFirewallAddressObjectTypes
    | FortiOSFirewallAddressObjectType;

  /**
   * Tag detection sensitivity level for dynamic object monitoring.
   * @maxLength 15
   * @optional
   */
  "tag-detection-level"?: string;

  /**
   * Tag type specification for advanced dynamic address object categorization.
   * @maxLength 63
   * @optional
   */
  "tag-type"?: string;

  /**
   * Hardware vendor identification for dynamic address object device classification.
   * @maxLength 35
   * @optional
   */
  "hw-vendor"?: string;

  /**
   * Hardware model identification for granular device classification and policy control.
   * @maxLength 35
   * @optional
   */
  "hw-model"?: string;

  /**
   * Operating system identification for OS-specific security policies and compliance.
   * @maxLength 35
   * @optional
   */
  os?: string;

  /**
   * Software version identification for version-specific security policies and compliance.
   * @maxLength 35
   * @optional
   */
  "sw-version"?: string;

  /**
   * Administrative comment for documentation and management purposes.
   * @maxLength 255
   * @optional
   */
  comment?: string;

  /**
   * Network interface association for policy optimization and traffic flow control.
   * @maxLength 35
   * @optional
   */
  "associated-interface"?: string;

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
   * Kubernetes node address collection restriction control.
   * @values "enable" | "disable"
   * @optional
   */
  "node-ip-only"?: CommonEnableDisables | CommonEnableDisable;

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
     * @required
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
     * @required
     */
    name: string;

    /**
     * Tag category for organizational hierarchy and filtering.
     * @maxLength 63
     * @required
     */
    category: string;

    /**
     * Collection of individual tags within the category.
     * @required
     */
    tags: {
      /**
       * Individual tag name providing specific classification detail.
       * @maxLength 79
       * @required
       */
      name: string;
    }[];
  }[];

  /**
   * Static routing integration control for address object utilization.
   * @values "enable" | "disable"
   * @optional
   */
  "allow-routing"?: CommonEnableDisables | CommonEnableDisable;

  /**
   * Security Fabric global object distribution and synchronization control.
   * @values "enable" | "disable"
   * @optional
   */
  "fabric-object"?: CommonEnableDisables | CommonEnableDisable;
}

// FortiOS IPv4 firewall address type enumeration for type-safe configuration
export enum FortiOSFirewallAddressType {
  // Standard IPv4 address with subnet mask notation in dotted decimal format
  IP_Mask = "ipmask",
  // Contiguous range of IPv4 addresses between specified start and end points (inclusive)
  IP_Range = "iprange",
  // Fully Qualified Domain Name with IPv4 A-record DNS resolution capabilities
  FQDN = "fqdn",
  // Geographic region or country-based IPv4 address collections with threat intelligence
  Geography = "geography",
  // IPv4 wildcard subnet mask for complex non-contiguous matching patterns
  Wildcard = "wildcard",
  // Dynamic IPv4 address object with external cloud platform integration
  Dynamic = "dynamic",
  // IPv4 interface-based addressing that tracks interface IP configuration
  Interface_Subnet = "interface-subnet",
  // MAC address-based identification for Layer 2 policies with IPv4 correlation
  MAC = "mac",
}

// String literal type union for FortiOS IPv4 firewall address types
export type FortiOSFirewallAddressTypes =
  | "ipmask"
  | "iprange"
  | "fqdn"
  | "geography"
  | "wildcard"
  | "dynamic"
  | "interface-subnet"
  | "mac";

// Specialized sub-type classifications for advanced FortiOS address integration scenarios
export enum FortiOSFirewallAddressSubType {
  // Software Defined Networking (SDN) connector integration
  SDN = "sdn",
  // ClearPass System Posture Token (SPT) integration
  ClearPass_SPT = "clearpass-spt",
  // Fortinet Single Sign-On (FSSO) user group integration
  FSSO = "fsso",
  // FortiClient Endpoint Management Server (EMS) tag integration
  EMS_Tag = "ems-tag",
  // FortiVoice tag integration for VoIP security policies
  FortiVoice_Tag = "fortivoice-tag",
  // FortiNAC (Network Access Control) tag integration
  FortiNAC_Tag = "fortinac-tag",
  // Switch Controller NAC (Network Access Control) policy tag
  SWC_Tag = "swc-tag",
}

// String literal type union for FortiOS firewall address sub-types
export type FortiOSFirewallAddressSubTypes =
  | "sdn"
  | "clearpass-spt"
  | "fsso"
  | "ems-tag"
  | "fortivoice-tag"
  | "fortinac-tag"
  | "swc-tag";

// ClearPass System Posture Token (SPT) values for endpoint compliance assessment
export enum FortiOSFirewallAddressClearpassSPT {
  // Device posture status cannot be determined or is under evaluation
  Unknown = "unknown",
  // Device meets all security compliance requirements and policies
  Healthy = "healthy",
  // Device has security issues requiring network access restrictions
  Quarantine = "quarantine",
  // Device requires security assessment, updates, or policy compliance check
  Checkup = "checkup",
  // Temporary state during posture evaluation or transition process
  Transient = "transient",
  // Device is compromised and requires immediate network isolation
  Infected = "infected",
}

// String literal type union for ClearPass SPT values
export type FortiOSFirewallAddressClearpassSPTs =
  | "unknown"
  | "healthy"
  | "quarantine"
  | "checkup"
  | "transient"
  | "infected";

// Dynamic address object type classification for resolution targeting
export enum FortiOSFirewallAddressObjectType {
  // IP address-based dynamic objects for Layer 3 network policies
  IP = "ip",
  // MAC address-based dynamic objects for Layer 2 device identification
  MAC = "mac",
}

// String literal type union for dynamic address object types
export type FortiOSFirewallAddressObjectTypes = "ip" | "mac";

// Address collection scope for cloud and SDN dynamic address resolution
export enum FortiOSFirewallAddressCollectionType {
  // Collect RFC 1918 private IP addresses only
  Private = "private",
  // Collect public (internet-routable) IP addresses only
  Public = "public",
  // Collect both private and public IP addresses comprehensively
  All = "all",
}

// String literal type union for address collection types
export type FortiOSFirewallAddressCollectionTypes =
  | "private"
  | "public"
  | "all";
