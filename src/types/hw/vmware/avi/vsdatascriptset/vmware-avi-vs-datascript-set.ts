import { VMwareAVIPartial } from "../shared/vmware-avi-partial";
import { VMwareAVIRateLimiter } from "../shared/vmware-avi-rate-limiter";
import { VMwareAVIVSDataScript } from "./vmware-avi-vs-datascript";

/**
 * DataScript Set configuration for AVI Virtual Service.
 * Groups related DataScripts with their dependencies and resources.
 * @interface
 * @example
 * ```typescript
 * const set: VMwareAVIVSDataScriptSet = {
 *   name: 'my-datascript-set',
 *   datascript: [{ evt: 'VS_DATASCRIPT_EVT_HTTP_REQ', script: 'avi.http.method()' }],
 *   ipgroup_refs: ['/api/ipaddrgroup/ipgroup-1'],
 *   pool_refs: ['/api/pool/pool-1']
 * };
 * ```
 */
export interface VMwareAVIVSDataScriptSet extends Partial<VMwareAVIPartial> {
  /** Array of DataScripts in this set */
  datascript?: VMwareAVIVSDataScript[];
  /** Reference to GeoIP database */
  geo_db_ref?: string;
  /** Reference to IP reputation database */
  ip_reputation_db_ref?: string;
  /** References to IP address groups */
  ipgroup_refs?: string[];
  /** References to PKI profiles */
  pki_profile_refs?: string[];
  /** References to pool groups */
  pool_group_refs?: string[];
  /** References to pools */
  pool_refs?: string[];
  /** References to protocol parsers */
  protocol_parser_refs?: string[];
  /** Rate limiting configurations */
  rate_limiters?: VMwareAVIRateLimiter[];
  /** References to SSL key certificates */
  ssl_key_certificate_refs?: string[];
  /** References to SSL profiles */
  ssl_profile_refs?: string[];
  /** References to string groups */
  string_group_refs?: string[];
}
