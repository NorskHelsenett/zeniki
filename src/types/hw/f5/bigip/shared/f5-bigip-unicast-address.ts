/**
 * Unicast address configuration for F5 BIG-IP device communication.
 * @interface
 * @example
 * ```typescript
 * const addr: F5BigIPUnicastAddress = {
 *   effectiveIp: '10.0.0.1',
 *   effectivePort: 1026,
 *   ip: '10.0.0.1',
 *   port: 1026
 * };
 * ```
 */
export interface F5BigIPUnicastAddress {
  /** Effective IP address in use */
  effectiveIp: string;
  /** Effective port number in use */
  effectivePort: number;
  /** Configured IP address */
  ip: string;
  /** Configured port number */
  port: number;
}
