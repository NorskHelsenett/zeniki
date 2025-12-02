import { VMwareNSXScopeTypes, VMwareResourceTypes } from "./vmware-nsx-common";
import { VMwareNSXResourceLink } from "./vmware-nsx-resource-link";
import { VMwareNSXSelfResourceLink } from "./vmware-nsx-self-resource-link";
import { VMwareNSXTag } from "./vmware-nsx-tag";

/**
 * Base class for resources that are discovered and automatically updated.
 * Extends Resource with additional tracking and synchronization capabilities.
 *
 * @example
 * ```typescript
 * const resource: VMwareNSXDiscoveredResource = {
 *   resource_type: "DiscoveredNode",
 *   display_name: "Discovered Server 01",
 *   description: "Automatically discovered compute resource",
 *   _last_sync_time: 1640995200000,
 *   scope: [{ scope_type: "VHC", scope_id: "/infra/vhc/vhc-1" }],
 *   tags: [{ scope: "environment", tag: "production" }]
 * };
 * ```
 */
export interface VMwareNSXDiscoveredResource {
  /** Timestamp of last modification */
  readonly _last_sync_time?: number;

  /** The server will populate this field when returing the resource. Ignored on PUT and POST. */
  readonly _links?: Array<VMwareNSXResourceLink>;

  /** Schema for this resource */
  readonly _schema?: string;

  /** Link to this resource */
  readonly _self?: VMwareNSXSelfResourceLink;

  /** Description of this resource
   *  @maxLength 1024
   */
  description?: string;

  /** Identifier to use when displaying entity in logs or GUI. Defaults to ID if not set
   *  @maxLength 255
   */
  display_name?: string;

  /** The type of this resource. */
  resource_type: VMwareResourceTypes;

  /** Specifies list of scope of discovered resource. e.g. if VHC path is associated with principal identity, who owns the discovered resource, then scope id will be VHC path and scope type will be VHC. */
  scope?: Array<VMwareNSXScopeTypes>;

  /** Opaque identifiers meaningful to the API user */
  tags?: Array<VMwareNSXTag>;
}
