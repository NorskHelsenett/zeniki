import { VMwareNSXPolicyConfigResource } from "../../shared/vmware-nsx-policy-config-resource";

/**
 * Enforcement point where NSX policy configurations are applied.
 * Extends PolicyConfigResource with connection information and enforcement settings.
 *
 * @example
 * ```typescript
 * const enforcementPoint: VMwareNSXEnforcementPoint = {
 *   id: "default",
 *   display_name: "Default Enforcement Point",
 *   resource_type: "EnforcementPoint",
 *   connection_info: { },
 *   auto_enforce: true,
 *   version: "4.1.0",
 *   description: "Primary enforcement point",
 *   tags: [{ scope: "env", tag: "prod" }],
 *   _revision: 1,
 *   _create_time: 1234567890000,
 *   _last_modified_time: 1234567890000,
 *   path: "/infra/sites/default/enforcement-points/default"
 * };
 * ```
 */
export interface VMwareNSXEnforcementPoint
  extends Partial<VMwareNSXPolicyConfigResource> {
  /** Whether policy objects are automatically enforced on this endpoint */
  auto_enforce?: boolean;

  /** Connection information for the enforcement point */
  connection_info: VMwareNSXEnforcementPointResourceTypes;

  /** The type of this resource */
  resource_type?: string;

  /** Opaque identifiers meaningful to the API user (max 30) */
  tags?: Array<any>;

  /** Version of the enforcement point */
  readonly version?: string;
}

export type VMwareNSXEnforcementPointResourceTypes =
  | "NSXTConnectionInfo"
  | "NSXVConnectionInfo"
  | "CvxConnectionInfo"
  | "AviConnectionInfo";
