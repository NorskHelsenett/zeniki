import { VMwareAVIConfigPbAttributes } from "./vmware-avi-configpb-attr";
import { VMwareAVIRoleFilterMatchLabel } from "./vmware-avi-role-filter-match-label";

/**
 * Common base fields for AVI API objects.
 * Includes metadata, identity, and organizational attributes.
 * @interface
 * @example
 * ```typescript
 * const obj: VMwareAVIPartial = {
 *   name: 'my-object',
 *   description: 'Example object',
 *   tenant_ref: '/api/tenant/admin',
 *   uuid: '12345678-1234-1234-1234-123456789abc'
 * };
 * ```
 */
export interface VMwareAVIPartial {
  /** Last modification timestamp in microseconds since epoch */
  _last_modified?: string; // UNIX time since epoch in microseconds. Units(MICROSECONDS).
  /** Username that created this object */
  created_by?: string;
  /** Protocol buffer attributes */
  configpb_attributes?: VMwareAVIConfigPbAttributes;
  /** Object markers for filtering and organization */
  markers?: VMwareAVIRoleFilterMatchLabel[];
  /** Human-readable description */
  description?: string;
  /** Object name */
  name: string;
  /** Reference to tenant */
  tenant_ref?: string;
  /** API URL for this object */
  url?: string;
  /** Unique identifier */
  uuid?: string;
}
