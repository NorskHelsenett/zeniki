/**
 * FortiOS 7.4.x Virtual Domain configuration interface for multi-tenant security isolation.
 * 
 * VDOMs provide complete logical segmentation of FortiGate security processing, enabling
 * independent firewall instances within single hardware platform. Each VDOM maintains
 * isolated security policies, routing tables, and administrative access for enterprise
 * multi-tenant deployments requiring strict organizational or customer separation.
 * 
 * Supports virtual clustering, hierarchical administration, and centralized hardware
 * management while maintaining logical network segment separation.
 * 
 * @example Multi-tenant VDOM configuration
 * ```typescript
 * const enterpriseVdom: FortiOSSystemVDOM = {
 *   name: 'enterprise-prod',
 *   'short-name': 'entprod',
 *   'vcluster-id': 100,
 *   flag: 1
 * };
 * ```
 * 
 * @see {@link https://docs.fortinet.com/document/fortigate/7.4.9/administration-guide/580894/virtual-domains-vdoms}
 * @since FortiOS 1.0
 */
export interface FortiOSSystemVDOM {
  /**
   * VDOM name identifier for virtual domain configuration and CLI reference.
   * 
   * @required
   * @maxLength 31
   */
  name: string;

  /**
   * VDOM short name for abbreviated display and administrative contexts.
   * 
   * @optional
   * @maxLength 11
   */
  "short-name"?: string;

  /**
   * Virtual cluster ID for VDOM clustering and high-availability configurations.
   * 
   * @optional
   * @minimum 0
   * @maximum 4294967295
   * @see {@link https://docs.fortinet.com/document/fortigate/7.4.9/administration-guide/580894/vdom-resource-allocation}
   */
  "vcluster-id"?: number;

  /**
   * Flag value for VDOM operational state and configuration parameters.
   * 
   * @optional
   * @minimum 0
   * @maximum 4294967295
   */
  flag?: number;
}
