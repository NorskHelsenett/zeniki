export interface RORClusterControlPlaneMetadataDatacenter {
  /**
   * Name of the datacenter within the Cluster Control Plane MetaData..
   * @required
   */
  name: string;

  /**
   * Provider of the datacenter within the Cluster Control Plane MetaData.
   * @required
   */
  provider: string;

  /**
   * API endpoint of the datacenter within the Cluster Control Plane MetaData.
   * @required
   */
  apiEndpoint: string;
}
