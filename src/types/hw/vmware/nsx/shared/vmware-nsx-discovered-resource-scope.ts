import { VMwareNSXScopeTypes } from "./vmware-nsx-common";

/**
 * Scope of discovered resource
 *
 * @example
 * ```typescript
 * const scope: VMwareNSXDiscoveredResourceScope = {
 *   scope_id: "cluster-123",
 *   scope_type: "CONTAINER_CLUSTER"
 * };
 * ```
 */
export interface VMwareNSXDiscoveredResourceScope {
  /** Scope Id of scope for discovered resource */
  scope_id?: string;
  /** Type of scope */
  scope_type?: VMwareNSXScopeTypes;
}
