import { F5BigIpDeviceState } from "./f5-bigip-device-state";

/**
 * Collection response for F5 BIG-IP device states.
 * @interface
 * @example
 * ```typescript
 * const collection: F5BigIPDeviceCollectionsState = {
 *   kind: 'tm:cm:device:devicecollectionstate',
 *   selfLink: 'https://bigip/mgmt/tm/cm/device',
 *   items: [{ name: 'bigip-01', ... }]
 * };
 * ```
 */
export interface F5BigIPDeviceCollectionsState {
  /** Resource kind identifier */
  kind: string;
  /** Self-reference link */
  selfLink: string;
  /** Array of device state objects */
  items: F5BigIpDeviceState[];
}
