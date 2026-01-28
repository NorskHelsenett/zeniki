/**
 * Query parameters for AVI API requests.
 * @interface
 * @example
 * ```typescript
 * const params: VMwareAVIParams = {
 *   name: 'pool-1',
 *   fields: 'name,uuid',
 *   include_name: true
 * };
 * ```
 */
export interface VMwareAVIParams {
  /** Filter by object name */
  name?: string;
  /** Filter by reference to another object */
  refers_to?: string;
  /** Filter by objects that refer to this object */
  referred_by?: string;
  /** Comma-separated list of fields to return */
  fields?: string;
  /** Include name in response */
  include_name?: boolean;
  /** Skip default values in response */
  skip_default?: boolean;
  /** Comma-separated list of subresources to join */
  join_subresources?: string;
}
