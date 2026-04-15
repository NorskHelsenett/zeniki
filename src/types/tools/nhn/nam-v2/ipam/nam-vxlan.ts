import { ObjectId } from "mongodb";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMContainer } from "../dcim/nam-container";

/**
 * NAM v2 VXLAN configuration.
 *
 * @example
 * ```typescript
 * const vxlan: NAMVxlan = {
 *   id: 100,
 *   name: 'vlan-100',
 *   description: 'Production VLAN',
 *   redist_host_routes: true,
 *   containers: [new ObjectId('...')]
 * };
 * ```
 */
export interface NAMVxlan extends NAMDefaultFields {
  /**
   * VLAN ID.
   * @minimum 1
   * @maximum 4094
   */
  id: number;

  /** VLAN name. */
  name: string;

  /**
   * VNI (VXLAN Network Identifier).
   * Range: 1-16777215
   */
  vni?: number | string;

  /** VLAN description. */
  description: string;

  /** Redistribute host routes. */
  redist_host_routes: boolean;

  /** Container references. */
  containers: NAMContainer[] | ObjectId[];
}
