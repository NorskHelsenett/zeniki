import { ObjectId } from "mongodb";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMVrf } from "./nam-vrf";
import { NAMAcl } from "../dcim/nam-acl";
import { NAMContainer } from "../dcim/nam-container";

/**
 * ARP gratuitous configuration.
 */
export interface NAMArpGratuitous {
  /** Enable gratuitous ARP accept. */
  accept?: boolean;
}

/**
 * ARP monitor configuration.
 */
export interface NAMArpMonitor {
  /** MAC address to monitor. */
  mac?: string;
}

/**
 * ARP (Address Resolution Protocol) configuration.
 */
export interface NAMArp {
  /** Gratuitous ARP settings. */
  gratuitous?: NAMArpGratuitous;

  /** ARP monitor settings. */
  monitor?: NAMArpMonitor;

  /** ARP timeout in seconds (60-65535). */
  timeout?: number;
}

/**
 * NAM v2 SVI (Switch Virtual Interface) configuration.
 * Layer 3 interface configuration for VLANs with IP addressing and routing.
 * 
 * @example
 * ```typescript
 * const svi: NAMSVI = {
 *   name: 'Vlan100',
 *   description: 'Production VLAN SVI',
 *   type: 'routed',
 *   ip: '10.0.100.1/24',
 *   enabled: true,
 *   mtu: 1500,
 *   vrf: new ObjectId('...'),
 *   arp: {
 *     timeout: 300,
 *     gratuitous: { accept: true }
 *   },
 *   containers: []
 * };
 * ```
 */
export interface NAMSvi extends NAMDefaultFields {
  /** SVI name. */
  name: string;

  /** SVI description. */
  description?: string;

  /** Interface type. */
  type?: string;

  /** IPv4 address. */
  ip?: string;

  /** IPv6 address. */
  ip6?: string;

  /** IP helper address (DHCP relay). */
  ipHelper?: string;

  /** Interface enabled status. */
  enabled?: boolean;

  /** Maximum Transmission Unit. */
  mtu?: number;

  /** ARP configuration. */
  arp?: NAMArp;

  /** VRF reference. */
  vrf?: NAMVrf | ObjectId;

  /** Inbound ACL reference. */
  acl_in?: NAMAcl | ObjectId;

  /** Outbound ACL reference. */
  acl_out?: NAMAcl | ObjectId;

  /** Associated containers. */
  containers: NAMContainer[] | ObjectId[];
}
