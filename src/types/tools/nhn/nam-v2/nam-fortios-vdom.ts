import { NAMDefaultFields } from "./shared/nam-default-fields";

/**
 * NAM v2 FortiOS Virtual Domain (VDOM) configuration interface.
 * Extends NAMDefaultFields to provide MongoDB document tracking capabilities
 * for FortiGate VDOM management and multi-tenant firewall operations.
 * 
 * @interface NAMFortiOSVdom
 * @since NAM v2.0
 * @context FortiGate VDOM configuration and multi-tenant firewall management
 * 
 * @example
 * ```typescript
 * const vdom: NAMFortiOSVdom = {
 *   name: 'production-vdom',
 *   createdBy: 'admin',
 *   createdAt: new Date()
 * };
 * ```
 */
export interface NAMFortiOSVdom extends NAMDefaultFields {
  /**
   * FortiOS Virtual Domain name identifier
   * @required
   */
  name: string;
}