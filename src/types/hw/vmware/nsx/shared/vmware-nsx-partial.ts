import { VmwareGroupTypes, VmwareProtectionStatuses, VmwareRealizationState, VmwareRealizationStates, VmwareResourceTypes } from "./vmware-nsx-common"

/**
 * VMware NSX base properties for policy objects.
 * Provides standard metadata including creation time, protection status,
 * revision control, and hierarchical path information.
 * 
 * @example
 * ```typescript
 * const nsxObject: VMwareNSXPartial = {
 *   display_name: 'production-firewall',
 *   description: 'Production firewall rules',
 *   id: 'fw-prod-001',
 *   _revision: 1,
 *   _protection: 'NOT_PROTECTED'
 * };
 * ```
 */
export interface VMwareNSXPartial {
  /**
   * Resource creation timestamp.
   * @readonly
   */
  readonly _create_time?: Date;

  /**
   * User ID who created this resource.
   * @readonly
   */
  readonly _create_user?: string;

  /**
   * Last modification timestamp.
   * @readonly
   */
  readonly _last_modified_time?: Date;

  /**
   * User ID who last modified this resource.
   * @readonly
   */
  readonly _last_modified_user?: string;

  /**
   * Resource links populated by server.
   * @readonly
   */
  readonly _links?: [];

  /**
   * Protection status controlling modifications.
   * @readonly
   */
  readonly _protection?: VmwareProtectionStatuses;

  /** Current revision number for concurrency control. */
  _revision?: number;

  /**
   * Schema reference for this resource.
   * @readonly
   */
  readonly _schema?: string;

  /**
   * Self-reference link to this resource.
   * @readonly
   */
  readonly _self?: object;

  /**
   * Indicates if resource is system-owned.
   * @readonly
   */
  readonly _system_owned?: boolean;

  /** Hierarchical policy tree subtree. */
  children?: [];

  /**
   * Resource description text.
   * @maxLength 1024
   */
  description?: string;

  /**
   * Display name for logs and GUI.
   * @maxLength 255
   */
  display_name?: string;

  /** Resource identifier. */
  id?: string;

  /**
   * Indicates resource is marked for deletion.
   * @readonly
   */
  readonly marked_for_delete?: boolean;

  /**
   * UUID identifying which site owns this object.
   * @readonly
   */
  readonly origin_site_id?: string;

  /**
   * Indicates if global intent is overridden locally.
   * @readonly
   */
  readonly overridden?: boolean;

  /**
   * UUID identifying object owner.
   * @readonly
   */
  readonly owner_id?: string;

  /**
   * Absolute path of parent object.
   * @readonly
   */
  readonly parent_path?: string;

  /**
   * Absolute path of this object.
   * @readonly
   */
  readonly path?: string;

  /**
   * Unique identifier for realizing intent.
   * @readonly
   */
  readonly realization_id?: string;

  /**
   * Relative path from parent object.
   * @readonly
   */
  readonly relative_path?: string;

  /**
   * Object path on remote end.
   * @readonly
   */
  readonly remote_path?: string;

  /**
   * System-assigned unique identifier.
   * @readonly
   */
  readonly unique_id?: string;
}