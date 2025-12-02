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
export interface NAMNsxIntegrator extends NAMDefaultFields {
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

  /** VMware NSX endpoints. */
  managers?: NAMAPIEndpoint[] | ObjectId[];

  /** VM tags */
  vm_tags?: NetboxTag[] | ObjectId[];

  /** Group tags */
  group_tags?: NetboxTag[] | ObjectId[];

  /** Exposed VMs */
  exposed_vms: boolean;

  /** FortiGate endpoints with VDOMs. */
  fortigate_endpoints: { endpoint: NAMAPIEndpoint; vdoms: NAMFortiOSVdom[] }[];
}
