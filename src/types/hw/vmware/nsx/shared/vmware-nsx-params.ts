/**
 * VMware NSX query parameters interface for API request configuration and result filtering.
 *
 * @example
 * ```typescript
 * const params: VMwareNSXParams = { cursor: 'eyJ...', page_size: 100, include_mark_for_delete_objects: false, included_fields: 'id,display_name', sort_by: 'display_name', sort_ascending: true };
 * ```
 */
export interface VMwareNSXParams {
  /** Opaque cursor for pagination to next page of records */
  cursor?: string;
  /** Include resources marked for deletion in results
   * @default false
   */
  include_mark_for_delete_objects?: boolean;
  /** Comma-separated list of fields to include in query result */
  included_fields?: string;
  /** Maximum number of results per page
   * @minimum 0
   * @maximum 1000
   * @default 1000
   */
  page_size?: number;
  /** Sort order direction for results */
  sort_ascending?: boolean;
  /** Field name for sorting records */
  sort_by?: string;
}
