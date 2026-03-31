import { ObjectId } from "mongodb";
import {
  CommonKeyValueStore,
  SyncPriorities,
} from "../../../../common/common-types";
import { NetboxTag } from "../../../netbox/extras/netbox-tag";
import { NAMAPIEndpoint } from "../nam-api-endpoint";
import { NAMFortiOSVdom } from "../nam-fortios-vdom";
import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 NSX integrator configuration.
 * Automated network synchronization between NSX and multi-vendor infrastructure
 * with FortiGate/VMware NSX support and priority-based scheduling.
 *
 * @example
 * ```typescript
 * const integrator: NAMNetboxIntegrator = {
 *   name: 'production-sync',
 *   sync_priority: 'high',
 *   enabled: true,
 *   address_family: '4',
 *   netbox_endpoint: new ObjectId('...'),
 *   fortigate_endpoints: [{ endpoint: {...}, vdoms: [...] }]
 * };
 * ```
 */
export interface NAMPassIntegrator extends NAMDefaultFields {
  /** Integrator name. */
  name: string;

  /** Description. */
  desc?: string;

  /** Synchronization priority. */
  sync_priority?: SyncPriorities;

  /** Integrator is enabled. */
  enabled: Boolean;

  /** scope. */
  scope?: string;

  /** FortiGate endpoints with VDOMs. */
  fg_group_name?: string;
  fortigate_endpoints: {
    endpoint: NAMAPIEndpoint;
    vdoms: NAMFortiOSVdom[];
    prefixes: string[];
  }[];
  nsx_group_name?: string;
  nsx_endpoints: { endpoint: NAMAPIEndpoint; prefixes: string[] }[];
}
