import { F5BigIPPartial } from "../../shared/f5-bigip-partial";
import { F5BigIPFirewallAddress } from "./f5-bigip-firewall-address";

/**
 * Collection of firewall addresses for F5 BIG-IP security policies.
 * @interface
 * @example
 * ```typescript
 * const addressList: F5BigIPFirewallAddressList = {
 *   name: 'trusted-hosts',
 *   addresses: [{ name: '192.168.1.10' }, { name: '192.168.1.20' }]
 * };
 * ```
 */
export interface F5BigIPFirewallAddressList extends F5BigIPPartial {
  /** Array of firewall address objects */
  addresses?: F5BigIPFirewallAddress[];
}
