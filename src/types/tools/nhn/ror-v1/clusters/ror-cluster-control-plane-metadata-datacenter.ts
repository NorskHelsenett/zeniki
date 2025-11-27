/**
 * ROR cluster datacenter information.
 * Datacenter name, provider, and API endpoint.
 *
 * @example
 * ```typescript
 * const datacenter: RORClusterControlPlaneMetadataDatacenter = {
 *   name: 'DC01',
 *   provider: 'vmware',
 *   apiEndpoint: 'https://vcenter.example.com'
 * };
 * ```
 */
export interface RORClusterControlPlaneMetadataDatacenter {
  /** Datacenter name. */
  name: string;

  /** Datacenter provider. */
  provider: string;

  /** API endpoint. */
  apiEndpoint: string;
}
