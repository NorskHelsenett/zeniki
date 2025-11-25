import { ObjectId } from "mongodb";
import { NAMAPIEndpoint } from "../nam-api-endpoint";
import { NAMFortiOSVdom } from "../nam-fortios-vdom";
import { SyncPriorities } from "../../../../common/common-types";
import { NAMDefaultFields } from "../shared/nam-default-fields";

export interface NAMRorIntegrator extends NAMDefaultFields {
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
  enabled: boolean;

  /**
   * FortiGate address group name template
   * @optional
   */
  fg_group_name: string;

  /**
   * Data center identifier for integrator scope
   * @optional
   */
  dc: string;

  /**
   * ROR API endpoint configuration for connectivity
   * @required
   * @see NAMAPIEndpoint
   */
  ror_endpoint: NAMAPIEndpoint | ObjectId | string;

  /**
   * FortiGate API endpoints array with VDOM mappings
   * @required
   * @minItems 1
   * @see NAMAPIEndpoint
   */
  fortigate_endpoints: { endpoint: NAMAPIEndpoint; vdoms: NAMFortiOSVdom[] }[];
}
