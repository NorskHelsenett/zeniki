/**
 * ROR cluster IP address configuration.
 * IPv4/IPv6 addresses for control plane or egress.
 *
 * @example
 * ```typescript
 * const ip: RORClusterControlPlaneMetadataIp = {
 *   ipv4: '10.0.0.1',
 *   ipv6: '2001:db8::1'
 * };
 * ```
 */
export interface RORClusterControlPlaneMetadataIp {
  /** IPv4 address. */
  ipv4: string | null;

  /** IPv6 address. */
  ipv6: string | null;
}
