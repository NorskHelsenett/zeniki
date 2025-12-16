import { VMwareNSXSiteTypes } from "../../shared/vmware-nsx-common";
import { VMwareNSXPolicyConfigResource } from "../../shared/vmware-nsx-policy-config-resource";

/**
 * Site represents an NSX deployment having its own set of NSX clusters and transport nodes.
 * It may correspond to a Data Center, VMC deployment, or NSX-Cloud deployment managed via CSM.
 *
 * @example
 * ```typescript
 * const site: VMwareNSXSite = {
 *   id: "site-1",
 *   display_name: "Production Site",
 *   description: "Main production data center",
 *   resource_type: "Site",
 *   fail_if_rtep_misconfigured: true,
 *   fail_if_rtt_exceeded: true,
 *   maximum_rtt: 250,
 *   site_type: "ONPREM_LM",
 *   site_connection_info: [],
 *   tags: []
 * };
 * ```
 */
export interface VMwareNSXSite extends Partial<VMwareNSXPolicyConfigResource> {
  /**
   * Fail onboarding if RTEPs misconfigured
   */
  fail_if_rtep_misconfigured?: boolean;

  /**
   * Fail onboarding if maximum RTT exceeded
   */
  fail_if_rtt_exceeded?: boolean;

  /**
   * Federation releated config
   */
  readonly federation_config?: any;

  /**
   * Maximum acceptable packet round trip time (RTT)
   */
  maximum_rtt?: number;

  /**
   * The type of this resource
   */
  resource_type?: string;

  /**
   * Connection information
   */
  site_connection_info?: Array<any>;

  /**
   * 12-bit system generated site number
   */
  readonly site_number?: number;

  /**
   * Persistent Site Type. The site_type property identifies type of current site.
   */
  site_type?: VMwareNSXSiteTypes;

  /**
   * Opaque identifiers meaningful to the API user
   */
  tags?: Array<any>;
}
