import { NAMDefaultFields } from "./shared/nam-default-fields";

/**
 * NAM v2 FortiOS Virtual Domain configuration.
 * FortiGate VDOM management for multi-tenant firewall operations.
 * 
 * @example
 * ```typescript
 * const vdom: NAMFortiOSVdom = {
 *   name: 'production-vdom',
 *   createdBy: 'admin'
 * };
 * ```
 */
export interface NAMFortiOSVdom extends NAMDefaultFields {
  /** VDOM name. */
  name: string;
}