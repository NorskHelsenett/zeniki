import { ObjectId } from "mongodb";
import { CommonKeyValueStore, SyncPriorities } from "../../../../common/common-types";
import { IPVersionString } from "../../../../utils/ip-types";
import { NetboxSite } from "../../../netbox/dcim/netbox-site";
import { NetboxTag } from "../../../netbox/extras/netbox-tag";
import { NetboxPrefixStatus, NetboxPrefixStatuses } from "../../../netbox/ipam/netbox-prefix";
import { NetboxRole } from "../../../netbox/ipam/netbox-role";
import { NetboxVrf } from "../../../netbox/ipam/netbox-vrf";
import { NetboxTenant } from "../../../netbox/tenancy/netbox-tenant";
import { NAMAPIEndpoint } from "../nam-api-endpoint";
import { NAMFortiOSVdom } from "../nam-fortios-vdom";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NHN_CommonNetboxExtraChoicesDomain, NHN_CommonNetboxExtraChoicesDomains, NHN_CommonNetboxExtraChoicesEnvironment, NHN_CommonNetboxExtraChoicesEnvironments, NHN_CommonNetboxExtraChoicesInfrastructure, NHN_CommonNetboxExtraChoicesInfrastructures, NHN_CommonNetboxExtraChoicesPurpose, NHN_CommonNetboxExtraChoicesPurposes } from "../../../../common/common-nhn-types";

/**
 * NAM v2 NetBox integrator configuration for automated network synchronization between NetBox IPAM and multi-vendor infrastructure.
 * Supports FortiGate firewall and VMware NSX integration with priority-based scheduling and custom field filtering.
 * 
 * @interface NAMNetboxIntegrator
 * @since NAM v2.0
 * @context NetBox IPAM integration and multi-vendor network automation
 * @see NAMDefaultFields
 * 
 * @example
 * ```typescript
 * const integrator: NAMNetboxIntegrator = {
 *   name: 'production-sync',
 *   sync_priority: 'high',
 *   enabled: true,
 *   address_family: '4',
 *   create_fg_group: true,
 *   netbox_endpoint: new ObjectId('507f1f77bcf86cd799439011'),
 *   fortigate_endpoints: [{ endpoint: new ObjectId('507f1f77bcf86cd799439012'), vdoms: [{ name: 'root', enabled: true }] }]
 * };
 * ```
 */
export interface NAMNetboxIntegrator extends NAMDefaultFields {
  /**
   * Integrator name identifier for configuration reference
   * @required
   */
  name: string;

  /**
   * Description text providing contextual information about integrator purpose
   * @optional
   */
  desc?: string;

  /**
   * Synchronization priority level determining execution order
   * @required
   * @see SyncPriorities
   */
  sync_priority: SyncPriorities;

  /**
   * Enable flag controlling integrator active state
   * @required
   */
  enabled: Boolean;

  /**
   * NetBox tenant objects array for multi-tenant filtering
   * @optional
   * @see NetboxTenant
   */
  tenants?: NetboxTenant[];

  /**
   * NetBox role object for prefix role-based filtering
   * @optional
   * @see NetboxRole
   */
  role?: NetboxRole;

  /**
   * NetBox site objects array for geographic filtering
   * @optional
   * @see NetboxSite
   */
  sites?: NetboxSite[];

  /**
   * NetBox prefix status filter for operational state selection
   * @optional
   * @see NetboxPrefixStatuses
   */
  status?: NetboxPrefixStatuses | NetboxPrefixStatus;

  /**
   * IP address family specification for protocol-specific operations
   * @optional
   * @see IPVersionString
   */
  address_family?: IPVersionString;

  /**
   * NetBox VRF object for virtual routing context
   * @optional
   * @see NetboxVrf
   */
  vrf?: NetboxVrf;

  /**
   * Hierarchy depth level for nested prefix traversal
   * @optional
   * @minimum 0
   * @maximum 10
   */
  depth?: number;

  /**
   * Maximum subnet mask length for prefix size constraints
   * @optional
   * @minimum 0
   * @maximum 32
   */
  mask_lte?: number;

  /**
   * Minimum subnet mask length for prefix size constraints
   * @optional
   * @minimum 0
   * @maximum 32
   */
  mask_gte?: number;

  /**
   * Enable FortiGate address group creation during sync
   * @optional
   */
  create_fg_group?: boolean;

  /**
   * Enable VMware NSX address group creation during sync
   * @optional
   */
  create_nsx_group?: boolean;

  /**
   * FortiGate address group name template
   * @optional
   */
  fg_group_name?: string;

  /**
   * VMware NSX address group name template
   * @optional
   */
  nsx_group_name?: string;

  /**
   * NSX group scope definition for security policy
   * @optional
   */
  nsx_group_scope?: string;

  /**
   * NSX group tag identifier for categorization
   * @optional
   */
  nsx_group_tag?: string;

  /**
   * Auto-generated NetBox API query string
   * @optional
   * @readonly
   */
  query?: string;

  /**
   * NetBox API endpoint configuration for connectivity
   * @required
   * @see NAMAPIEndpoint
   */
  netbox_endpoint: NAMAPIEndpoint | ObjectId | string;

  /**
   * FortiGate API endpoints array with VDOM mappings
   * @required
   * @minItems 1
   * @see NAMAPIEndpoint
   */
  fortigate_endpoints: { endpoint: NAMAPIEndpoint; vdoms: NAMFortiOSVdom[] }[];

  /**
   * VMware NSX API endpoints array for multi-environment deployment
   * @optional
   * @see NAMAPIEndpoint
   */
  nsx_endpoints?: NAMAPIEndpoint[] | ObjectId[] | string[];

  /**
   * NetBox environment custom field choice values
   * @optional
   * @see CommonKeyValueStore
   */
  environments?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesEnvironments | NHN_CommonNetboxExtraChoicesEnvironment | string>[];

  /**
   * NetBox domain custom field choice values
   * @optional
   * @see CommonKeyValueStore
   */
  domains?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesDomains | NHN_CommonNetboxExtraChoicesDomain | string>[];

  /**
   * NetBox infrastructure custom field choice values
   * @optional
   * @see CommonKeyValueStore
   */
  infrastructures?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesInfrastructures | NHN_CommonNetboxExtraChoicesInfrastructure| string>[];

  /**
   * NetBox purpose custom field choice values
   * @optional
   * @see CommonKeyValueStore
   */
  purposes?: CommonKeyValueStore<"name", NHN_CommonNetboxExtraChoicesPurposes | NHN_CommonNetboxExtraChoicesPurpose | string>[];

  /**
   * NetBox tag objects array for metadata filtering
   * @optional
   * @see NetboxTag
   */
  tags?: NetboxTag[];
}





