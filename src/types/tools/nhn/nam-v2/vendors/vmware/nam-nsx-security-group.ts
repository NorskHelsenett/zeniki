import { NAMDefaultFields } from "../../shared/nam-default-fields";

/**
 * NAM v2 NSX security group configuration.
 * Automated network synchronization from IPAM to VMware.
 *
 * @example
 * ```typescript
 * const integrator: NAMNsxSecurityGroup = {
 *   name: 'security-group-1',
 *   desc: 'Security group 1',
 *  scope: 'consumer',
 *  tag: 'example.com',
 *  ipAddresses: [
 *    { ip: '10.10.10.0/24' },
 *    { ip: '10.10.20.123/32' },
 *  ]
 * };
 * ```
 */
export interface NAMNsxSecurityGroup extends NAMDefaultFields {
  /** Security group name. */
  name: string;

  /** Description. */
  desc?: string;

  /** Scope */
  scope: string;

  /** Tag */
  tag: string;

  /** IP addresses associated with the security group */
  ipAddresses: NAMNsxSecurityGroupIP[];
}

export interface NAMNsxSecurityGroupIP {
  ip: string;
}
