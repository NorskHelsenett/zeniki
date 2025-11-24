import { VmwareGroupTypes, VmwareProtectionStatuses, VmwareRealizationState, VmwareRealizationStates, VmwareResourceTypes } from "./vmware-nsx-common"

/**
 * VMware NSX partial interface providing common base properties for NSX policy objects.
 * Contains standard VMware NSX metadata fields including creation time, protection status,
 * revision control, and hierarchical path information for policy tree navigation.
 * 
 * @interface VMwareNSXPartial
 * @since NSX 3.0+
 * @context VMware NSX policy object base properties and resource management
 * 
 * @example
 * ```typescript
 * const nsxObject: VMwareNSXPartial = {
 *   display_name: 'production-firewall',
 *   description: 'Production environment firewall rules',
 *   id: 'fw-prod-001',
 *   _revision: 1,
 *   _protection: 'NOT_PROTECTED'
 * };
 * ```
 */
export interface VMwareNSXPartial {
  /**
   * Resource creation timestamp
   * @optional
   * @readonly
   */
  readonly _create_time?: Date;

  /**
   * User ID who created this resource
   * @optional
   * @readonly
   */
  readonly _create_user?: string;

  /**
   * Last modification timestamp
   * @optional
   * @readonly
   */
  readonly _last_modified_time?: Date;

  /**
   * User ID who last modified this resource
   * @optional
   * @readonly
   */
  readonly _last_modified_user?: string;

  /**
   * Resource links populated by server (ignored on PUT/POST)
   * @optional
   * @readonly
   */
  readonly _links?: [];

  /**
   * Protection status controlling modification permissions
   * @optional
   * @readonly
   * @see VmwareProtectionStatuses
   */
  readonly _protection?: VmwareProtectionStatuses;

  /**
   * Current revision number for concurrency control (required for PUT operations)
   * @optional
   */
  _revision?: number;

  /**
   * Schema reference for this resource
   * @optional
   * @readonly
   */
  readonly _schema?: string;

  /**
   * Self-reference link to this resource
   * @optional
   * @readonly
   */
  readonly _self?: object;

  /**
   * Indicates if resource is system-owned
   * @optional
   * @readonly
   */
  readonly _system_owned?: boolean;

  /**
   * Hierarchical policy tree subtree containing nested elements
   * @optional
   */
  children?: [];

  /**
   * Resource description text
   * @optional
   * @maxLength 1024
   */
  description?: string;

  /**
   * Display name for logs and GUI (defaults to ID if not set)
   * @optional
   * @maxLength 255
   */
  display_name?: string;

  /**
   * Resource identifier (required if display_name not used)
   * @optional
   */
  id?: string;

  /**
   * Indicates resource is marked for deletion (not returned in GET calls)
   * @optional
   * @readonly
   */
  readonly marked_for_delete?: boolean;

  /**
   * UUID identifying which site owns this object in NSX+ environments
   * @required
   * @readonly
   */
  readonly origin_site_id?: string;

  /**
   * Indicates if global intent object is overridden locally
   * @optional
   * @readonly
   */
  readonly overridden?: boolean;

  /**
   * UUID identifying object owner in NSX+ environments
   * @optional
   * @readonly
   */
  readonly owner_id?: string;

  /**
   * Absolute path of parent object
   * @optional
   * @readonly
   */
  readonly parent_path?: string;

  /**
   * Absolute path of this object
   * @optional
   * @readonly
   */
  readonly path?: string;

  /**
   * Unique identifier for realizing intent (UUID for data path correlation)
   * @optional
   * @readonly
   */
  readonly realization_id?: string;

  /**
   * Relative path from parent object
   * @optional
   * @readonly
   */
  readonly relative_path?: string;

  /**
   * Object path on remote end (multi-site scenarios only)
   * @optional
   * @readonly
   */
  readonly remote_path?: string;

  /**
   * System-assigned unique identifier (UUID) for federated environments
   * @optional
   * @readonly
   */
  readonly unique_id?: string;
}