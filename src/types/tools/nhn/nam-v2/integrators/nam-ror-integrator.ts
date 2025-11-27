import { ObjectId } from "mongodb";
import { NAMAPIEndpoint } from "../nam-api-endpoint";
import { NAMFortiOSVdom } from "../nam-fortios-vdom";
import { SyncPriorities } from "../../../../common/common-types";
import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 ROR integrator configuration.
 * Synchronizes ROR cluster data to FortiGate firewalls
 * with priority-based scheduling and VDOM support.
 *
 * @example
 * ```typescript
 * const integrator: NAMRorIntegrator = {
 *   name: 'ror-sync',
 *   sync_priority: 'medium',
 *   enabled: true,
 *   ror_endpoint: new ObjectId('...'),
 *   fortigate_endpoints: [{endpoint: {...}, vdoms: [...]}]
 * };
 * ```
 */
export interface NAMRorIntegrator extends NAMDefaultFields {
  /** Integrator name. */
  name: string;

  /** Description. */
  desc?: string;

  /** Synchronization priority. */
  sync_priority: SyncPriorities;

  /** Integrator is enabled. */
  enabled: boolean;

  /** FortiGate group name template. */
  fg_group_name: string;

  /** Data center identifier. */
  dc: string;

  /** ROR API endpoint. */
  ror_endpoint: NAMAPIEndpoint | ObjectId | string;

  /** FortiGate endpoints with VDOMs. */
  fortigate_endpoints: { endpoint: NAMAPIEndpoint; vdoms: NAMFortiOSVdom[] }[];
}
