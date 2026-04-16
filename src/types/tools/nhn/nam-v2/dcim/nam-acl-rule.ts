import { ObjectId } from "mongodb";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMAcl } from "./nam-acl";

/**
 * NAM v2 ACL (Access Control List) Rule configuration.
 * Defines individual rules within an access control list for network traffic filtering.
 * 
 * @example
 * ```typescript
 * const aclRule: NAMAclRule = {
 *   acl: new ObjectId('...'),
 *   remark: 'Allow HTTP traffic',
 *   seq: 10,
 *   permit: true,
 *   protocol: 'tcp',
 *   source: '192.168.1.0',
 *   sourceSubnetMask: '255.255.255.0',
 *   sourceWildcardMask: '0.0.0.255',
 *   sourcePort: 'any',
 *   destination: '10.0.0.0',
 *   destinationSubnetMask: '255.255.0.0',
 *   destinationWildcardMask: '0.0.255.255',
 *   destinationPort: 80,
 *   established: false,
 *   icmpType: null,
 *   log: true
 * };
 * ```
 */
export interface NAMAclRule extends NAMDefaultFields {
  /** ACL reference. */
  acl: NAMAcl | ObjectId;

  /** Remark or description for the rule. */
  remark: string;

  /** Sequence number. */
  seq: number;

  /** Permit (true) or deny (false). */
  permit: boolean;

  /** Protocol (tcp, udp, icmp, ip, etc.). */
  protocol: string;

  /** Source IP address. */
  source: string;

  /** Source subnet mask. */
  sourceSubnetMask: string;

  /** Source wildcard mask. */
  sourceWildcardMask: string;

  /** Source port. */
  sourcePort: number | string;

  /** Destination IP address. */
  destination: string;

  /** Destination subnet mask. */
  destinationSubnetMask: string;

  /** Destination wildcard mask. */
  destinationWildcardMask: string;

  /** Destination port. */
  destinationPort: number | string;

  /** Match established connections. */
  established: boolean;

  /** ICMP type. */
  icmpType: number | string | null;

  /** Enable logging. */
  log: boolean;
}
