import { NAMDefaultFields } from "../shared/nam-default-fields";

/**
 * SNMP community user configuration.
 */
export interface NAMSnmpCommunityUser {
  /** Username. */
  user?: string;

  /** IP address. */
  remote?: string;

  /** UDP port. */
  port?: number;

  /** Authentication method (md5 or sha). */
  auth?: string;

  /** Authentication password. */
  password?: string;

  /** Privacy protocol (des, 3des, aes 128/192/256). */
  priv?: string;

  /** Privacy password. */
  privPassword?: string;
}

/**
 * NAM v2 SNMP Community configuration.
 * Defines SNMP community settings for network device monitoring and management.
 * 
 * @example
 * ```typescript
 * const snmpCommunity: NAMSnmpCommunity = {
 *   name: 1,
 *   readOnly: 'public',
 *   readWrite: 'private',
 *   version: 'v2c',
 *   group: null,
 *   userList: [
 *     {
 *       user: 'admin',
 *       remote: '192.168.1.0/24',
 *       port: 161,
 *       auth: 'sha',
 *       password: 'secret123',
 *       priv: 'aes128',
 *       privPassword: 'privsecret'
 *     }
 *   ]
 * };
 * ```
 */
export interface NAMSnmpCommunity extends NAMDefaultFields {
  /** Community name/identifier. */
  name: number;

  /** Read-only community string. */
  readOnly: string;

  /** Read-write community string. */
  readWrite: string;

  /** SNMP version. */
  version: string;

  /** SNMP group reference. */
  // group: any;

  /** List of SNMP users. */
  userList: NAMSnmpCommunityUser[];
}
