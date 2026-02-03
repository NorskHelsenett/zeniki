/**
 * Firewall address object for F5 BIG-IP security policies.
 * @interface
 * @example
 * ```typescript
 * const address: F5BigIPFirewallAddress = {
 *   name: '192.168.1.10'
 * };
 * ```
 */
export interface F5BigIPFirewallAddress {
  /** IP address or hostname */
  name: string;
}
