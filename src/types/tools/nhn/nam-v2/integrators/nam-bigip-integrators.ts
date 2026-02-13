import { ObjectId } from "mongodb";
import {
  CommonKeyValueStore,
  SyncPriorities,
} from "../../../../common/common-types";
import { IPVersionString } from "../../../../utils/ip-types";
import { NetboxSite } from "../../../netbox/dcim/netbox-site";
import { NetboxTag } from "../../../netbox/extras/netbox-tag";
import {
  NetboxPrefixStatus,
  NetboxPrefixStatuses,
} from "../../../netbox/ipam/netbox-prefix";
import { NetboxRole } from "../../../netbox/ipam/netbox-role";
import { NetboxVrf } from "../../../netbox/ipam/netbox-vrf";
import { NetboxTenant } from "../../../netbox/tenancy/netbox-tenant";
import { NAMAPIEndpoint } from "../nam-api-endpoint";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import {
  NHN_CommonNetboxExtraChoicesEnvironment,
  NHN_CommonNetboxExtraChoicesEnvironments,
  NHN_CommonNetboxExtraChoicesInfrastructure,
  NHN_CommonNetboxExtraChoicesInfrastructures,
  NHN_CommonNetboxExtraChoicesPurpose,
  NHN_CommonNetboxExtraChoicesPurposes,
} from "../../../../common/common-nhn-types";

/**
 * NAM v2 NetBox integrator configuration.
 * Automated network synchronization between NetBox IPAM/NSX and and F5 BIG-IP.
 *
 * @example
 * ```typescript
 * const integrator: NAMBigIPIntegrator = {
 *   name: 'production-sync',
 *   sync_priority: 'high',
 *   enabled: true,
 *   address_family: '4',
 *   netbox_endpoint: new ObjectId('...'),
 *   bigip_endpoints: [{ endpoint: {...}, vdoms: [...] }]
 * };
 * ```
 */
export interface NAMBigIPIntegrator extends NAMDefaultFields {
  /** Integrator name. */
  name: string;

  /** Description. */
  desc?: string;

  /** Synchronization priority. */
  sync_priority: SyncPriorities;

  /** Integrator is enabled. */
  enabled: Boolean;

  /** scope. */
  scope: string;

  /** NSX managers for synchronization. */
  nsx_managers: NAMAPIEndpoint[];

  /** VM tags for synchronization. */
  vm_tags: NetboxTag[];

  /** Group tags for synchronization. */
  group_tags: NetboxTag[];

  /** BIG-IP endpoints for synchronization. */
  bigip_endpoints: NAMAPIEndpoint[];

  /** BIG-IP group name  */
  bigip_group_name: string;

  /** NetBox tenants for filtering. */
  tenants?: NetboxTenant[];

  /** NetBox role for filtering. */
  role?: NetboxRole;

  /** NetBox sites for filtering. */
  sites?: NetboxSite[];

  /** NetBox prefix status filter. */
  status?: NetboxPrefixStatuses | NetboxPrefixStatus;

  /** IP address family. */
  address_family?: IPVersionString;

  /** NetBox VRF. */
  vrf?: NetboxVrf;

  /**
   * Hierarchy depth level.
   * @minimum 0
   * @maximum 10
   */
  depth?: number;

  /**
   * Maximum subnet mask length.
   * @minimum 0
   * @maximum 32
   */
  mask_lte?: number;

  /**
   * Minimum subnet mask length.
   * @minimum 0
   * @maximum 32
   */
  mask_gte?: number;

  /**
   * NetBox API query string.
   * @readonly
   */
  query?: string;

  /** NetBox API endpoint. */
  netbox_endpoint: NAMAPIEndpoint | ObjectId | string;

  /** Environment custom field values. */
  environments?: CommonKeyValueStore<
    "name",
    | NHN_CommonNetboxExtraChoicesEnvironments
    | NHN_CommonNetboxExtraChoicesEnvironment
    | string
  >[];

  /** Domain custom field values. */
  domains?: CommonKeyValueStore<"name", string>[];

  /** Infrastructure custom field values. */
  infrastructures?: CommonKeyValueStore<
    "name",
    | NHN_CommonNetboxExtraChoicesInfrastructures
    | NHN_CommonNetboxExtraChoicesInfrastructure
    | string
  >[];

  /** Purpose custom field values. */
  purposes?: CommonKeyValueStore<
    "name",
    | NHN_CommonNetboxExtraChoicesPurposes
    | NHN_CommonNetboxExtraChoicesPurpose
    | string
  >[];

  /** NetBox tags for filtering. */
  tags?: NetboxTag[];
}
