/**
 * FortiOS Virtual Domain configuration for multi-tenant security isolation.
 * Provides logical segmentation of FortiGate security processing with independent
 * firewall instances, isolated policies, and administrative access.
 * 
 * @example
 * ```typescript
 * const vdom: FortiOSSystemVDOM = {
 *   name: 'enterprise-prod',
 *   'short-name': 'entprod',
 *   'vcluster-id': 100,
 *   flag: 1
 * };
 * ```
 */
export interface FortiOSSystemVDOM {
  /**
   * VDOM name identifier.
   * @maxLength 31
   */
  name: string;

  /**
   * VDOM short name for abbreviated display.
   * @maxLength 11
   */
  "short-name"?: string;

  /**
   * Virtual cluster ID for VDOM clustering.
   * @minimum 0
   * @maximum 4294967295
   */
  "vcluster-id"?: number;

  /**
   * Flag value for VDOM operational state.
   * @minimum 0
   * @maximum 4294967295
   */
  flag?: number;
}
