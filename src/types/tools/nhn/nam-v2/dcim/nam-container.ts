import { ObjectId } from "mongodb";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMAsn } from "../ipam/nam-asn";
import { NAMSnmpLocation } from "./nam-snmp-location";
import { NAMSnmpCommunity } from "./nam-snmp-community";

/**
 * NAM v2 Container configuration.
 * Hierarchical container structure for organizing network infrastructure
 * including organizations, regions, data centers, racks, and virtual environments.
 * 
 * @example
 * ```typescript
 * const container: NAMContainer = {
 *   name: 'dc-oslo-01',
 *   description: 'Oslo Data Center 1',
 *   type: 'dc',
 *   level: 2,
 *   asn: new ObjectId('...')
 * };
 * ```
 */
export interface NAMContainer extends NAMDefaultFields {
  /** Container ID. */
  id?: number;

  /** Container name. */
  name: string;

  /** Container description. */
  description?: string;

  /** Tenant identifier. */
  tenant?: string;

  /** Container type: org, reg, dc, rack, vdc, vrack. */
  type: string;

  /**
   * Hierarchy level.
   * 0 = no parent, 1 = region, 2 = data center, 3 = rack/vdc, 4 = vrack
   */
  level: number;

  /** ASN reference. */
  asn: NAMAsn | ObjectId;

  /** Parent container reference (for sub-containers). */
  parent?: NAMContainer | ObjectId;

  /** List of child containers. */
  children?: NAMContainer[];

  /** List of peer virtual data center containers (for level 3). */
  peers?: NAMContainer[];

  /** SNMP location reference (for site containers). */
  location?: NAMSnmpLocation | ObjectId;

  /** SNMP community reference (for devices in container). */
  community?: NAMSnmpCommunity | ObjectId;

  /** TFTP server reference. */
  tftp?: NAMTftpServer;

  /** Log server references. */
  logServers?: NAMLogServer[];
}


export interface NAMTftpServer {
  uri?: string;
  user?: string;
  password?: string;
}

export interface NAMLogServer {
  uri?: string;
  port?: string;
  secret?: string; // Shared secret (password).
}
