import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMAclRule } from "./nam-acl-rule";
import { NAMContainer } from "./nam-container";

/**
 * NAM v2 ACL (Access Control List) configuration.
 * Defines access control lists containing IPv4 and IPv6 rules for network traffic filtering.
 * 
 * @example
 * ```typescript
 * const acl: NAMAcl = {
 *   name: 'ACL-EXTERNAL',
 *   description: 'External traffic ACL',
 *   type: 1,
 *   ipv4Rules: [],
 *   ipv6Rules: [],
 *   containers: []
 * };
 * ```
 */
export interface NAMAcl extends NAMDefaultFields {
  /** ACL name. */
  name: string;

  /** ACL description. */
  description?: string;

  /** ACL type. */
  type: number;

  /** IPv4 ACL rules. */
  ipv4Rules: NAMAclRule[];

  /** IPv6 ACL rules. */
  ipv6Rules: NAMAclRule[];

  /** Associated containers. */
  containers: NAMContainer[];
}
