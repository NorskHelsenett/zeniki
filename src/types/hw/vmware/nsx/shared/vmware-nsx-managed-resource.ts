import {
  VMwareProtectionStatuses,
  VMwareResourceTypes,
} from "./vmware-nsx-common";
import { VMwareNSXTag } from "./vmware-nsx-tag";

export interface VMwareNSXManagedResource {
  /**
   * Resource creation timestamp.
   * @readonly
   */
  readonly _create_time?: number;

  /**
   * User ID who created this resource.
   * @readonly
   */
  readonly _create_user?: string;

  /**
   * Last modification timestamp.
   * @readonly
   */
  readonly _last_modified_time?: number;

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
  readonly _protection?: VMwareProtectionStatuses;

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

  resource_type?: VMwareResourceTypes;
  /**
   * Tag collection for metadata and filtering.
   * @maxItems 30
   */
  tags?: VMwareNSXTag[] | [];
}
