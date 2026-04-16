import { ObjectId } from "mongodb";
import { NAMDefaultFields } from "../shared/nam-default-fields";
import { NAMVxlan } from "../ipam/nam-vxlan";
import { NAMSvi } from "../ipam/nam-svi";

/**
 * NAM v2 K8s Namespace Webhook configuration.
 * Webhook for managing Kubernetes namespace network configuration
 * with NetBox IPAM integration.
 *
 * @example
 * ```typescript
 * const webhook: NAMK8sNamespaceWebhook = {
 *   data_center: 'dc1',
 *   namespace_id: 'ns-12345',
 *   bgp: false,
 *   status: 'active',
 *   session_id: 'session-abc123'
 * };
 * ```
 */

export interface NAMK8sNamespaceWebhook extends NAMDefaultFields {
  /** Data center identifier. */
  data_center: string;

  /** Namespace ID. */
  namespace_id: string;

  /** BGP enabled status. */
  bgp: boolean;

  /** NAM VLAN reference. */
  nam_vlan?: NAMVxlan | ObjectId;

  /** NAM SVI reference. */
  nam_svi?: NAMSvi | ObjectId;

  /** NetBox VLAN ID. */
  netbox_vlan_id?: number;

  /** NetBox IPv4 prefix ID. */
  netbox_ipv4_prefix_id?: number;

  /** NetBox IPv6 prefix ID. */
  netbox_ipv6_prefix_id?: number;

  /** NetBox IPv4 egress prefix ID. */
  netbox_ipv4_egress_prefix_id?: number;

  /** Status of the webhook. */
  status: string;

  /** Response object. */
  response?: object;

  /** Session ID. */
  session_id: string;
}


