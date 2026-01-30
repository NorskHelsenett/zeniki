import {
  FailoverState,
  FailOverStates,
  StringBoolean,
  StringBooleans,
} from "../../../../../common/common-types";
import { F5BigIPLinkReference } from "../../shared/f5-bigip-link-reference";
import { F5BigIPUnicastAddress } from "../../shared/f5-bigip-unicast-address";

/**
 * Device state and configuration for F5 BIG-IP cluster member.
 * Contains device identity, networking, HA state, and module information.
 * @interface
 * @example
 * ```typescript
 * const device: F5BigIpDeviceState = {
 *   name: 'bigip-01',
 *   hostname: 'bigip-01.example.com',
 *   managementIp: '192.168.1.10',
 *   failoverState: 'active',
 *   selfDevice: 'true',
 *   version: '15.1.0'
 * };
 * ```
 */
export interface F5BigIpDeviceState {
  /** Resource kind identifier */
  kind: string;
  /** Device name */
  name: string;
  /** Configuration partition */
  partition: string;
  /** Full path to resource */
  fullPath: string;
  /** Configuration generation number */
  generation: number;
  /** Self-reference link */
  selfLink: string;
  /** Active licensed modules */
  activeModules: string[];
  /** Alternate IP address */
  alternateIp: string;
  /** Base MAC address */
  baseMac: string;
  /** Software build number */
  build: string;
  /** Device certificate */
  cert: string;
  /** Reference to certificate resource */
  certReference: F5BigIPLinkReference;
  /** Chassis identifier */
  chassisId: string;
  /** Chassis type */
  chassisType: string;
  /** ConfigSync IP address */
  configsyncIp: string;
  /** Software edition */
  edition: string;
  /** High availability failover state */
  failoverState: FailOverStates | FailoverState;
  /** HA capacity rating */
  haCapacity: number;
  /** Device hostname */
  hostname: string;
  /** Device license key */
  key: string;
  /** Reference to key resource */
  keyReference: F5BigIPLinkReference;
  /** Management IP address */
  managementIp: string;
  /** Marketing product name */
  marketingName: string;
  /** Management unicast mode */
  mgmtUnicastMode: string;
  /** Mirror IP address */
  mirrorIp: string;
  /** Secondary mirror IP address */
  mirrorSecondaryIp: string;
  /** Multicast interface name */
  multicastInterface: string;
  /** Multicast IP address */
  multicastIp: string;
  /** Multicast port number */
  multicastPort: number;
  /** Optional licensed modules */
  optionalModules: string[];
  /** Platform identifier */
  platformId: string;
  /** Product name */
  product: string;
  /** Whether this is the local device */
  selfDevice: StringBooleans | StringBoolean;
  /** Device timezone */
  timeZone: string;
  /** Software version */
  version: string;
  /** Unicast address configurations */
  unicastAddress: F5BigIPUnicastAddress[];
}
