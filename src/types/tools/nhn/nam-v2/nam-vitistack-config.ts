import { ObjectId } from "mongodb";
import { NAMAPIEndpoint } from "./nam-api-endpoint";
import { NAMFortiOSVdom } from "./nam-fortios-vdom";
import { NAMDefaultFields } from "./shared/nam-default-fields";
import { NAMContainer } from "./dcim/nam-container";
import { NAMAsn } from "./ipam/nam-asn";
import { NAMVrf } from "./ipam/nam-vrf";
import { NAMAcl } from "./dcim/nam-acl";


/**
 * NAM v2 Vitistack configuration.
 * Configuration for Vitistack data center network setup with
 * IPv4/IPv6 prefixes, FortiGate endpoints, and routing.
 * 
 * @example
 * ```typescript
 * const config: NAMVitistackConfig = {
 *   name: 'viti-dc1',
 *   display_name: 'Data Center 1',
 *   short_name: 'DC1',
 *   country: 'NO',
 *   city: 'Oslo',
 *   address: 'Main Street 1',
 *   vdc: new ObjectId('...'),
 *   infrastructure: 'production'
 * };
 * ```
 */
export interface NAMVitistackConfig extends NAMDefaultFields {
  /** Configuration name. */
  name: string;

  /** Display name for the configuration. */
  display_name: string;

  /** Short name identifier. */
  short_name: string;

  /** Country code. */
  country: string;

  /** City name. */
  city: string;

  /** Physical address. */
  address: string;

  /** Virtual datacenter container reference. */
  vdc: NAMContainer | ObjectId;

  /** IPv4 prefix container identifier. */
  ipv4_prefix_container: string;

  /** IPv6 prefix container identifier. */
  ipv6_prefix_container: string;

  /** Egress container identifier. */
  egress_container: string;

  /** Virtual service prefix container identifier. */
  vs_prefix_container: string;

  /** FortiGate API endpoint reference. */
  fortigate_endpoint: NAMAPIEndpoint | ObjectId;

  /** FortiGate VDOM reference. */
  fortigate_vdom: NAMFortiOSVdom | ObjectId;

  /** IPv4 helper addresses. */
  ipv4_helpers: string;

  /** ACL outbound reference. */
  acl_out: NAMAcl | ObjectId;

  /** VIP monitor configuration. */
  vip_monitor: string;

  /** VRF reference. */
  vrf: NAMVrf | ObjectId;

  /** ASN reference. */
  asn: NAMAsn | ObjectId;

  /** Infrastructure identifier. */
  infrastructure: string;

  /** Tenant reference. */
  tenant: string;
}