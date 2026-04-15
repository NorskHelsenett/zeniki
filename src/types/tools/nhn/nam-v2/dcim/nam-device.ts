import { ObjectId } from "mongodb";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMContainer } from "./nam-container";
import { NAMCredential } from "./nam-credentials";
import { NAMVxlan } from "../ipam/nam-vxlan";
import { NAMAsn } from "../ipam/nam-asn";

/**
 * MLAG (Multi-Chassis Link Aggregation) configuration.
 */
export interface NAMDeviceMlag {
  /** MLAG domain. */
  domain?: string;

  /** Local interface. */
  localInterface?: string;

  /** Peer address. */
  peerAddress?: string;

  /** Peer link (usually port-channel for MLAG communication). */
  peerLink?: string;
}

/**
 * VPC (Virtual Port Channel) peer keepalive configuration.
 */
export interface NAMDeviceVpcPeerKeepAlive {
  /** Destination address. */
  destination?: string;

  /** Source address. */
  source?: string;
}

/**
 * VPC (Virtual Port Channel) configuration.
 */
export interface NAMDeviceVpc {
  /** VPC domain. */
  domain?: number;

  /** Role priority. */
  rolePriority?: number;

  /** System priority. */
  systemPriority?: number;

  /** Peer keepalive settings. */
  peerKeepAlive: NAMDeviceVpcPeerKeepAlive;
}

/**
 * Stack member configuration.
 */
export interface NAMDeviceStackMember {
  /** Serial number. */
  serial?: string;

  /** MAC address. */
  mac?: string;

  /** Stack ID. */
  stackId: number;

  /** Slot identifier. */
  slot?: string;

  /** Stack member type. */
  type?: string;

  /** Model reference. */
  model: any;
}

/**
 * Device module configuration.
 */
export interface NAMDeviceModule {
  /** Serial number. */
  serial?: string;

  /** Module name. */
  name?: string;

  /** Module type. */
  type?: string;
}

/**
 * ZTP (Zero Touch Provisioning) configuration.
 */
export interface NAMDeviceZtp {
  /** Temporary DHCP IP for staging. */
  ip?: string;

  /** ZTP mode (true = enabled, false = disabled). */
  mode?: boolean;

  /** ZTP status (not started, started, incomplete, completed, failed). */
  status?: string;
}

/**
 * NAM v2 Device configuration.
 * Network device configuration including management IP, stacking, MLAG/VPC,
 * and Zero Touch Provisioning settings.
 * 
 * @example
 * ```typescript
 * const device: NAMDevice = {
 *   serial: 'SN123456',
 *   hostname: 'switch-01',
 *   model: new ObjectId('...'),
 *   ip: '192.168.1.10',
 *   netmask: '255.255.255.0',
 *   gw: '192.168.1.1',
 *   ports: [],
 *   mlag: {},
 *   modules: [],
 *   peers: [],
 *   ztp: { status: 'not started' },
 *   container: new ObjectId('...')
 * };
 * ```
 */
export interface NAMDevice extends NAMDefaultFields {
  /** Device serial number. */
  serial: string;

  /** MAC address. */
  mac?: string;

  /** ASN reference. */
  asn?: NAMAsn | ObjectId;

  /** BGP configuration reference. */
  // bgp?: any;

  /** Router reference. */
  // router?: any;

  /** Device model reference. */
 //   model: any;

  /** Device hostname. */
  hostname: string;

  /** Domain name. */
  domain?: string;

  /** Device description. */
  description?: string;

  /** VLAN/Extended VLAN reference. */
  vxlan?: NAMVxlan | ObjectId;

  /** Management IPv4 address (without netmask). */
  ip?: string;

  /** IPv4 netmask. */
  netmask?: string;

  /** IPv4 default gateway. */
  gw?: string;

  /** Management IPv6 address (with netmask). */
  ip6?: string;

  /** IPv6 default gateway. */
  gw6?: string;

  /** Device firmware image (overrides model default). */
  //   firmware?: any;

  /** Default config for static configuration. */
  //   config?: any;

  /** Port configurations. */
  //   ports: any[];

  /** MLAG configuration. */
  //   mlag: NAMDeviceMlag;

  /** VPC configuration. */
  //   vpc?: NAMDeviceVpc;

  /** FEX reference. */
  //   fex?: any;

  /**
   * Stack ID.
   * undefined = no stack, 0 = virtual stack master, 1 = stack master, 2-64 = stack slave
   */
  //   stackId?: number;

  /** Stack member configurations. */
  //   stackMembers?: NAMDeviceStackMember[];

  /** Device modules. */
  //   modules: NAMDeviceModule[];

  /** Peer devices (for BGP routing, etc.). */
  //   peers: NAMDevice[];

  /** Route configurations. */
  //   routes?: any;

  /** ZTP configuration. */
  //   ztp: NAMDeviceZtp;

  /** Credential reference. */
  //   credential?: NAMCredential | ObjectId;

  /** Pair ID. */
  //   pair_id?: string;

  /** Container reference. */
  container: NAMContainer  | ObjectId;
}
