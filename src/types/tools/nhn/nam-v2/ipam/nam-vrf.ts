import { NAMContainer } from "../dcim/nam-container";
import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * NAM v2 VRF (Virtual Routing and Forwarding) configuration.
 * Defines VRF instances for network segmentation and routing isolation.
 * 
 * @example
 * ```typescript
 * const vrf: NAMVrf = {
 *   id: 100,
 *   vni: '10100',
 *   name: 'VRF-PROD',
 *   description: 'Production VRF',
 *   redistribute: 'connected',
 *   rd: '65000:100',
 *   rt: '65000:100',
 *   containers: []
 * };
 * ```
 */
export interface NAMVrf extends NAMDefaultFields {
  /** VRF identifier. */
  id: number;

  /** VNI (VXLAN Network Identifier). */
  vni: string;

  /** VRF name. */
  name: string;

  /** VRF description. */
  description: string;

  /** Redistribution policy. */
  redistribute: string;

  /** Route Distinguisher. */
  rd: string;

  /** Route Target. */
  rt: string;

  /** Associated containers. */
  containers: NAMContainer[];
}
