import { RORClusterControlPlaneMetadataDatacenter } from "./ror-cluster-control-plane-metadata-datacenter";
import { RORClusterControlPlaneMetadataIp } from "./ror-cluster-control-plane-metadata-ip";

/**
 * ROR cluster control plane metadata.
 * Contains cluster configuration, networking, and datacenter information.
 *
 * @example
 * ```typescript
 * const metadata: RORClusterControlPlaneMetaData = {
 *   clusterId: 'cluster-123',
 *   clusterName: 'prod-k8s-01',
 *   environment: 'production',
 *   controlPlaneEndpoint: { ip: '10.0.0.1' },
 *   datacenter: { name: 'DC01' }
 * };
 * ```
 */
export interface RORClusterControlPlaneMetaData {
  /** Cluster identifier. */
  clusterId: string;

  /** Cluster name. */
  clusterName: string;

  /** Environment. */
  environment: string;

  /** Project name. */
  projectName: string | null;

  /** Control plane endpoint IP. */
  controlPlaneEndpoint: RORClusterControlPlaneMetadataIp;

  /** Control plane endpoint port. */
  controlPlaneEndpointPort: string | null;

  /** Egress IP. */
  egress: RORClusterControlPlaneMetadataIp;

  /** Datacenter information. */
  datacenter: RORClusterControlPlaneMetadataDatacenter;
}
