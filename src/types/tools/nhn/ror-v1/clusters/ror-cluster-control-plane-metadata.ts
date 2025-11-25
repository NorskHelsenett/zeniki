import { RORClusterControlPlaneMetadataDatacenter } from "./ror-cluster-control-plane-metadata-datacenter";
import { RORClusterControlPlaneMetadataIp } from "./ror-cluster-control-plane-metadata-ip";

export interface RORClusterControlPlaneMetaData {
  /**
   * ClusterId of the cluster within the ROR Cluster Control Plane MetaData.
   * @required
   */
  clusterId: string;

  /**
   * Name of the cluster within the ROR Cluster Control Plane MetaData.
   * @required
   */
  clusterName: string;

  /**
   * Environment within the ROR Cluster Control Plane MetaData.
   * @required
   */
  environment: string;

  /**
   * Project name within the ROR Cluster Control Plane MetaData.
   * @required
   */
  projectName: string | null;

  /**
   * Control plane endpoint within the ROR Cluster Control Plane MetaData.
   * @required
   */
  controlPlaneEndpoint: RORClusterControlPlaneMetadataIp;

  /**
   * Control plane endpoint port within the ROR Cluster Control Plane MetaData.
   * @required
   */
  controlPlaneEndpointPort: string | null;

  /**
   * Egress IP within the ROR Cluster Control Plane MetaData.
   * @required
   */
  egress: RORClusterControlPlaneMetadataIp;

  /**
   * Datacenter information within the ROR Cluster Control Plane MetaData.
   * @required
   */
  datacenter: RORClusterControlPlaneMetadataDatacenter;
}
